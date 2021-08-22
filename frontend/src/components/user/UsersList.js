import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Table from 'react-bootstrap/Table'
import Container from 'react-bootstrap/Container'

function UsersList() {
    const [users, setUsers] = useState([])
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'))


    useEffect(() => {
        let mounted = true;
        axios.get(`/api/user`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('accessToken')
            }
        })
            .then(res => {
                setUsers(res.data)
            }, (err) => {
                axios.post('/api/token')
                    .then(res => {
                        if (mounted) {
                            localStorage.setItem('accessToken', res.data.accessToken)
                            setAccessToken(localStorage.getItem('accessToken'))
                        }
                        console.log(res.data.accessToken)
                        localStorage.setItem('accessToken', res.data.accessToken)
                    }, err => window.location = "/")
            })
        return () => mounted = false
    }, [accessToken])

    return (
        <Container>
            <p className="fs-2 fw-bold text-white">Users list</p>
            <Table bordered hover variant='primary'>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Login</th>
                        <th>user Type</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => {
                        return (
                            <tr key={user.username}>
                                <td>{user.firstName} </td>
                                <td>{user.lastName} </td>
                                <td>{user.username} </td>
                                <td>{user.userType} </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </Container>
    )
}

export default UsersList
