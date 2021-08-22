import React, { useState, useContext } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { showModalContext } from './Professeur';
import axios from 'axios';

function AddProfModal() {
    const contextData = useContext(showModalContext)

    const [nom, setNom] = useState('')
    const [prenom, setPrenom] = useState('')
    const [tel, setTel] = useState('')
    const [email, setEmail] = useState('')
    const [cin, setCin] = useState('')

    const [err, setErr] = useState('')

    const handleClick = () => {
        const prof = {
            nom,
            prenom,
            tel,
            email,
            cin
        }
        axios.post('/api/professeur', { prof },
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('accessToken')
                }
            })
            .then(res => {
                if (!res.data.err)
                    handleClose()
                else
                    setErr("Erreur !")
            }, (err) => {
                axios.post('/api/token')
                    .then(res => {
                        console.log(res.data.accessToken)
                        localStorage.setItem('accessToken', res.data.accessToken)
                        handleClick()
                    }, err => window.location = "/")
            }).catch(err => {
                console.log('err:', err)
                setErr("Erreur !")
            })
    }

    const handleClose = () => {
        setNom('');
        setPrenom('');
        setTel('');
        setEmail('');
        setCin('');
        contextData.handleClose()
    }

    return (
        <Modal show={contextData.show} onHide={contextData.handleClose} backdrop="static"
            keyboard={false}>
            <Modal.Header>
                <Modal.Title>Ajouter Profeseur</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form className="form-signin">
                    <div className="form-label-group">
                        <input type="text" id="nom" name="nom" value={nom} onChange={(e) => setNom(e.target.value)} className="form-control" placeholder="Nom" required autoFocus />
                        <label htmlFor="nom">
                            Nom
                        </label>
                    </div>
                    <div className="form-label-group">
                        <input type="text" id="prenom" name="prenom" value={prenom} onChange={(e) => setPrenom(e.target.value)} className="form-control" placeholder="Prenom" required autoFocus />
                        <label htmlFor="prenom">
                            Prenom
                        </label>
                    </div>
                    <div className="form-label-group">
                        <input type="text" id="telephone" name="telephone" value={tel} onChange={(e) => setTel(e.target.value)} className="form-control" placeholder="Telephone" required autoFocus />
                        <label htmlFor="telephone">
                            Telephone
                        </label>
                    </div>
                    <div className="form-label-group">
                        <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" placeholder="email" required autoFocus />
                        <label htmlFor="email">
                            Email
                        </label>
                    </div>
                    <div className="form-label-group">
                        <input type="text" id="cin" name="cin" value={cin} onChange={(e) => setCin(e.target.value)} className="form-control" placeholder="CIN" required autoFocus />
                        <label htmlFor="cin">
                            CIN
                        </label>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <div className="text-danger">{err} </div>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleClick}>
                    Ajouter professeur
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AddProfModal
