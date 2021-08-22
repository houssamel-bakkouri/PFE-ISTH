import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Image, Form, Button, Modal } from 'react-bootstrap'
import profilPic from '../../Images/profilPic.jpg'
import axios from 'axios';
import ChangePassword from './ChangePassword';

function Home() {
    const [user, setUser] = useState({
        username: '',
        userType: '',
        firstName: '',
        lastName: ''
    })
    const [oldUser, setOldUser] = useState(user)
    const [showSave, setShowSave] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        axios.get('api/currentUser')
            .then(res => {
                let data = res.data.user
                const currentUser = {
                    username: data.username,
                    userType: data.userType,
                    firstName: data.firstName,
                    lastName: data.lastName
                }
                setUser(currentUser)
                setOldUser(currentUser)
            })
    }, [])

    const handleClose = () => setShowPassword(false)

    const handleChange = (event) => {
        const newUser = { ...user }
        newUser[event.target.getAttribute("name")] = event.target.value
        setUser(newUser)
    }

    const handleReset = () => {
        setUser(oldUser)
    }

    const handleSave = () => {
        setShowSave(true)
        axios.put('/api/user', { user },
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('accessToken')
                }
            })
            .then(res => {
                console.log(res.data)
            }, (err) => {
                axios.post('/api/token')
                    .then(res => {
                        localStorage.setItem('accessToken', res.data.accessToken)
                    }, err => window.location = "/")
            })
    }
    return (
        <>
            <ChangePassword show={showPassword} username={user.username} handleClose={handleClose} />
            <Modal show={showSave} onHide={() => setShowSave(false)}>
                <Modal.Body>Donnée sauvegardée avec succès</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowSave(false)}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>
            <Container className='w-75 p-3' style={{ backgroundColor: "white", borderRadius: "5px" }}>
                <Row xs='auto'>
                    <Col xs={6} md={4}>
                        <Image
                            width={171}
                            height={180}
                            src={profilPic} thumbnail
                        />
                    </Col>
                    <Col>
                        <p className="fs-1 fw-bold">{user.username}</p>
                    </Col>
                </Row>
                <Row>
                    <Col md={4}>
                        <p className="fs-3 fw-normal">Compte</p>
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col className='d-inline-flex'>
                        <p className="fs-5 fw-normal text-muted">Nom</p>
                    </Col>
                    <Col xs={8}>
                        <Form.Control type="text" placeholder="Nom" value={user.lastName} name='lastName' onChange={handleChange} />
                    </Col>
                </Row>
                <Row>
                    <Col className='d-inline-flex'>
                        <p className="fs-5 fw-normal text-muted">Prenom</p>
                    </Col>
                    <Col xs={8}>
                        <Form.Control type="text" placeholder="Prenom" name='firstName' value={user.firstName} onChange={handleChange} />
                    </Col>
                </Row>
                <Row>
                    <Col className='d-inline-flex'>
                        <p className="fs-5 fw-normal text-muted">Type d'utulisateur</p>
                    </Col>
                    <Col xs={8}>
                        <Form.Control readOnly type="text" placeholder="regulier" value={user.userType} onChange={handleChange} />
                    </Col>
                </Row>
                <Row>
                    <Col className='d-inline-flex'>
                        <p className="fs-5 fw-normal text-muted">Nom d'utilisateur</p>
                    </Col>
                    <Col xs={8}>
                        <Form.Control readOnly type="text" placeholder="Nom d'utilisateur" value={user.username} />
                    </Col>
                </Row>
                <Row>
                    <Col className='d-inline-flex'>
                        <p className="fs-5 fw-normal text-muted">Mot de passe</p>
                    </Col>
                    <Col>
                        <Form.Control readOnly type="password" placeholder="Mot de passe" value={'aaaaaaaaaaa'} />
                    </Col>
                    <Col >
                        <Button variant="secondary" onClick={() => setShowPassword(true)}>
                            Changer
                        </Button>
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col sm={8}></Col>

                    <Col >
                        <Button variant="success" onClick={handleSave}>
                            enregistrer
                        </Button>
                    </Col>
                    <Col >
                        <Button variant="secondary" onClick={handleReset}>
                            réinitialiser
                        </Button>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Home
