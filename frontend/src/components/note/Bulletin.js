import React, { useState, useRef, useEffect } from 'react'
import { Table, Container, Row, Col, Form, Tab, Tabs } from 'react-bootstrap'
import axios from 'axios';
import RechercherEtudaint from '../etudiant/RechercherEtudaint';

function Bulletin() {
    const [classements, setClassements] = useState([])

    const [annees, setAnnees] = useState([])
    var filieres = useRef([])
    const [niveaux, setNiveaux] = useState([])
    const [etudiants, setEtudiants] = useState([])
    const [matieres, setMatieres] = useState([])

    const [selectedAnnee, setSelctedAnnee] = useState('')
    const [selectedFiliere, setSelectedFiliere] = useState('')
    const [selectedNiveau, setSelectedNiveau] = useState('')

    const [selectedEtudiant, setSelectedEtudiant] = useState(null)
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
    }, [accessToken, etudiants.length, matieres.length])

    useEffect(() => {
        if (!selectedEtudiant)
            return
        axios.get(`api/note/ByEtdiant/?etudiantId=${selectedEtudiant}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('accessToken')
            }
        })
            .then(res => {
                setMatieres(res.data)
            }, (err) => {
                axios.post('/api/token')
                    .then(res => {
                        localStorage.setItem('accessToken', res.data.accessToken)
                        setAccessToken(localStorage.getItem('accessToken'))
                    }, err => window.location = "/")
            })
    }, [accessToken, selectedEtudiant])

    const handleSearch = () => {
        setClassements([])
        if (selectedNiveau === '' || selectedAnnee === '' || selectedFiliere === '')
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

    const getMoyenneMatiere = (matiere) => {
        return (matiere.MoyenneC * 3 + matiere.TH * 2 + matiere.PR * 3) / 8
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

    const getMoyenneGenerale = (modules) => {
        var note = getMoyennePonderee(modules)
        return (note.cc * 3 + note.t * 2 + note.p * 3) / 8
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
                        Moyenne: getMoyenneGenerale(notes)
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

    return (
        <Container>
            <p className="fs-2 fw-bold text-white">Bulletins</p>
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
            <Tabs defaultActiveKey="Bulletin"
                id="uncontrolled-tab-example"
                className="mb-3"
            >
                <Tab eventKey="Bulletin" title="Bulletin" tabClassName='text-white bg-primary'>
                    <Row xs='auto'>
                        <Col>
                            <p className='text-start fs-2 text-white'>Etudaint :</p>
                        </Col>
                        <Col>
                            <Form.Control
                                as="select"
                                className="form-select"
                                size="lg"
                                onChange={(e) => setSelectedEtudiant(e.target.value)}
                            >
                                <option key={-1} value={null}>{null}</option>
                                {
                                    etudiants.map(etudiant => {
                                        return (
                                            <option key={etudiant.CODEETUDIANT} value={etudiant.CODEETUDIANT}>
                                                {`${etudiant.NOMETUDIANT} ${etudiant.PRENOMETUDIANT}`}
                                            </option>
                                        )
                                    })
                                }
                            </Form.Control>
                        </Col>
                    </Row>
                    {selectedEtudiant ?
                        <Table bordered hover variant='primary' id='RevcapCntTable'>
                            <thead>
                                <tr>
                                    <th>Module de formation</th>
                                    <th>Coeif</th>
                                    <th>Contôle continue</th>
                                    <th>Examen théorique</th>
                                    <th>Examen pratique</th>
                                    <th>Moyenne</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    matieres.map(matiere => {
                                        return (
                                            <tr>
                                                <td>{matiere.NOMMODULE}</td>
                                                <td>{matiere.COEIFFICIENT}</td>
                                                <td>{matiere.MoyenneC?.toFixed(2) ?? null}</td>
                                                <td>{matiere.TH?.toFixed(2) ?? null}</td>
                                                <td>{matiere.PR?.toFixed(2) ?? null}</td>
                                                <td>{getMoyenneMatiere(matiere)?.toFixed(2) ?? null}</td>
                                            </tr>
                                        )
                                    })
                                }
                                <tr>
                                    <th colSpan='2'>
                                        Moyenne pondérée en %
                                    </th>
                                    <td>{getMoyennePonderee(matieres).cc?.toFixed(2) ?? null}</td>
                                    <td>{getMoyennePonderee(matieres).t?.toFixed(2) ?? null}</td>
                                    <td>{getMoyennePonderee(matieres).p?.toFixed(2) ?? null}</td>
                                    <th></th>
                                </tr>
                                <tr>
                                    <th colSpan='2'>
                                        Moyenne Générale
                                    </th>
                                    <td colSpan='3'>{getMoyenneGenerale(matieres)?.toFixed(2) ?? null}</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </Table>
                        : null}
                </Tab>
                <Tab eventKey="Classement" title="Classement" tabClassName='text-white bg-primary'>
                    <Table bordered hover variant='primary' id='RevcapCntTable'>
                        <thead>
                            <tr>
                                <th>PLACE</th>
                                <th>NOM ET  PRENOM</th>
                                <th>MOYENNE </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                classements.map((classement, index) => {
                                    return (
                                        <tr>
                                            <td>{index + 1}</td>
                                            <td>{`${classement.nom} ${classement.prenom}`}</td>
                                            <td>{classement.Moyenne?.toFixed(2) ?? null}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </Tab>
                <Tab eventKey="Moyenne" title="Moyenne" tabClassName='text-white bg-primary'>
                    <Table bordered hover variant='primary' id='RevcapCntTable'>
                        <thead>
                            <tr>
                                <th>NOM ET PRENOM</th>
                                <th>MOY CC</th>
                                <th>MOY ET</th>
                                <th>MOY EP</th>
                                <th>MOYENNE ANNUELLE </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                classements.map(classement => {
                                    return (
                                        <tr>
                                            <td>{`${classement.nom} ${classement.prenom}`}</td>
                                            <td>{classement.cc?.toFixed(2) ?? null}</td>
                                            <td>{classement.t?.toFixed(2) ?? null}</td>
                                            <td>{classement.p?.toFixed(2) ?? null}</td>
                                            <td>{classement.Moyenne?.toFixed(2) ?? null}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </Tab>
            </Tabs>
        </Container>
    )
}

export default Bulletin
