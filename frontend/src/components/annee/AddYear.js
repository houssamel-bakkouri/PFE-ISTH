import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import axios from 'axios';


function AddYear({ show, handleClose }) {
    const [year, setYear] = useState('')
    const handleClick = () => {
        axios.post('/api/annee', { year },
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('accessToken')
                }
            })
            .then(res => {
                console.log(res)
                if (!res.data.err) {
                    handleClose()
                    setYear('')
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
        <Modal show={show} onHide={() => { handleClose(); setYear('') }} backdrop="static"
            keyboard={false}>
            <Modal.Header>
                <Modal.Title>Ajouter année scolaire</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form className="form-signin">
                    <div className="form-label-group">
                        <input
                            type="text"
                            id='year'
                            name='year'
                            className="form-control"
                            placeholder="Nauveau année"
                            required
                            autoFocus
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                        />
                        <label htmlFor="year">
                            Annee scolaire
                        </label>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleClick}>
                    Ajouter
                </Button>
                <Button variant="secondary" onClick={() => { handleClose(); setYear('') }}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AddYear
