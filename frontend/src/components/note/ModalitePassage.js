import React, { useState, useRef, useEffect } from 'react'
import { Table, Container } from 'react-bootstrap'
import axios from 'axios';
import RechercherEtudaint from '../etudiant/RechercherEtudaint';

function ModalitePassage() {
    const [classements, setClassements] = useState([])

    const defaultNiveau = '1'

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
            <p className="fs-2 fw-bold text-white">MODALITES DE PASSAGE DE LA 1ERE EN 2EME ANNEE</p>
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
            <Table bordered hover variant='primary' id='RevcapCntTable'>
                <thead>
                    <tr>
                        <th>NOM & PRENOM</th>
                        <th>Contrôles Continus</th>
                        <th>Examenes Théorique</th>
                        <th>Examenes Pratique</th>
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
                                    <td>{classement.Moyenne}</td>
                                    <td>{classement.Moyenne < 10 ? "NON ADMIS(E) EN 2 EME ANNEE" : "ADMIS(E) EN 2 EME ANNEE"}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
        </Container>
    )
}

export default ModalitePassage
