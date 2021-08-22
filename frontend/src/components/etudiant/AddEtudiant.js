import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import axios from 'axios';

function AddEtudiant({ handleSearch, show, handleClose, selectedFiliere }) {
    const [nom, setNom] = useState('')
    const [prenom, setPrenom] = useState('')
    const [tel, setTel] = useState('')

    const handleHide = () => {
        handleClose()
        setNom('')
        setPrenom('')
        setTel('')
        handleSearch()
    }

    const handleClick = () => {
        if (nom === '' || prenom === '')
            return
        const data = {
            FILIEREID: selectedFiliere,
            NOMETUDIANT: nom,
            PRENOMETUDIANT: prenom,
            NUMEROTELETUDIANT: tel
        }
        axios.post('/api/etudiant', { data },
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
    }
    return (
        <Modal show={show} onHide={handleHide} backdrop="static"
            keyboard={false}>
            <Modal.Header>
                <Modal.Title>Ajouter étudiant</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form className="form-signin">
                    <div className="form-label-group">
                        <input
                            type="text"
                            id='nom'
                            name='nom'
                            className="form-control"
                            placeholder="Nom d'étudiant"
                            required
                            autoFocus
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                        />
                        <label htmlFor="nom">
                            Nom d'étudiant
                        </label>
                    </div>
                    <div className="form-label-group">
                        <input
                            type="text"
                            id='prenom'
                            name='prenom'
                            className="form-control"
                            placeholder="Prenom d'étudiant"
                            required
                            autoFocus
                            value={prenom}
                            onChange={(e) => setPrenom(e.target.value)}
                        />
                        <label htmlFor="prenom">
                            Prenom d'étudiant
                        </label>
                    </div>
                    <div className="form-label-group">
                        <input
                            type="text"
                            id='tel'
                            name='tel'
                            className="form-control"
                            placeholder="Numéro de téléphone"
                            autoFocus
                            value={tel}
                            onChange={(e) => setTel(e.target.value)}
                        />
                        <label htmlFor="tel">
                            Numéro de téléphone
                        </label>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleClick}>
                    Ajouter
                </Button>
                <Button variant="secondary" onClick={handleHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AddEtudiant
