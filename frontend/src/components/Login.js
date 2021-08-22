import axios from 'axios'
import React, { useState, useEffect, useContext } from 'react'
import '../css/Login.css'
import { loginContext } from '../App'
axios.defaults.withCredentials = true

function Login() {
    const contextData = useContext(loginContext)

    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [err, setErr] = useState('')

    const handleSubmit = event => {
        event.preventDefault();
        const user = {
            username: login,
            password: password
        }
        axios.post('/api/login', { user })
            .then(res => {
                console.log('err', res.data)
                if (res.data.err) {
                    setErr("nom d'utilisateur ou mot de passe incorrect")
                }
                else {
                    contextData.setLoggedIn(true)
                    localStorage.setItem('accessToken', res.data.accessToken)
                    window.location = "/home"
                }
            })
    }

    useEffect(() => {
        contextData.setLoggedIn(false)
    })

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                    <div className="card card-signin my-5">
                        <div className="card-body">
                            <h5 className="card-title text-center">
                                Sign In
                            </h5>
                            <form className="form-signin" onSubmit={handleSubmit}>
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
                                <div className="text-danger">{err} </div>
                                <hr className="my-4" />
                                <button className="btn btn-lg btn-primary btn-block text-uppercase" type="submit">
                                    Sign in
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
