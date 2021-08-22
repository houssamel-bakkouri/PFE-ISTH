import React, { useState, useEffect } from 'react'
import { Modal, Button, Form, Container, Row, Col } from 'react-bootstrap'
import axios from 'axios';


function AddFiliere({ show, handleClose }) {

    const [annees, setAnnees] = useState([])
    const [niveaux, setNiveaux] = useState([])

    const [selectedAnnee, setSelectedAnnee] = useState('')
    const [selectedNiveau, setSelectedNiveau] = useState('')
    const [nomFiliere, setNomFiliere] = useState('')
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'))

    const handleClick = () => {
        if (selectedAnnee === '' || selectedNiveau === '') {
            handleHide()
            return
        }
        axios.post('/api/filiere', { ANNEEID: selectedAnnee, NIVEAUID: selectedNiveau, NOMFILIERE: nomFiliere },
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('accessToken')
                }
            })
            .then(res => {
                console.log(res)
                if (!res.data.err) {
                    handleHide()
                }
            }, (err) => {
                axios.post('/api/token')
                    .then(res => {
                        localStorage.setItem('accessToken', res.data.accessToken)
                        handleClick()
                    }, err => window.location = "/")
            }).catch(err => {
                console.log('err:', err)
            })
    }

    const getAnnes = (mounted) => {
        axios.get(`/api/annee`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('accessToken')
            }
        })
            .then(res => {
                if (mounted)
                    setAnnees(res.data)
            }, (err) => {
                axios.post('/api/token')
                    .then(res => {
                        if (mounted) {
                            localStorage.setItem('accessToken', res.data.accessToken)
                            setAccessToken(localStorage.getItem('accessToken'))
                        }
                    }, err => window.location = "/")
            })
    }

    const getNiveaux = (mounted) => {
        axios.get(`/api/niveau`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('accessToken')
            }
        })
            .then(res => {
                if (mounted)
                    setNiveaux(res.data)
            }, (err) => {
                axios.post('/api/token')
                    .then(res => {
                        if (mounted) {
                            localStorage.setItem('accessToken', res.data.accessToken)
                            setAccessToken(localStorage.getItem('accessToken'))
                        }
                    }, err => window.location = "/")
            })
    }

    useEffect(() => {
        let mounted = true;
        getAnnes(mounted)
        getNiveaux(mounted)
        return () => mounted = false
    }, [accessToken])

    const handleHide = () => {
        handleClose()
        setSelectedAnnee('')
        setNomFiliere('')
        setSelectedNiveau('')
    }
    return (
        <Modal show={show} onHide={handleHide} backdrop="static"
            keyboard={false}>
            <Modal.Header>
                <Modal.Title>Ajouter filière</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form className="form-signin">
                    <div className="form-label-group">
                        <input
                            type="text"
                            id='filiere'
                            name='filiere'
                            className="form-control"
                            placeholder="Nauveau filière"
                            required
                            autoFocus
                            value={nomFiliere}
                            onChange={(e) => setNomFiliere(e.target.value)}
                        />
                        <label htmlFor="filiere">
                            Nom de filière
                        </label>
                    </div>
                    <Container>
                        <Row xs='auto'>
                            <Col>
                                <p className='text-start fs-5'>Année de formation :</p>
                            </Col>
                            <Col>
                                <Form.Control as="select" className="form-select" size="lg" aria-label="Annee de formation" onChange={(e) => setSelectedAnnee(e.target.value)}>
                                    <option value="">-</option>
                                    {
                                        annees.map(annee => {
                                            return (
                                                <option value={annee.anneeId}>{annee.annee}</option>
                                            )
                                        })
                                    }
                                </Form.Control>
                            </Col>
                        </Row>
                        <Row xs='auto'>
                            <Col>
                                <p className='text-start fs-5'>Niveaux :</p>
                            </Col>
                            <Col>
                                <Form.Control as="select" className="form-select" size="lg" aria-label="Annee de formation" onChange={(e) => setSelectedNiveau(e.target.value)}>
                                    <option value="">-</option>
                                    {
                                        niveaux.map(niveau => {
                                            return (
                                                <option value={niveau.NIVEAUID}>{niveau.NIVEAU}</option>
                                            )
                                        })
                                    }
                                </Form.Control>
                            </Col>
                        </Row>
                    </Container>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleClick}>
                    Ajouter
                </Button>
                <Button variant="secondary" onClick={handleHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AddFiliere
