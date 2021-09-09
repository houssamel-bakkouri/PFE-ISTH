import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import AddProfModal from './AddProfModal';
import ReadOnlyRow from './ProfReadOnlyRow';
import EditableRow from './ProfEditableRow';
import { Container, Row, Col, Table, Form, Button } from 'react-bootstrap';

export const showModalContext = React.createContext()

function Professeur() {
    const [profs, setProfs] = useState([])
    const [show, setShow] = useState(false)
    const [errMsg, setErrMsg] = useState(null)
    const profsRef = useRef(setProfs)
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'))

    // the id of the row that we are editing, if we are not editing any row the value is null
    const [editProfId, setEditProfId] = useState(null)
    const [editFormData, setEditFormData] = useState({
        id: -1,
        nom: '',
        prenom: '',
        telephone: '',
        email: '',
        cin: ''
    })

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const handleEditClick = (event, prof) => {
        event.preventDefault()
        setEditProfId(prof.NUMEROPROFESSEUR)
        const formValues = {
            id: prof.NUMEROPROFESSEUR,
            nom: prof.NOMPROF,
            prenom: prof.PRENOMPROF,
            telephone: prof.TELPROFESSEUR,
            email: prof.EMAILPROFESSEUR,
            cin: prof.CINPROF
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
        const editedProf = {
            NUMEROPROFESSEUR: editProfId,
            NOMPROF: editFormData.nom,
            PRENOMPROF: editFormData.prenom,
            TELPROFESSEUR: editFormData.telephone,
            EMAILPROFESSEUR: editFormData.email,
            CINPROF: editFormData.cin
        }

        const newProfs = [...profs];

        const index = profs.findIndex((prof) => prof.NUMEROPROFESSEUR === editProfId)

        newProfs[index] = editedProf
        setProfs(newProfs)
        axios.put('/api/professeur', { editedProf },
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
        setEditProfId(null)
    }

    const handleCancelClick = () => {
        setEditProfId(null)
    }

    const handleDeleteClick = (profId) => {
        const newProfs = [...profs]
        const index = profs.findIndex((prof) => prof.NUMEROPROFESSEUR === profId)
        newProfs.splice(index, 1)
        setProfs(newProfs)
        axios.delete(`/api/professeur/${profId}`, {
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
                        handleDeleteClick(profId)
                    }, err => window.location = "/")
            })
    }

    const showAlert = () => {
        if (errMsg) return <div class="alert alert-danger" role="alert">{errMsg} </div>
    }

    useEffect(() => {
        let mounted = true
        axios.get('/api/professeur', {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('accessToken')
            }
        })
            .then(res => {
                if (mounted)
                    profsRef.current(res.data)
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
    }, [accessToken, profs, profsRef])

    return (
        <Container>
            <p className="fs-2 fw-bold text-white">Gestion des Professeurs</p>
            <showModalContext.Provider value={{ show, handleShow, handleClose }}>
                <AddProfModal />
                <Container>
                    <Row>
                        <Col></Col>
                        <Col></Col>
                        <Col>
                            <Button className="pull-right" variant="success" onClick={handleShow}>
                                Ajouter
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col><h1> </h1></Col>
                    </Row>
                    <h1> </h1>
                    {showAlert()}
                </Container>
            </showModalContext.Provider>
            <Form onSubmit={handleEditFormSubmit}>
                <Table bordered hover variant='primary'>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Prenom</th>
                            <th>Telephone</th>
                            <th>Email</th>
                            <th>CIN</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {profs.map(prof => {
                            return (
                                <React.Fragment key={prof.NUMEROPROFESSEUR}>
                                    {
                                        editProfId === prof.NUMEROPROFESSEUR
                                            ? <EditableRow
                                                editFormData={editFormData}
                                                handleEditFormChange={handleEditFormChange}
                                                handleCancelClick={handleCancelClick}
                                            />
                                            : <ReadOnlyRow
                                                prof={prof}
                                                handleEditClick={handleEditClick}
                                                handleDeleteClick={handleDeleteClick}
                                            />
                                    }
                                </React.Fragment>
                            )
                        })}
                    </tbody>
                </Table>
            </Form>
        </Container>
    )
}

export default Professeur
