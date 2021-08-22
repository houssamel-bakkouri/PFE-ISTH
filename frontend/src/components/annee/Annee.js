import React, { useState, useEffect } from 'react'
import { Container, Table, Row, Col, Button, Form } from 'react-bootstrap'
import axios from 'axios';
import AddYear from './AddYear';
import EditableRow from './AnneeEditableRow';
import ReadOnlyRow from './AnneeReadOnlyRow';

function Annee() {
    const [yearsData, setYearData] = useState([])
    const [show, setShow] = useState(false)
    const [errMsg, setErrMsg] = useState(null)
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'))

    const [editAnneeId, setEditAnneeId] = useState(null)
    const [editFormData, setEditFormData] = useState('')

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const handleEditClick = (event, annee) => {
        event.preventDefault()
        setEditAnneeId(annee.anneeId)

        const formValues = {
            annee: annee.annee,
            nbrNiveaux: annee.nbrNiveaux,
            nbrFilieres: annee.nbrFilieres,
            nbrEtudiants: annee.nbrEtudiants
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
        const editedAnnee = {
            anneeId: editAnneeId,
            annee: editFormData.annee
        }

        const newAnnee = [...yearsData];

        const index = yearsData.findIndex((year) => year.anneeId === editAnneeId)

        newAnnee[index] = editedAnnee
        setYearData(newAnnee)
        axios.put('/api/annee', { editedAnnee },
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('accessToken')
                }
            })
            .then(res => {
                console.log(res)
                console.log(res.data)
            }, (err) => {
                axios.post('/api/token')
                    .then(res => {
                        console.log(res.data.accessToken)
                        localStorage.setItem('accessToken', res.data.accessToken)
                        handleEditFormSubmit(event)
                    }, err => window.location = "/")
            })
        setEditAnneeId(null)
    }

    const handleCancelClick = () => {
        setEditAnneeId(null)
    }

    const handleDeleteClick = (anneeId) => {
        const newAnnee = [...yearsData]
        const index = yearsData.findIndex((annee) => annee.anneeId === anneeId)
        newAnnee.splice(index, 1)
        setYearData(newAnnee)
        axios.delete(`/api/annee/${anneeId}`, {
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
                        console.log(res.data.accessToken)
                        localStorage.setItem('accessToken', res.data.accessToken)
                        handleDeleteClick(anneeId)
                    }, err => window.location = "/")
            })
    }

    const showAlert = () => {
        if (errMsg) return <div class="alert alert-danger" role="alert">{errMsg} </div>
    }

    useEffect(() => {
        let mounted = true;
        axios.get(`/api/annee`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('accessToken')
            }
        })
            .then(res => {
                if (mounted)
                    setYearData(res.data)
            }, (err) => {
                axios.post('/api/token')
                    .then(res => {
                        if (mounted) {
                            localStorage.setItem('accessToken', res.data.accessToken)
                            setAccessToken(localStorage.getItem('accessToken'))
                        }
                    }, err => window.location = "/")
            })
        return () => mounted = false
    }, [accessToken, yearsData])
    return (
        <Container>
            <p className="fs-2 fw-bold text-white">Années Scolaire</p>
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
            <AddYear show={show} handleClose={handleClose} />
            <Form onSubmit={handleEditFormSubmit}>
                <Table bordered hover variant='primary'>
                    <thead>
                        <tr>
                            <th>Année scolaire</th>
                            <th>Nombre de niveaux scolaire</th>
                            <th>Nombre de filières</th>
                            <th>Nombre d'étudiants</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            yearsData.map(year => {
                                return (
                                    <React.Fragment key={year.anneeId}>
                                        {
                                            editAnneeId === year.anneeId
                                                ? <EditableRow
                                                    editFormData={editFormData}
                                                    handleEditFormChange={handleEditFormChange}
                                                    handleCancelClick={handleCancelClick}
                                                />
                                                : <ReadOnlyRow
                                                    year={year}
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

export default Annee
