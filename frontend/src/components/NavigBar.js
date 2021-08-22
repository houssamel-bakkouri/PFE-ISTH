import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { loginContext } from '../App'

function NavigBar() {
    const [userName, setUserName] = useState('')
    const { isLoggedin, setLoggedIn } = useContext(loginContext)

    useEffect(() => {
        axios.get('/api/currentUser')
            .then(res => {
                setUserName(res.data.user.username)
                setLoggedIn(true)
            }, err => {
                setUserName('')
                setLoggedIn(false)
            })
    }, [setLoggedIn])

    const quit = () => {
        setLoggedIn(false)
        axios.delete("/api/logout")
            .then(res => {
                console.log(res);
            })
    }
    if (!isLoggedin)
        return ''
    return (
        <Navbar bg="primary" variant="dark" expand="lg" className='ml-auto'>
            <Container>
                <Navbar.Brand href="/home">I.S.T.H</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to='/home'>
                            Home
                        </Nav.Link >
                        <NavDropdown title="Gerer les donnees" id="gererDonnees">
                            <NavDropdown.Item as={Link} to="/annees">Années scolaire</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/filieres">Filieres</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/professeurs">Professeurs</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/matieres">Matireres</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/etudiants">Etudiants</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Saisie les notes" id="saisieNotes">
                            <NavDropdown.Item as={Link} to="/ReleveControle">RELEVE DE CONTROLE</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/FicheSynthetique">FICHE SYNTHETIQUE DES RESULTAT OBTENUS</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Récapitulatif  résutats" id="recapitulatif">
                            <NavDropdown.Item as={Link} to="/RecapulatifControle">CONTROLES CONTINUS</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/RecapulatifPratique">EXMANES PRATIQUE</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/RecapulatifTheorique">EXAMENS THEORIQUE</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link as={Link} to='/Bulletins'>
                            BULLETINS
                        </Nav.Link >
                        <NavDropdown title="MODALITES" id="modalites">
                            <NavDropdown.Item as={Link} to="/ModalitePassage">MODALITES DE PASSAGE</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/ModaliteDiplome">MODALITES DE DIPLÔME</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <NavDropdown title={userName} id="gererComptes">
                            <NavDropdown.Item as={Link} to="/adduser">Add User</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/userslist">Users List</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item as={Link} to="/" onClick={quit}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavigBar
