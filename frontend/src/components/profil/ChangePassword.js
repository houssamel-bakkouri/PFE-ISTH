import React, { useState } from 'react'
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap'

function ChangePassword({ show, username, handleClose }) {
    const [error, setErr] = useState('')
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [ConfirmPassword, setConfirmPassword] = useState('')

    const handleClick = () => {
        const data = {
            username,
            oldPassword,
            newPassword
        }
        if (newPassword !== ConfirmPassword) {
            setErr('Pas meme mot de passe ')
            return
        }
        axios.put('/api/user/changePassword', { data },
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('accessToken')
                }
            })
            .then(res => {
                if (!res.data.err)
                    handleClose()
                else
                    setErr(res.data.msg)
            }, (err) => {
                axios.post('/api/token')
                    .then(res => {
                        console.log(res.data.accessToken)
                        localStorage.setItem('accessToken', res.data.accessToken)
                    }, err => window.location = "/")
            }).catch(err => {
                setErr("Erreur !")
            })
    }
    return (
        <Modal show={show} onHide={handleClose} backdrop="static"
            keyboard={false}>
            <Modal.Header>
                <Modal.Title>Changer mot de passe</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form className="form-signin">
                    <div className="form-label-group">
                        <input
                            type="password"
                            id="pessword"
                            name="pessword"
                            className="form-control"
                            placeholder="Ancien mot de passe"
                            required
                            autoFocus
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                        <label htmlFor="pessword">
                            Ancien mot de passe
                        </label>
                    </div>
                    <div className="form-label-group">
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            className="form-control"
                            placeholder="Nouveau mot de passe"
                            required
                            autoFocus
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <label htmlFor="newPassword">
                            Nouveau mot de passe
                        </label>
                    </div>
                    <div className="form-label-group">
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="form-control"
                            placeholder="Confirmer mot de passe"
                            required
                            autoFocus
                            value={ConfirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <label htmlFor="confirmPassword">
                            Confirmer mot de passe
                        </label>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <div className="text-danger">{error} </div>
                <Button variant="primary" onClick={handleClick}>
                    Changer mot de passe
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ChangePassword
