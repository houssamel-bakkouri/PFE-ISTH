import React, { useState, useEffect, useRef } from 'react'
import { Container, Table, Col, Row, Button, Form } from 'react-bootstrap'
import axios from 'axios';
import RechercherMatiere from './RechercherMatiere';
import AddMatiere from './AddMatiere';
import EditableRow from './MatiereEditibleRow';
import ReadOnlyRow from './MatiereReadOnlyRow';

function Matiere() {

    const [annees, setAnnees] = useState([])
    var filieres = useRef([])
    const [niveaux, setNiveaux] = useState([])
    const [show, setShow] = useState(false)

    const [matieres, setMatieres] = useState([])

    const [selectedAnnee, setSelctedAnnee] = useState('')
    const [selectedFiliere, setSelectedFiliere] = useState('')
    const [selectedNiveau, setSelectedNiveau] = useState('')
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'))

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const finalSelectedFiliere = useRef(selectedFiliere)

    const [editMatiereId, setEditMatiereId] = useState(null)
    const [editFormData, setEditFormData] = useState({
        id: -1,
        matiereId: '',
        nomModule: '',
        coeif: '',
        session: '',
        codeModule: ''
    })

    const handleEditClick = (event, matiere) => {
        event.preventDefault()
        setEditMatiereId(matiere.MODULEID)
        const formValues = {
            id: matiere.MODULEID,
            matiereId: matiere.NUMEROPROFESSEUR,
            nomModule: matiere.NOMMODULE,
            coeif: matiere.COEIFFICIENT,
            session: matiere.SESSION,
            codeModule: matiere.CODEMODULE,
            profId: matiere.NUMEROPROFESSEUR
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
        const editedMatiere = {
            MODULEID: editMatiereId,
            NUMEROPROFESSEUR: editFormData.profId,
            NOMMODULE: editFormData.nomModule,
            COEIFFICIENT: editFormData.coeif,
            SESSION: editFormData.session,
            CODEMODULE: editFormData.codeModule
        }
        axios.put('/api/matiere', { editedMatiere },
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('accessToken')
                }
            })
            .then(res => {
                console.log(res)
                console.log(res.data)
                handleSearch()
            }, (err) => {
                axios.post('/api/token')
                    .then(res => {
                        console.log(res.data.accessToken)
                        localStorage.setItem('accessToken', res.data.accessToken)
                        handleEditFormSubmit(event)
                    }, err => window.location = "/")
            })
        setEditMatiereId(null)
    }

    const handleCancelClick = () => {
        setEditMatiereId(null)
    }

    const handleDeleteClick = (matiereId) => {
        const newMatiere = [...matieres]
        const index = matieres.findIndex((matiere) => matiere.MODULEID === matiereId)
        newMatiere.splice(index, 1)
        setMatieres(newMatiere)
        axios.delete(`/api/matiere/${matiereId}`, {
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
                        handleDeleteClick(matiereId)
                    }, err => window.location = "/")
            })
    }

    const getAnnees = (mounted) => {
        axios.get(`/api/annee`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('accessToken')
            }
        })
            .then(res => {
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

    const getFilieres = (mounted) => {
        axios.get(`/api/filiere`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('accessToken')
            }
        })
            .then(res => {
                filieres.current = res.data
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
        getAnnees(mounted)
        getFilieres(mounted)
        getNiveaux(mounted)
        return () => mounted = false
    }, [accessToken])

    const handleSearch = () => {
        if (selectedNiveau === '' || selectedAnnee === '' || selectedFiliere === '')
            return
        finalSelectedFiliere.current = selectedFiliere
        axios.get(`/api/matiere/?FILIEREID=${selectedFiliere}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('accessToken')
            }
        })
            .then(res => {
                setMatieres(res.data)
            }, (err) => {
                axios.post('/api/token')
                    .then(res => {
                        if (err.response.status === 404)
                            return
                        localStorage.setItem('accessToken', res.data.accessToken)
                        handleSearch()
                    }, err => window.location = "/")
            })
    }


    return (
        <>
            <AddMatiere
                handleSearch={handleSearch}
                show={show}
                handleClose={handleClose}
                selectedFiliere={finalSelectedFiliere.current}
            />
            <RechercherMatiere
                selectedAnnee={selectedAnnee}
                selectedNiveau={selectedNiveau}
                annees={annees}
                setSelctedAnnee={setSelctedAnnee}
                filieres={filieres}
                setSelectedFiliere={setSelectedFiliere}
                niveaux={niveaux}
                setSelectedNiveau={setSelectedNiveau}
                handleSearch={handleSearch}
            />
            <Container>
                <Row>
                    <Col></Col>
                    <Col></Col>
                    <Col>
                        {(finalSelectedFiliere.current !== '') ?
                            <Button className="pull-right" variant="success" onClick={handleShow}>
                                Ajouter
                            </Button>
                            : ''
                        }

                    </Col>
                </Row>
                <h1> </h1>
                <Form onSubmit={handleEditFormSubmit}>
                    <Table bordered hover variant='primary'>
                        <thead>
                            <tr>
                                <th>Module</th>
                                <th>Code</th>
                                <th>Session</th>
                                <th>Coeifficient</th>
                                <th>Professeur</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {matieres.map(matiere => {
                                return (
                                    <React.Fragment key={matiere.CODEETUDIANT}>
                                        {
                                            editMatiereId === matiere.MODULEID
                                                ? <EditableRow
                                                    editFormData={editFormData}
                                                    handleEditFormChange={handleEditFormChange}
                                                    handleCancelClick={handleCancelClick}
                                                />
                                                : <ReadOnlyRow
                                                    matiere={matiere}
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
        </>
    )
}

export default Matiere