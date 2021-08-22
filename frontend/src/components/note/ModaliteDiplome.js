import React, { useState, useRef, useEffect } from 'react'
import { Table, Container, Form, Col, Row, Button, Tab, Tabs } from 'react-bootstrap'
import axios from 'axios';
import RechercherEtudaint from '../etudiant/RechercherEtudaint';

function ModaliteDiplome() {
    const [classements, setClassements] = useState([])
    const [selectedEtudiantId, setSelectedEtudiantId] = useState(null)

    const defaultNiveau = '2'

    const [annees, setAnnees] = useState([])
    var filieres = useRef([])
    const [niveaux, setNiveaux] = useState([])
    const [etudiants, setEtudiants] = useState([])

    const [selectedAnnee, setSelctedAnnee] = useState('')
    const [selectedFiliere, setSelectedFiliere] = useState('')
    const [selectedNiveau, setSelectedNiveau] = useState('')

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
    }, [accessToken, etudiants.length])

    const handleSearch = () => {
        setClassements([])
        if ((selectedNiveau === '' && !defaultNiveau) || selectedAnnee === '' || selectedFiliere === '')
            return
        axios.get(`/api/etudiant/?FILIEREID=${selectedFiliere}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('accessToken')
            }
        })
            .then(res => {
                setEtudiants(res.data)
                CalculeClassement(res.data)
            }, (err) => {
                axios.post('/api/token')
                    .then(res => {
                        handleSearch()
                        localStorage.setItem('accessToken', res.data.accessToken)
                    }, err => window.location = "/")
            })
    }

    const getMoyennePonderee = (modules) => {
        var note = {
            cc: 0,
            p: 0,
            t: 0
        }
        var coef = 0
        modules.forEach(matiere => {
            coef += matiere.COEIFFICIENT
            note.cc += matiere.COEIFFICIENT * matiere.MoyenneC
            note.p += matiere.COEIFFICIENT * matiere.PR
            note.t += matiere.COEIFFICIENT * matiere.TH
        });
        note.cc /= coef
        note.p /= coef
        note.t /= coef
        return note
    }

    const getEtudiantById = (etudiants, etudiantId) => {
        return etudiants.filter(etudiant => etudiant.CODEETUDIANT === etudiantId)[0]
    }

    const CalculeClassement = (etudiants) => {
        var requests = []
        //fill the request array to use in the axios.all request
        etudiants.forEach(etudiant => {
            requests.push(axios.get(`api/note/ByEtdiant/?etudiantId=${etudiant.CODEETUDIANT}`, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('accessToken')
                }
            }))
        })
        axios.all(requests).then(axios.spread((...res) => {
            try {
                var notesEtudiants = []
                res.forEach(element => {
                    notesEtudiants.push(element.data)
                });
                notesEtudiants.forEach(notes => {
                    let etudiant = getEtudiantById(etudiants, notes[0].CODEETUDIANT)
                    let classement = {
                        place: null,
                        id: etudiant.CODEETUDIANT,
                        nom: etudiant.NOMETUDIANT,
                        prenom: etudiant.PRENOMETUDIANT,
                        cc: getMoyennePonderee(notes).cc,
                        t: getMoyennePonderee(notes).t,
                        p: getMoyennePonderee(notes).p,
                        ti: etudiant.TI,
                        Moyenne: parseFloat(etudiant.CC) * 0.3
                            + parseFloat(etudiant.TH) * 0.2
                            + parseFloat(etudiant.PR) * 0.3 + parseFloat(etudiant.TI) * 0.2
                    }
                    let exist = false
                    classements.forEach(cl => {
                        if (cl.id === classement.id) {
                            exist = true;
                        }
                    });
                    if (!exist)
                        classements.push(classement)
                    var len = classements.length
                    for (let i = 0; i < len - 1; ++i) {
                        for (let j = 0; j < len - i - 1; ++j) {
                            if (classements[j + 1].Moyenne > classements[j].Moyenne) {
                                let swap = classements[j];
                                classements[j] = classements[j + 1];
                                classements[j + 1] = swap;
                            }
                        }
                    }
                    setClassements([...classements])
                });
            } catch (error) {
                console.log(error)
                if (notesEtudiants.length > 0)
                    CalculeClassement(etudiants)
            }
        }, (err) => {
            axios.post('/api/token')
                .then(res => {
                    localStorage.setItem('accessToken', res.data.accessToken)
                    CalculeClassement(etudiants)
                }, err => window.location = "/")
        }))
    }

    const handleSave = () => {
        if (classements.length === 0)
            return
        //fill the request array to use in the axios.all request
        classements.forEach(cl => {
            axios.put(`api/etudiant/notes`, {
                id: cl.id,
                cc: cl.cc,
                t: cl.t,
                p: cl.p,
                ti: cl.ti
            },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('accessToken')
                    }
                }).then(res => {
                    console.log(res)
                }, (err) => {
                    axios.post('/api/token')
                        .then(res => {
                            localStorage.setItem('accessToken', res.data.accessToken)
                        }, err => window.location = "/")
                }).catch(err => {
                    console.log('err:', err)
                })
        })
    }

    const handleNoteChange = (e, id) => {
        e.preventDefault()
        if (e.target.value > 20 || e.target.value < 0)
            return
        const index = classements.findIndex(cl => cl.id === id)
        const newCls = [...classements]
        var newCl = newCls[index]
        newCl[e.target.name] = parseFloat(e.target.value)
        newCl.Moyenne = newCl.cc * 0.3 + newCl.t * 0.2 + newCl.p * 0.3 + newCl.ti * 0.2
        newCls[index] = newCl
        setClassements(newCls)
    }

    const getClassement = id => {
        const classement = classements.filter(cl => cl.id === parseInt(id))
        if (classement.length === 0)
            return {
                cc: null,
                t: null,
                p: null,
                ti: null
            }
        return classement[0]
    }

    const getNoteFianle = classement => {
        return (classement.cc * 3 + classement.t * 2 + classement.p * 3 + classement.ti * 2) / 10
    }

    return (
        <Container>
            <p className="fs-2 fw-bold text-white">MODALITES D'OBTENTION DU DIPLOME</p>
            <RechercherEtudaint
                defaultNiveau={defaultNiveau}
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
            <Tabs defaultActiveKey="Tout"
                id="uncontrolled-tab-example"
                className="mb-3"
            >
                <Tab eventKey="Tout" title="Tout" tabClassName='text-white bg-primary'>
                    <Row>
                        <Col></Col>
                        <Col></Col>
                        <Col>
                            <Button className="pull-right" variant="success" onClick={handleSave}>
                                Sauvegarder
                            </Button>
                        </Col>
                    </Row>
                    <h1> </h1>
                    <Table bordered hover variant='primary' id='RevcapCntTable'>
                        <thead>
                            <tr>
                                <th>NOM & PRENOM</th>
                                <th>Contrôles Continus</th>
                                <th>Examenes Théorique</th>
                                <th>Examenes Pratique</th>
                                <th>Traveaux Individuels</th>
                                <th>MOYENNE Générale </th>
                                <th>Decision du Jury d'examen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                classements.map(classement => {
                                    return (
                                        <tr>
                                            <td>{`${classement.nom} ${classement.prenom}`}</td>
                                            <td>{classement.cc}</td>
                                            <td>{classement.t}</td>
                                            <td>{classement.p}</td>
                                            <td>
                                                <Form.Control
                                                    type="number"
                                                    name="ti"
                                                    value={classement.ti}
                                                    onChange={(e) => handleNoteChange(e, classement.id)}
                                                />
                                            </td>
                                            <td>{classement.Moyenne}</td>
                                            <td>{classement.Moyenne < 10 ? "-" : "Lauréat(e)"}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </Tab>
                <Tab eventKey="Individuelle" title="Individuelle" tabClassName='text-white bg-primary'>
                    <Row xs='auto'>
                        <Col>
                            <p className='text-start fs-2 text-white'>Etudaint :</p>
                        </Col>
                        <Col>
                            <Form.Control
                                as="select"
                                className="form-select"
                                size="lg"
                                onChange={(e) => setSelectedEtudiantId(e.target.value)}
                            >
                                <option key={-1} value={null}>{null}</option>
                                {
                                    classements.map(cl => {
                                        return (
                                            <option key={cl.id} value={cl.id}>
                                                {`${cl.nom} ${cl.prenom}`}
                                            </option>
                                        )
                                    })
                                }
                            </Form.Control>
                        </Col>
                    </Row>
                    {selectedEtudiantId ?
                        <Table bordered hover variant='primary' id='RevcapCntTable'>
                            <thead>
                                <tr>
                                    <th>Report des notes obtenues</th>
                                    <th>Contrôles Continus</th>
                                    <th>EFCF Théorique</th>
                                    <th>EFCF Pratique</th>
                                    <th></th>
                                </tr>
                                <tr>
                                    <th></th>
                                    <th colSpan='3'>Moyenne des notes 1ère année + 2ème année</th>
                                    <th>NSTI</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td></td>
                                    <td> {getClassement(selectedEtudiantId).cc}</td>
                                    <td> {getClassement(selectedEtudiantId).t}</td>
                                    <td> {getClassement(selectedEtudiantId).p}</td>
                                    <td> {getClassement(selectedEtudiantId).ti}</td>
                                </tr>
                                <tr>
                                    <th>NOTE FINALE</th>
                                    <th colSpan='4'>{getNoteFianle(getClassement(selectedEtudiantId))}</th>
                                </tr>
                            </tbody>
                        </Table>
                        : null}
                </Tab>
            </Tabs>
        </Container>
    )
}

export default ModaliteDiplome
