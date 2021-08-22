import React from 'react'
import { Button } from 'react-bootstrap'

function FiliereReadOnlyRow({ filiere, handleEditClick, handleDeleteClick }) {
    return (
        < tr key={filiere.FILIEREID} >
            <td>{filiere.NOMFILIERE} </td>
            <td>{filiere.ANNEE} </td>
            <td>{filiere.NIVEAU} </td>
            <td>
                <Button type='button' onClick={(event) => handleEditClick(event, filiere)} variant="success">
                    Modifier
                </Button>
                {' '}
                <Button type='button' onClick={() => handleDeleteClick(filiere.FILIEREID)} variant="danger">
                    Supprimer
                </Button>
            </td>
        </tr>
    )
}

export default FiliereReadOnlyRow