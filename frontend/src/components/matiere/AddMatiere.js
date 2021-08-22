import React, { useState, useEffect } from 'react'
import { Modal, Button, Container, Row, Col, Form } from 'react-bootstrap'
import axios from 'axios';

function AddMatiere({ handleSearch, show, handleClose, selectedFiliere }) {
    const [selectedProfId, setSelectedProfId] = useState('')
    const [nomModule, setNomModule] = useState('')
    const [coeifficient, setCoeifficient] = useState('')
    const [session, setSession] = useState('')
    const [codeModule, setCodeModule] = useState('')

    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'))

    const [profs, setProfs] = useState([])

    const handleHide = () => {
        handleClose()
        setSelectedProfId('')
        setNomModule('')
        setCoeifficient('')
        setSession('')
        setCodeModule('')
        handleSearch()
    }

    const handleClick = () => {
        if (selectedProfId === '' || nomModule === '' || coeifficient === ''
            || session === '' || codeModule === '')
            return
        const data = {
            FILIEREID: selectedFiliere,
            NUMEROPROFESSEUR: selectedProfId,
            NOMMODULE: nomModule,
            COEIFFICIENT: coeifficient,
            SESSION: session,
            CODEMODULE: codeModule
        }
        axios.post('/api/matiere', { data },
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

    const getProfs = (mounted) => {
        axios.get(`/api/professeur`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('accessToken')
            }
        })
            .then(res => {
                if (mounted)
                    setProfs(res.data)
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
        let mounted = true
        getProfs(mounted)
    }, [accessToken, profs])

    return (
        <Modal show={show} onHide={handleHide} backdrop="static"
            keyboard={false}>
            <Modal.Header>
                <Modal.Title>Ajouter matière</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form className="form-signin">
                    <div className="form-label-group">
                        <input
                            type="text"
                            id='nomModule'
                            name='nomModule'
                            className="form-control"
                            placeholder="Nom de matière"
                            required
                            autoFocus
                            value={nomModule}
                            onChange={(e) => setNomModule(e.target.value)}
                        />
                        <label htmlFor="nomModule">
                            Nom de matière
                        </label>
                    </div>
                    <div className="form-label-group">
                        <input
                            type="text"
                            id='codeModule'
                            name='codeModule'
                            className="form-control"
                            placeholder="Code de matière"
                            required
                            autoFocus
                            value={codeModule}
                            onChange={(e) => setCodeModule(e.target.value)}
                        />
                        <label htmlFor="codeModule">
                            Code de matière
                        </label>
                    </div>
                    <Container>
                        <Row xs='auto'>
                            <Col>
                                <p className='text-start fs-5'>Session :</p>
                            </Col>
                            <Col>
                                <Form.Control
                                    as="select"
                                    className="form-select"
                                    size="lg"
                                    aria-label="Annee de formation"
                                    onChange={(e) => setSession(e.target.value)}
                                >
                                    <option key='-' value="">-</option>
                                    <option key='1' value="1">Session 1</option>
                                    <option key='2' value="2">Session 2</option>

                                </Form.Control>
                            </Col>
                        </Row>
                    </Container>
                    <div className="form-label-group">
                        <input
                            type="text"
                            id='coeifficient'
                            name='coeifficient'
                            className="form-control"
                            placeholder="Coeifficient"
                            required
                            autoFocus
                            value={coeifficient}
                            onChange={(e) => setCoeifficient(e.target.value)}
                        />
                        <label htmlFor="coeifficient">
                            Coeifficient
                        </label>
                    </div>
                    <Container>
                        <Row xs='auto'>
                            <Col>
                                <p className='text-start fs-5'>Professeur :</p>
                            </Col>
                            <Col>
                                <Form.Control as="select" className="form-select" size="lg" aria-label="Annee de formation" onChange={(e) => setSelectedProfId(e.target.value)}>
                                    <option value="">-</option>
                                    {
                                        profs.map(prof => {
                                            return (
                                                <option value={prof.NUMEROPROFESSEUR}>{`${prof.NOMPROF} ${prof.PRENOMPROF}`}</option>
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

export default AddMatiere
