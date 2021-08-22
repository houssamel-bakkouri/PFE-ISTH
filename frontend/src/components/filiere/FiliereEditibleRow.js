import React, { useState, useEffect } from 'react'
import { Button, Form, ButtonGroup } from 'react-bootstrap'
import axios from 'axios';


function FiliereEditibleRow({ editFormData, handleEditFormChange, handleCancelClick }) {
    const [annees, setAnnees] = useState([])
    const [niveaux, setNiveaux] = useState([])
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'))

    const getAnnes = (mounted) => {
        axios.get(`/api/annee`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('accessToken')
            }
        })
            .then(res => {
                if (mounted)
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
                if (mounted)
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
        getAnnes(mounted)
        getNiveaux(mounted)
        return () => mounted = false
    }, [accessToken])


    return (
        <tr key={editFormData.FILIEREID}>
            <td>
                <Form.Control
                    type="text"
                    required="required"
                    placeholder="NOMFILIERE"
                    name="NOMFILIERE"
                    value={editFormData.NOMFILIERE}
                    onChange={handleEditFormChange}
                />
            </td>
            <td>
                <Form.Control
                    as="select"
                    className="form-select"
                    size="lg"
                    aria-label="Annee de formation"
                    onChange={(e) => editFormData.ANNEEID = e.target.value}
                >
                    {
                        annees.map(annee => {
                            if (annee.anneeId !== editFormData.ANNEEID)
                                return (
                                    <option value={annee.anneeId}>{annee.annee}</option>
                                )
                            else
                                return <option selected value={annee.anneeId}>{annee.annee}</option>
                        })
                    }
                </Form.Control>
            </td>
            <td>
                <Form.Control
                    as="select"
                    className="form-select"
                    size="lg"
                    aria-label="Annee de formation"
                    onChange={(e) => editFormData.NIVEAUID = e.target.value}
                >
                    {
                        niveaux.map(niveau => {
                            if (niveau.NIVEAUID !== editFormData.NIVEAUID)
                                return (
                                    <option value={niveau.NIVEAUID}>{niveau.NIVEAU}</option>
                                )
                            else
                                return <option selected value={niveau.NIVEAUID}>{niveau.NIVEAU}</option>
                        })
                    }
                </Form.Control>
            </td>
            <td >
                <ButtonGroup>
                    <Button className="me-2" type='submit' variant="success" >
                        sauvegarder
                    </Button>
                    <Button type='button' variant="secondary" onClick={handleCancelClick}>
                        Annuler
                    </Button>
                </ButtonGroup>
            </td>
        </tr>
    )
}

export default FiliereEditibleRow