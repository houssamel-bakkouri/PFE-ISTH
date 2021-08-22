require('dotenv').config()
const express = require('express')
const router = express.Router()
const pool = require('../config/db.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


// should be replaced by database
let refreshTokens = []
//use it when the access token expired
router.post('/api/token', (req, res) => {
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
})

router.get('/api/currentUser', (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        res.json({ username: user.username })
    })
})

router.delete('/api/logout', (req, res) => {
    console.log(req.cookies)
    refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken)
    res.end()
})

router.post('/api/login', async (req, res) => {
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
                    bcrypt.compare(password, result[0].password, function (err, cmpResult) {
                        if (cmpResult)
                            error = false
                        else
                            error = true
                    })
                }
                if (error)
                    res.send(JSON.stringify({ err: error }))
                else {
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
                    }).send(JSON.stringify({ accessToken: accessToken, err: error }))
                }
            });
        } catch (err) {
            console.log(err);
        }
    });

});

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
}

router.post('/api/adduser', authenticateToken, async (req, res) => {
    const { firstName, lastName, username, password, userType } = req.body.user
    console.log(req.body.user)
    let error = false
    const hashedPassword = await bcrypt.hash(password, 10)
    pool.getConnection((err, conn) => {

        if (err) throw err;
        try {
            const qry = `INSERT INTO users(firstName, lastName, username, password, userType) VALUES(?,?,?,?,?)`;
            conn.query(qry, [firstName, lastName, username, hashedPassword, userType], (err, result) => {
                conn.release();
                if (err) {
                    res.send(JSON.stringify({ err: true }))
                    error = true
                    return;
                }
            });
        } catch (err) {
            console.log(err);
        }
    });
    if (!error)
        res.send(JSON.stringify({ err: false }))
});

router.post('/api/professeur', authenticateToken, async (req, res) => {
    const { nom, prenom, tel, email, cin } = req.body.prof
    let error = false
    console.log(req.body.prof)
    pool.getConnection((err, conn) => {
        if (err) throw err;
        try {
            let id = Date.now()
            const qry = `INSERT INTO professeur(NUMEROPROFESSEUR,NOMPROF,PRENOMPROF,TELPROFESSEUR,EMAILPROFESSEUR,CINPROF) VALUES(?,?,?,?,?,?)`;
            conn.query(qry, [id, nom, prenom, parseInt(tel), email, cin], (err, result) => {
                conn.release();
                if (err) {
                    res.send(JSON.stringify({ err: true }))
                    error = true
                    return;
                }
            });
        } catch (err) {
            console.log(err);
        }
    });
    if (!error)
        res.send(JSON.stringify({ err: false }))
})
router.get('/api/users', authenticateToken, async (req, res) => {
    pool.getConnection((err, conn) => {
        if (err) throw err;
        try {
            const qry = `SELECT * FROM users `;
            conn.query(qry, (err, result) => {
                conn.release();
                if (err) throw err;
                res.send(JSON.stringify(result));
            });
        } catch (err) {
            console.log(err);
        }
    });
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        // console.log(err)
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

router.get('/api/professeur', authenticateToken, async (req, res) => {
    pool.getConnection((err, conn) => {
        if (err) throw err;
        try {
            const qry = `SELECT * FROM professeur `;
            conn.query(qry, (err, result) => {
                conn.release();
                if (err) throw err;
                res.send(JSON.stringify(result));
            });
        } catch (err) {
            console.log(err);
        }
    });
})

router.delete('/api/professeur/:profId', authenticateToken, async (req, res) => {
    pool.getConnection((err, conn) => {
        if (err) throw err;
        try {
            const qry = `DELETE FROM professeur WHERE NUMEROPROFESSEUR like ${req.params.profId}`;
            conn.query(qry, (err, result) => {
                conn.release();
                if (err) throw err;
                res.send(JSON.stringify(result));
            });
        } catch (err) {
            console.log(err);
        }
    });
})

router.put('/api/professeur', authenticateToken, async (req, res) => {
    pool.getConnection((err, conn) => {
        const { NUMEROPROFESSEUR, NOMPROF, PRENOMPROF, TELPROFESSEUR, EMAILPROFESSEUR, CINPROF } = req.body.editedProf
        if (err) throw err;
        try {
            const qry = 'UPDATE professeur SET NOMPROF=?, PRENOMPROF=?,TELPROFESSEUR=?,EMAILPROFESSEUR=?,CINPROF=?'
            conn.query(qry, [NOMPROF, PRENOMPROF, parseInt(TELPROFESSEUR), EMAILPROFESSEUR, CINPROF], (err, result) => {
                conn.release();
                if (err) throw err;
                res.send(JSON.stringify(result));
            });
        } catch (err) {
            console.log(err);
        }
    });
})

module.exports = router;