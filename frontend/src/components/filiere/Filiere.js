import React, { useState, useEffect } from 'react'
import { Container, Table, Row, Col, Button, Form } from 'react-bootstrap'
import axios from 'axios';
import AddFiliere from './AddFiliere'
import EditableRow from './FiliereEditibleRow';
import ReadOnlyRow from './FiliereReadOnlyRow';

function Filiere() {
    const [filieres, setFilieres] = useState([])
    const [show, setShow] = useState(false)
    const [errMsg, setErrMsg] = useState(null)
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'))

    const [editFiliereId, setEditFiliereId] = useState(null)
    const [editFormData, setEditFormData] = useState('')

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const handleEditClick = (event, filiere) => {
        event.preventDefault()
        setEditFiliereId(filiere.FILIEREID)

        const formValues = {
            FILIEREID: filiere.FILIEREID,
            NOMFILIERE: filiere.NOMFILIERE,
            ANNEEID: filiere.ANNEEID,
            ANNEE: filiere.ANNEE,
            NIVEAUID: filiere.NIVEAUID,
            NIVEAU: filiere.NIVEAU
        }
        setEditFormData(formValues);
    }

    const handleEditFormChange = (event) => {
        event.preventDefault()
        const fieldName = event.target.getAttribute("name");
        const fieldValue = event.target.value;

        const newFormData = { ...editFormData };
        newFormData[fieldName] = fieldValue;
        setEditFormData(newFormData);
    }

    const handleEditFormSubmit = (event) => {
        event.preventDefault()
        const editedFiliere = {
            FILIEREID: editFiliereId,
            NOMFILIERE: editFormData.NOMFILIERE,
            ANNEEID: editFormData.ANNEEID,
            ANNEE: editFormData.ANNEE,
            NIVEAUID: editFormData.NIVEAUID,
            NIVEAU: editFormData.NIVEAU
        }
        axios.put('/api/filiere', { editedFiliere },
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('accessToken')
                }
            })
            .then(res => {
                console.log(res)
                console.log(res.data)
                getFilieres(true)
            }, (err) => {
                axios.post('/api/token')
                    .then(res => {
                        console.log(res.data.accessToken)
                        localStorage.setItem('accessToken', res.data.accessToken)
                        handleEditFormSubmit(event)
                    }, err => window.location = "/")
            })
        setEditFiliereId(null)
    }

    const handleCancelClick = () => {
        setEditFiliereId(null)
    }

    const handleDeleteClick = (filiereId) => {
        const newFiliere = [...filieres]
        const index = filieres.findIndex((filiere) => filiere.FILIEREID === filiereId)
        newFiliere.splice(index, 1)
        setFilieres(newFiliere)
        axios.delete(`/api/filiere/${filiereId}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('accessToken')
            }
        })
            .then(res => {
                console.log(res)
                console.log(res.data)
                if (res.data.err) {
                    setErrMsg(res.data.msg)
                }
            }, (err) => {
                axios.post('/api/token')
                    .then(res => {
                        localStorage.setItem('accessToken', res.data.accessToken)
                        handleDeleteClick(filiereId)
                    }, err => window.location = "/")
            })
    }

    const showAlert = () => {
        if (errMsg) return <div class="alert alert-danger" role="alert">{errMsg} </div>
    }

    const getFilieres = (mounted) => {
        axios.get(`/api/filiere`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('accessToken')
            }
        })
            .then(res => {
                if (mounted)
                    setFilieres(res.data)
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
        getFilieres(mounted)
        return () => mounted = false
    }, [accessToken, filieres])
    return (
        <Container>
            <p className="fs-2 fw-bold text-white">Filières</p>
            <Row>
                <Col></Col>
                <Col></Col>
                <Col>
                    <Button className="pull-right" variant="success" onClick={handleShow}>
                        Ajouter
                    </Button>
                </Col>
            </Row>
            <h1> </h1>
            {showAlert()}
            <AddFiliere show={show} handleClose={handleClose} />
            <Form onSubmit={handleEditFormSubmit}>
                <Table bordered hover variant='primary'>
                    <thead>
                        <tr>
                            <th>Filière</th>
                            <th>Année</th>
                            <th>Niveau</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filieres.map(filiere => {
                                return (
                                    <React.Fragment key={filiere.FILIEREID}>
                                        {
                                            editFiliereId === filiere.FILIEREID
                                                ? <EditableRow
                                                    editFormData={editFormData}
                                                    handleEditFormChange={handleEditFormChange}
                                                    handleCancelClick={handleCancelClick}
                                                />
                                                : <ReadOnlyRow
                                                    filiere={filiere}
                                                    handleEditClick={handleEditClick}
                                                    handleDeleteClick={handleDeleteClick}
                                                />
                                        }
                                    </React.Fragment>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </Form>
        </Container >
    )
}

export default Filiere
