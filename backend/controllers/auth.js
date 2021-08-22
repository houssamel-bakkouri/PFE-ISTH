const pool = require('../config/db.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

let refreshTokens = []
const getToken = (req, res) => {
    // const refreshToken = req.body.token
    const refreshToken = req.cookies.refreshToken
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({
            username: user.username,
            password: user.password,
            userType: user.userType,
            firstName: user.firstName,
            lastName: user.lastName
        })
        res.json({ accessToken: accessToken })
    })
}

const getCurrentUser = (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        res.json({ user })
    })
}

const logout = (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken)
    res.end()
}

const login = (req, res) => {
    const { username, password } = req.body.user

    pool.getConnection((err, conn) => {
        let error = false
        if (err) throw err;
        try {
            const qry = `SELECT * FROM users where username like ? `;
            conn.query(qry, [username], (err, result) => {
                conn.release();
                if (err) throw err;
                if (result.length < 1) {
                    error = true
                }
                else {
                    bcrypt.compare(password, result[0].password, async function (err, cmpResult) {
                        if (cmpResult) {
                            user = result[0]
                            user = {
                                username: user.username,
                                password: user.password,
                                userType: user.userType,
                                firstName: user.firstName,
                                lastName: user.lastName
                            }
                            const accessToken = generateAccessToken(user)
                            const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
                            refreshTokens.push(refreshToken)
                            res.cookie('refreshToken', refreshToken, {
                                sameSite: 'strict',
                                path: '/',
                                expires: new Date(new Date().getTime() + 1000000 * 1000),
                                httpOnly: true,
                            }).send(JSON.stringify({ accessToken: accessToken, err: false }))
                        }
                        else {
                            res.send(JSON.stringify({ err: true }))
                        }
                    })
                }
            });
        } catch (err) {
            console.log(err);
        }
    });

}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
}

module.exports = {
    getToken,
    getCurrentUser,
    logout,
    login
}