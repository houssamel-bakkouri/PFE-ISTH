import React from 'react'
import { Button } from 'react-bootstrap'

const EtudiantRaedOnlyRow = ({ matiere, handleEditClick, handleDeleteClick }) => {
    return (
        <tr key={matiere.MODULEID}>
            <td>{matiere.NOMMODULE}</td>
            <td>{matiere.CODEMODULE} </td>
            <td>{matiere.SESSION} </td>
            <td>{matiere.COEIFFICIENT} </td>
            <td>{matiere.NOMPROF + ' ' + matiere.PRENOMPROF} </td>
            <td>
                <Button type='button' onClick={(event) => handleEditClick(event, matiere)} variant="success">
                    Modifier
                </Button>
                {' '}
                <Button type='button' onClick={() => handleDeleteClick(matiere.MODULEID)} variant="danger">
                    Supprimer
                </Button>
            </td>
        </tr>
    )
}

export default EtudiantRaedOnlyRow
