import React, { useState } from 'react'
import axios from 'axios';

function AddUser() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [confirmedPassword, setConfirmedPassword] = useState('')
    const userType = 'admin'
    const [err, setErr] = useState('')

    const handleSubmit = event => {
        event.preventDefault();
        if (password !== undefined && confirmedPassword !== undefined) {
            if (password !== confirmedPassword) {
                setErr("Passwords don't match")
                return
            }
        }
        const user = {
            firstName: firstName,
            lastName: lastName,
            username: login,
            password: password,
            userType: userType
        }
        axios.post('/api/user', { user },
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('accessToken')
                }
            })
            .then(res => {
                if (!res.data.err)
                    window.location = "/userslist"
                else
                    setErr("Username already exist!")
            }, (err) => {
                axios.post('/api/token')
                    .then(res => {
                        console.log(res.data.accessToken)
                        localStorage.setItem('accessToken', res.data.accessToken)
                    }, err => window.location = "/")
            }).catch(err => {
                console.log('err:', err)
                setErr("Username already exist!")
            })
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                    <div className="card card-signin my-5">
                        <div className="card-body">
                            <h5 className="card-title text-center">
                                Add user
                            </h5>
                            <form className="form-signin" onSubmit={handleSubmit}>
                                <div className="form-label-group">
                                    <input type="text" id="firstName" name="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="form-control" placeholder="First Name" required autoFocus />
                                    <label htmlFor="firstName">
                                        First Name
                                    </label>
                                </div>
                                <div className="form-label-group">
                                    <input type="text" id="lastName" name="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="form-control" placeholder="Log-in" required autoFocus />
                                    <label htmlFor="lastName">
                                        Last Name
                                    </label>
                                </div>
                                <div className="form-label-group">
                                    <input type="text" id="inputLogin" name="inputLogin" value={login} onChange={(e) => setLogin(e.target.value)} className="form-control" placeholder="Log-in" required autoFocus />
                                    <label htmlFor="inputLogin">
                                        Login
                                    </label>
                                </div>

                                <div className="form-label-group">
                                    <input type="password" id="inputPassword" name="inputPassword" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" placeholder="Password" required />
                                    <label htmlFor="inputPassword">
                                        Password
                                    </label>
                                </div>
                                <div className="form-label-group">
                                    <input type="password" id="inputConfirmPassword" name="inputConfirmPassword" value={confirmedPassword} onChange={(e) => setConfirmedPassword(e.target.value)} className="form-control" placeholder="Confirm password " required />
                                    <label htmlFor="inputConfirmPassword">
                                        Confirm password
                                    </label>
                                </div>
                                <div className="text-danger">{err} </div>
                                <hr className="my-4" />
                                <button className="btn btn-lg btn-primary btn-block text-uppercase" type="submit">
                                    Add
                                </button>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddUser
