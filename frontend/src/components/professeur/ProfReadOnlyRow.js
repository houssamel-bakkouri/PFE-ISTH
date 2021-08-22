import React from 'react'
import { Button } from 'react-bootstrap'

const ProfRaedOnlyRow = ({ prof, handleEditClick, handleDeleteClick }) => {
    return (
        <tr key={prof.NUMEROPROFESSEUR}>
            <td>{prof.NOMPROF} </td>
            <td>{prof.PRENOMPROF} </td>
            <td>{prof.TELPROFESSEUR} </td>
            <td>{prof.EMAILPROFESSEUR} </td>
            <td>{prof.CINPROF} </td>
            <td>
                <Button type='button' onClick={(event) => handleEditClick(event, prof)} variant="success">
                    Modifier
                </Button>
                {' '}
                <Button type='button' onClick={() => handleDeleteClick(prof.NUMEROPROFESSEUR)} variant="danger">
                    Supprimer
                </Button>
            </td>
        </tr>
    )
}

export default ProfRaedOnlyRow
