import React, { useState, useRef, useEffect } from 'react'
import { Table, Container, Row, Col, Form, Button } from 'react-bootstrap'
import axios from 'axios';
import RechercherNote from './RechercherNote';

function RleveControle() {
    const [annees, setAnnees] = useState([])
    const [niveaux, setNiveaux] = useState([])
    var filieres = useRef([])
    const [matieres, setMatieres] = useState([])

    const [etudiants, setEtudiants] = useState([])
    const [notes, setNotes] = useState([])

    const [selectedAnnee, setSelctedAnnee] = useState('')
    const [selectedNiveau, setSelectedNiveau] = useState('')
    const [selectedFiliere, setSelectedFiliere] = useState('')
    const [selectedMatiere, setSelctedMatiere] = useState('')

    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'))

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

    //ajouter les notes avec valeur null au étudaints dans db 
    const getEtudiants = () => {
        if (selectedNiveau === '' || selectedAnnee === '' || selectedFiliere === '')
            return
        axios.get(`/api/etudiant/?FILIEREID=${selectedFiliere}&ANNEEID=${selectedAnnee}&NIVEAUID=${selectedNiveau}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('accessToken')
            }
        })
            .then(res => {
                setEtudiants(res.data)
                console.log(res.data)
            }, (err) => {
                axios.post('/api/token')
                    .then(res => {
                        localStorage.setItem('accessToken', res.data.accessToken)
                        getEtudiants()
                    }, err => window.location = "/")
            })
    }

    const addNote = async () => {
        getEtudiants()
        etudiants.forEach(etudiant => {
            axios.post('/api/note', { CODEETUDIANT: etudiant.CODEETUDIANT, MODULEID: selectedMatiere },
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
                            addNote()
                        }, err => window.location = "/")
                }).catch(err => {
                    console.log('err:', err)
                })
        });
    }


    const handleSearch = () => {
        addNote()
        if (selectedMatiere === '')
            return
        axios.get(`/api/note/?matiereId=${selectedMatiere}&filiereId=${selectedFiliere}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('accessToken')
            }
        })
            .then(res => {
                setNotes(res.data)
                console.log(notes)
            }, (err) => {
                axios.post('/api/token')
                    .then(res => {
                        localStorage.setItem('accessToken', res.data.accessToken)
                        handleSearch()
                    }, err => window.location = "/")
            })
    }

    const handleMatiereChange = () => {
        if (selectedFiliere === '')
            return
        axios.get(`/api/matiere/?FILIEREID=${selectedFiliere}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('accessToken')
            }
        })
            .then(res => {
                setMatieres(res.data)
                console.log(res.data)
            }, (err) => {
                axios.post('/api/token')
                    .then(res => {
                        localStorage.setItem('accessToken', res.data.accessToken)
                        handleMatiereChange()
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

    const handleNoteChange = (e, id) => {
        e.preventDefault()
        if (e.target.value > 20 || e.target.value < 0)
            return
        const index = notes.findIndex(note => note.NOTEID === id)
        const newNotes = [...notes]
        var newNote = newNotes[index]
        newNote[e.target.name] = parseFloat(e.target.value)
        newNotes[index] = newNote
        setNotes(newNotes)
    }

    const calculeMoyenne = (note) => {

        let somme = (note.P1) ? parseFloat(note.P1) : 0
        let nbrNotes = (note.P1) ? 1 : 0
        if (note.C1) {
            somme += parseFloat(note.C1)
            nbrNotes++
        }
        if (note.C2) {
            somme += parseFloat(note.C2)
            nbrNotes++
        }
        if (note.C3) {
            somme += parseFloat(note.C3)
            nbrNotes++
        }
        if (note.C4) {
            somme += parseFloat(note.C4)
            nbrNotes++
        }
        if (note.C5) {
            somme += parseFloat(note.C5)
            nbrNotes++
        }
        if (note.C6) {
            somme += parseFloat(note.C6)
            nbrNotes++
        }
        const moyenne = parseFloat(somme) / parseFloat(nbrNotes)
        note.MoyenneC = moyenne
        return moyenne
    }

    const handleSave = () => {
        axios.put('/api/note', { notes },
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('accessToken')
                }
            })
            .then(res => {
                console.log(res)
            }, (err) => {
                axios.post('/api/token')
                    .then(res => {
                        console.log(res.data.accessToken)
                        localStorage.setItem('accessToken', res.data.accessToken)
                        handleSave()
                    }, err => window.location = "/")
            })
    }

    return (
        <Container>
            <p className="fs-2 fw-bold text-white">RELEVÉ DE CONTROLE</p>
            <RechercherNote
                selectedAnnee={selectedAnnee} setSelctedAnnee={setSelctedAnnee}
                annees={annees} niveaux={niveaux} filieres={filieres} matieres={matieres}
                selectedNiveau={selectedNiveau} setSelectedNiveau={setSelectedNiveau}
                selectedFiliere={selectedFiliere} setSelectedFiliere={setSelectedFiliere}
                selectedMatiere={selectedMatiere} setSelctedMatiere={setSelctedMatiere}
                handleSearch={handleSearch} handleMatiereChange={handleMatiereChange}
            />
            {notes.length > 0
                ?
                <Row>
                    <Col></Col>
                    <Col></Col>
                    <Col>
                        <Button className="pull-right" variant="success" onClick={handleSave}>
                            Sauvegarder
                        </Button>
                    </Col>
                </Row>
                :
                null
            }
            <h1> </h1>
            <Table bordered hover variant='primary'>
                <thead>
                    <tr>
                        <th>Nom et Prénom du Stagiaire</th>
                        <th colSpan="6">Contrôles continu</th>
                        <th>Participation</th>
                        <th>Moyenne</th>
                    </tr>
                </thead>
                <tbody>

                    {notes.map((note) => {
                        return (
                            <tr key={note.NOTEID}>
                                <td>
                                    {`${note.NOMETUDIANT} ${note.PRENOMETUDIANT}`}
                                </td>
                                <td>
                                    <Form.Control
                                        type="number"
                                        placeholder="Contrôle 1"
                                        name="C1"
                                        value={note.C1}
                                        onChange={(e) => handleNoteChange(e, note.NOTEID)}
                                    />
                                </td>
                                <td>
                                    <Form.Control
                                        type="number"
                                        placeholder="Contrôle 2"
                                        name="C2"
                                        value={note.C2}
                                        onChange={(e) => handleNoteChange(e, note.NOTEID)}
                                    />
                                </td>
                                <td>
                                    <Form.Control
                                        type="number"
                                        placeholder="Contrôle 3"
                                        name="C3"
                                        value={note.C3}
                                        onChange={(e) => handleNoteChange(e, note.NOTEID)}
                                    />
                                </td>
                                <td>
                                    <Form.Control
                                        type="number"
                                        placeholder="Contrôle 4"
                                        name="C4"
                                        value={note.C4}
                                        onChange={(e) => handleNoteChange(e, note.NOTEID)}
                                    />
                                </td>
                                <td>
                                    <Form.Control
                                        type="number"
                                        placeholder="Contrôle 5"
                                        name="C5"
                                        value={note.C5}
                                        onChange={(e) => handleNoteChange(e, note.NOTEID)}
                                    />
                                </td>
                                <td>
                                    <Form.Control
                                        type="number"
                                        placeholder="Contrôle 6"
                                        name="C6"
                                        value={note.C6}
                                        onChange={(e) => handleNoteChange(e, note.NOTEID)}
                                    />
                                </td>
                                <td>
                                    <Form.Control
                                        type="number"
                                        placeholder="Participation"
                                        name="P1"
                                        value={note.P1}
                                        onChange={(e) => handleNoteChange(e, note.NOTEID)}
                                    />
                                </td>
                                <td>
                                    {isNaN(calculeMoyenne(note)) ? null : calculeMoyenne(note).toFixed(2)}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>

        </Container>
    )
}

export default RleveControle
