import React, { useState } from 'react'
import { Modal, Button, Table } from 'react-bootstrap'
import axios from 'axios';

function AddExistingEtudiant({ currentEtudiant, selectedAnnee, annees, handleSearch, show, setShow, handleClose, selectedFiliere, filieres }) {
    // eslint-disable-next-line
    String.prototype.replaceAt = function (index, replacement) {
        return this.substr(0, index) + replacement + this.substr(index + replacement.length);
    }

    const [etudiants, setEtudiants] = useState([])

    const handleClick = (e) => {
        try {
            var etudiantId = e.target.value
            axios.post('/api/etudiant/exist', { etudiantId, selectedFiliere },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('accessToken')
                    }
                })
                .then(res => {
                    console.log(res)
                    if (!res.data.err) {
                        handleHide()
                    }
                }, (err) => {
                    axios.post('/api/token')
                        .then(res => {
                            localStorage.setItem('accessToken', res.data.accessToken)
                            handleClick()
                        }, err => window.location = "/")
                }).catch(err => {
                    console.log('err:', err)
                })
        } catch (error) {
            throw error
        }

    }

    const handleHide = () => {
        handleClose()
        handleSearch()
    }

    const getEtudiant = () => {
        const oldFiliere = getFiliere()
        if (oldFiliere)
            axios.get(`/api/etudiant/?FILIEREID=${oldFiliere.FILIEREID}`, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('accessToken')
                }
            })
                .then(res => {
                    setEtudiants(checkEtudiant(res.data))
                }, (err) => {
                    axios.post('/api/token')
                        .then(res => {
                            localStorage.setItem('accessToken', res.data.accessToken)
                            getEtudiant()
                        }, err => window.location = "/")
                })
        else setEtudiants([])
    }

    const getPrevieusYear = (year) => {
        var arr = year.split('-')
        var year1 = parseInt(arr[0])
        var year2 = parseInt(arr[1])
        year1 = year1 - 1
        year2 = year2 - 1
        return year1 + '-' + year2
    }

    //Search for the same filiere of previeus year
    const getFiliere = () => {
        const currentYear = annees.filter(annee => annee.anneeId === parseInt(selectedAnnee))[0]
        const previeusYear = annees.filter(annee => annee.annee === getPrevieusYear(currentYear.annee))[0]
        const currentFiliere = filieres.current.filter(fl => (fl.FILIEREID === parseInt(selectedFiliere)))
        const previeusYearFil = filieres.current.filter(fl => fl.FILIEREID !== currentFiliere[0].FILIEREID
            && fl.NOMFILIERE === currentFiliere[0].NOMFILIERE
            && fl.ANNEEID === previeusYear.anneeId)
        return previeusYearFil[0]
    }

    // check if a student is already in the 2nd year
    const checkEtudiant = (etudiants) => {
        var filteredData = etudiants
        currentEtudiant.forEach(ce => {
            etudiants.forEach(e => {
                if (e.NOMETUDIANT === ce.NOMETUDIANT && e.PRENOMETUDIANT === ce.PRENOMETUDIANT) {
                    filteredData = filteredData.filter(data => data.CODEETUDIANT !== e.CODEETUDIANT)
                }
            });
        });
        return filteredData
    }

    return (
        < Modal onEntered={getEtudiant} show={show} onHide={handleHide} backdrop="static"
            keyboard={false} >
            <Modal.Header>
                <Modal.Title>Ajouter étudiant</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Prenom</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {etudiants.map(etudiant => {
                            return (
                                <tr key={etudiant.CODEETUDIANT} value={etudiant.CODEETUDIANT}>
                                    <td>{etudiant.NOMETUDIANT} </td>
                                    <td>{etudiant.PRENOMETUDIANT} </td>
                                    <td>
                                        <Button className="pull-right" variant="success" onClick={handleClick} value={etudiant.CODEETUDIANT}>
                                            Ajouter
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal >
    )
}

export default AddExistingEtudiant
