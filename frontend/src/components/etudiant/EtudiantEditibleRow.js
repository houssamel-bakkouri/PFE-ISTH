import React from 'react'
import { Button, Form, ButtonGroup } from 'react-bootstrap'

function EtudiantEditibleRow({ index, editFormData, handleEditFormChange, handleCancelClick }) {
    return (
        <tr key={editFormData.id}>
            <td>{index + 1} </td>
            <td>
                <Form.Control
                    type="text"
                    required="required"
                    placeholder="nom"
                    name="nom"
                    value={editFormData.nom}
                    onChange={handleEditFormChange}
                />
            </td>
            <td>
                <Form.Control
                    type="text"
                    required="required"
                    placeholder="prenom"
                    name="prenom"
                    value={editFormData.prenom}
                    onChange={handleEditFormChange}
                />
            </td>
            <td>
                <Form.Control
                    type="text"
                    placeholder="telephone"
                    name="telephone"
                    value={editFormData.telephone}
                    onChange={handleEditFormChange}
                />
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

export default EtudiantEditibleRow
