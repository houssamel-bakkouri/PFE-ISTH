import React from 'react'
import { Button } from 'react-bootstrap'

function AnneeReadOnlyRow({ year, handleEditClick, handleDeleteClick }) {
    return (
        < tr key={year.anneeId} >
            <td>{year.annee} </td>
            <td>{year.nbrFilieres} </td>
            <td>{year.nbrEtudiants} </td>
            <td>
                <Button type='button' onClick={(event) => handleEditClick(event, year)} variant="success">
                    Modifier
                </Button>
                {' '}
                <Button type='button' onClick={() => handleDeleteClick(year.anneeId)} variant="danger">
                    Supprimer
                </Button>
            </td>
        </tr>
    )
}

export default AnneeReadOnlyRow