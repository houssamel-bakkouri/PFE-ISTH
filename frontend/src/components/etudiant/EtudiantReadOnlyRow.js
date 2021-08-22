import React from 'react'
import { Button } from 'react-bootstrap'

const EtudiantRaedOnlyRow = ({ index, etudiant, handleEditClick, handleDeleteClick }) => {
    return (
        <tr key={etudiant.CODEETUDIANT}>
            <td>{index + 1}</td>
            <td>{etudiant.NOMETUDIANT} </td>
            <td>{etudiant.PRENOMETUDIANT} </td>
            <td>{etudiant.NUMEROTELETUDIANT ? etudiant.NUMEROTELETUDIANT : '-'} </td>
            <td>
                <Button type='button' onClick={(event) => handleEditClick(event, etudiant)} variant="success">
                    Modifier
                </Button>
                {' '}
                <Button type='button' onClick={() => handleDeleteClick(etudiant.CODEETUDIANT)} variant="danger">
                    Supprimer
                </Button>
            </td>
        </tr>
    )
}

export default EtudiantRaedOnlyRow
