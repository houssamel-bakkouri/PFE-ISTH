import React, { useState, useEffect, useRef } from 'react'
import { Container, Table, Col, Row, Button, Form } from 'react-bootstrap'
import axios from 'axios';
import RechercherEtudaint from './RechercherEtudaint';
import AddEtudiant from './AddEtudiant';
import ReadOnlyRow from './EtudiantReadOnlyRow';
import EditableRow from './EtudiantEditibleRow';
import AddExistingEtudiant from './AddExistingEtudiant';

function Etudiant() {

    const [annees, setAnnees] = useState([])
    var filieres = useRef([])
    const [niveaux, setNiveaux] = useState([])
    const [show, setShow] = useState(false)

    const [etudiants, setEtudiants] = useState([])

    const [selectedAnnee, setSelctedAnnee] = useState('')
    const [selectedFiliere, setSelectedFiliere] = useState('')
    const [selectedNiveau, setSelectedNiveau] = useState('')
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'))

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const finalSelectedFiliere = useRef(selectedFiliere)

    const [editEtudiantId, setEditEtudiantId] = useState(null)
    const [editFormData, setEditFormData] = useState({
        id: -1,
        nom: '',
        prenom: '',
        telephone: ''
    })
    const handleEditClick = (event, etudiant) => {
        event.preventDefault()
        setEditEtudiantId(etudiant.CODEETUDIANT)
        const formValues = {
            id: etudiant.CODEETUDIANT,
            nom: etudiant.NOMETUDIANT,
            prenom: etudiant.PRENOMETUDIANT,
            telephone: etudiant.NUMEROTELETUDIANT
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
        const editedEtudiant = {
            CODEETUDIANT: editEtudiantId,
            NOMETUDIANT: editFormData.nom,
            PRENOMETUDIANT: editFormData.prenom,
            NUMEROTELETUDIANT: editFormData.telephone,
        }

        const newEtudiants = [...etudiants];

        const index = etudiants.findIndex((etudiant) => etudiant.CODEETUDIANT === editEtudiantId)

        newEtudiants[index] = editedEtudiant
        setEtudiants(newEtudiants)
        axios.put('/api/etudiant', { editedEtudiant: editedEtudiant },
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
        setEditEtudiantId(null)
    }

    const handleCancelClick = () => {
        setEditEtudiantId(null)
    }

    const handleDeleteClick = (etudiantId) => {
        const newEtudiant = [...etudiants]
        const index = etudiants.findIndex((etudiant) => etudiant.CODEETUDIANT === etudiantId)
        newEtudiant.splice(index, 1)
        setEtudiants(newEtudiant)
        axios.delete(`/api/etudiant/${etudiantId}`, {
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
                        handleDeleteClick(etudiantId)
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
    }, [accessToken, show])

    const handleSearch = () => {
        if (selectedNiveau === '' || selectedAnnee === '' || selectedFiliere === '')
            return
        finalSelectedFiliere.current = selectedFiliere
        axios.get(`/api/etudiant/?FILIEREID=${selectedFiliere}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('accessToken')
            }
        })
            .then(res => {
                setEtudiants(res.data)
            }, (err) => {
                axios.post('/api/token')
                    .then(res => {
                        localStorage.setItem('accessToken', res.data.accessToken)
                        handleSearch()
                    }, err => window.location = "/")
            })
    }

    return (
        <>
            {parseInt(selectedNiveau) === 1
                ?
                <AddEtudiant
                    handleSearch={handleSearch}
                    show={show}
                    handleClose={handleClose}
                    selectedFiliere={finalSelectedFiliere.current}
                />
                :
                <AddExistingEtudiant
                    currentEtudiant={etudiants}
                    handleSearch={handleSearch}
                    show={show}
                    setShow={setShow}
                    handleClose={handleClose}
                    selectedFiliere={finalSelectedFiliere.current}
                    selectedAnnee={selectedAnnee}
                    filieres={filieres}
                    annees={annees}
                />
            }
            <p className="fs-2 fw-bold text-white">Liste des étudiants</p>
            <RechercherEtudaint
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
                        <Button className="pull-right" variant="success" onClick={handleShow}>
                            Ajouter
                        </Button>
                    </Col>
                </Row>
                <h1> </h1>
                <Form onSubmit={handleEditFormSubmit}>
                    <Table bordered hover variant='primary'>
                        <thead>
                            <tr>
                                <th>N°</th>
                                <th>Nom</th>
                                <th>Prenom</th>
                                <th>Numéro de téléphone</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {etudiants.map((etudiant, index) => {
                                return (
                                    <React.Fragment key={etudiant.CODEETUDIANT}>
                                        {
                                            editEtudiantId === etudiant.CODEETUDIANT
                                                ? <EditableRow
                                                    index={index}
                                                    editFormData={editFormData}
                                                    handleEditFormChange={handleEditFormChange}
                                                    handleCancelClick={handleCancelClick}
                                                />
                                                : <ReadOnlyRow
                                                    index={index}
                                                    etudiant={etudiant}
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

export default Etudiant
