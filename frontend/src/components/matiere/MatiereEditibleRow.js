import React, { useState, useEffect } from 'react'
import { Button, Form, ButtonGroup } from 'react-bootstrap'
import axios from 'axios';


function FiliereEditibleRow({ editFormData, handleEditFormChange, handleCancelClick }) {
    const [profs, setProfs] = useState([])
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'))

    const getProfs = (mounted) => {
        axios.get(`/api/professeur`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('accessToken')
            }
        })
            .then(res => {
                if (mounted)
                    setProfs(res.data)
                console.log(res.data)
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
        getProfs(mounted)
        return () => mounted = false
    }, [accessToken])


    return (
        <tr key={editFormData.id}>
            <td>
                <Form.Control
                    type="text"
                    required="required"
                    placeholder="Module"
                    name="nomModule"
                    value={editFormData.nomModule}
                    onChange={handleEditFormChange}
                />
            </td>
            <td>
                <Form.Control
                    type="text"
                    required="required"
                    placeholder="Code"
                    name="codeModule"
                    value={editFormData.codeModule}
                    onChange={handleEditFormChange}
                />
            </td>
            <td>
                <Form.Control as="select" className="form-select" size="lg" aria-label="Session" onChange={(e) => editFormData.session = e.target.value}>
                    <option selected value={editFormData.session}>{editFormData.session}</option>
                    {
                        (editFormData.session === 1) ?
                            <option value={2}>2</option>
                            : <option value={1} >1</option>

                    }
                </Form.Control>
            </td>
            <td>
                <Form.Control
                    type="text"
                    required="required"
                    placeholder="Coeifficient"
                    name="coeif"
                    value={editFormData.coeif}
                    onChange={handleEditFormChange}
                />
            </td>
            <td>
                <Form.Control
                    as="select"
                    className="form-select"
                    size="lg"
                    aria-label="Professeur"
                    onChange={(e) => editFormData.profId = e.target.value}
                >

                    {
                        profs.map(prof => {
                            if (prof.NUMEROPROFESSEUR !== editFormData.profId)
                                return (
                                    <option value={prof.NUMEROPROFESSEUR}>{`${prof.NOMPROF} ${prof.PRENOMPROF}`}</option>
                                )
                            else
                                return <option selected value={prof.NUMEROPROFESSEUR}>{`${prof.NOMPROF} ${prof.PRENOMPROF}`}</option>
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