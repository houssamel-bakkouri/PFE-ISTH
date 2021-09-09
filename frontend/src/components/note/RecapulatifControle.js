import React, { useState, useRef, useEffect } from 'react'
import { Table, Container } from 'react-bootstrap'
import axios from 'axios';
import RechercherEtudaint from '../etudiant/RechercherEtudaint';

function RecapulatifControle() {
    const [annees, setAnnees] = useState([])
    var filieres = useRef([])
    const [niveaux, setNiveaux] = useState([])
    const notes = useRef([])

    const [selectedAnnee, setSelctedAnnee] = useState('')
    const [selectedFiliere, setSelectedFiliere] = useState('')
    const [selectedNiveau, setSelectedNiveau] = useState('')
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'))

    const [matieres, setMatieres] = useState([])

    const [etudiants, setEtudiants] = useState([])

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

    const handleSearch = () => {
        if (selectedNiveau === '' || selectedAnnee === '' || selectedFiliere === '')
            return
        getMatieres()
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

    const getMatieres = () => {
        axios.get(`/api/matiere/search/${selectedFiliere}`, {
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
                        getMatieres()
                    }, err => window.location = "/")
            })
    }

    const getNotes = (etudiantId, matiereId) => {
        axios.get(`/api/note/ByEtdiantMatiere/?etudiantId=${etudiantId}&matiereId=${matiereId}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('accessToken')
            }
        })
            .then(res => {
                try {
                    var exist = false
                    var newNotes = [...notes.current]
                    newNotes.forEach(note => {
                        if (res.data[0].NOTEID === note.NOTEID)
                            exist = true
                    });
                    if (!exist) {
                        newNotes.push(res.data[0])
                        notes.current = newNotes
                        console.log(notes.current)
                    }
                } catch (error) {
                    console.log(error)
                }
            }, (err) => {
                axios.post('/api/token')
                    .then(res => {
                        localStorage.setItem('accessToken', res.data.accessToken)
                        getNotes()
                    }, err => window.location = "/")
            })
    }

    const getMoyenneC = (etudiantId, moduleId) => {
        try {
            return notes.current.filter(note => note.CODEETUDIANT === etudiantId
                && note.MODULEID === moduleId
            )[0].MoyenneC
        } catch (error) {
            return null
        }

    }

    const getMoyenneEtudiant = (etudiantId) => {
        var avg = 0
        var coef = 0
        notes.current.forEach(note => {
            if (note.CODEETUDIANT === etudiantId) {
                matieres.forEach(matiere => {
                    if (matiere.MODULEID === note.MODULEID) {
                        avg += note.MoyenneC * matiere.COEIFFICIENT
                        coef += matiere.COEIFFICIENT
                    }
                });
            }
        });
        return avg / coef
    }

    const getMoyenneMatiere = () => {
        var matiereAvg = []
        matieres.forEach(matiere => {
            let avg = 0
            let cmp = 0
            notes.current.forEach(note => {
                if (note.MODULEID === matiere.MODULEID) {
                    cmp++
                    if (note.MoyenneC) {
                        avg += note.MoyenneC
                    }
                }
            });
            matiereAvg.push(avg / cmp)
        });
        let avg = 0
        matiereAvg.forEach(note => {
            avg += note
        });
        matiereAvg.push(avg / matiereAvg.length)
        return matiereAvg.map(note => <td>{note?.toFixed(2) ?? null}</td>)
    }

    return (
        <>
            <p className="fs-2 fw-bold text-white">RECAPILUTATIF DES CONTROLES</p>
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
            {(etudiants.length > 0) &&
                <Container>
                    <h1> </h1>
                    <Table bordered hover variant='primary' id='RevcapCntTable'>
                        <thead>
                            <tr>
                                <th>N°</th>
                                <th>Nom</th>
                                <th>Prenom</th>
                                {matieres.map(matiere => {
                                    return <th >{matiere.CODEMODULE}</th>
                                })}
                                <th>MPCC</th>
                            </tr>
                        </thead>
                        <tbody>
                            {etudiants.map((etudiant, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{etudiant.NOMETUDIANT}</td>
                                        <td>{etudiant.PRENOMETUDIANT}</td>
                                        {matieres.map((matiere) => {
                                            return (
                                                <>
                                                    {getNotes(etudiant.CODEETUDIANT, matiere.MODULEID)}
                                                    <td>
                                                        {
                                                            getMoyenneC(etudiant.CODEETUDIANT, matiere.MODULEID)?.toFixed(2) ?? null
                                                        }
                                                    </td>
                                                </>
                                            )
                                        })}
                                        <td>{getMoyenneEtudiant(etudiant.CODEETUDIANT)?.toFixed(2) ?? null}</td>
                                    </tr>
                                )
                            })}
                            <tr>
                                <td colSpan='3'>Moyenne</td>
                                {getMoyenneMatiere()}
                            </tr>
                        </tbody>
                    </Table>
                </Container>
            }
        </>
    )
}

export default RecapulatifControle
