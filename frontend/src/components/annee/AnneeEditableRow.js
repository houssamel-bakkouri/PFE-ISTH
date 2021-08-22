import React from 'react'
import { Button, Form, ButtonGroup } from 'react-bootstrap'

function AnneeEditableRow({ editFormData, handleEditFormChange, handleCancelClick }) {
    return (
        <tr key={editFormData.anneeId}>
            <td>
                <Form.Control
                    type="text"
                    required="required"
                    placeholder="annee"
                    name="annee"
                    value={editFormData.annee}
                    onChange={handleEditFormChange}
                />
            </td>
            <td>{editFormData.nbrNiveaux} </td>
            <td>{editFormData.nbrFilieres} </td>
            <td>{editFormData.nbrEtudiants} </td>
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

export default AnneeEditableRow