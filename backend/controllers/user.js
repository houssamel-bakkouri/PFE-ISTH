const pool = require('../config/db.js')
const bcrypt = require('bcrypt')


const addUser = async (req, res) => {
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
}

const getUsers = async (req, res) => {
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
}

const modifyUser = async (req, res) => {
    pool.getConnection((err, conn) => {
        const { firstName, lastName, username } = req.body.user
        if (err) throw err;
        try {
            const qry = 'UPDATE users SET firstName=?, lastName=? where username like ?'

            conn.query(qry, [firstName, lastName, username], (err, result) => {
                conn.release();
                if (err) throw err;
                res.send(JSON.stringify(result));
            });
        } catch (err) {
            console.log(err);
        }
    });
}

const changePassword = async (req, res) => {
    pool.getConnection((err, conn) => {
        const { username, oldPassword, newPassword } = req.body.data
        if (err) throw err;
        try {
            const qry = 'SELECT * FROM users WHERE username LIKE ?'

            conn.query(qry, [username], (err, result) => {
                if (err) throw err;
                if (result.length < 1) {
                    res.end()
                }
                bcrypt.compare(oldPassword, result[0].password, async function (err, cmpResult) {
                    if (cmpResult) {
                        const hashedPassword = await bcrypt.hash(newPassword, 10)
                        const qry = 'UPDATE users SET password=? where username like ?'

                        conn.query(qry, [hashedPassword, username], (err, result) => {
                            conn.release();
                            if (err) throw err;
                            res.send(JSON.stringify(result));
                        });
                    }
                    else {
                        res.send(JSON.stringify({ err: true, msg: 'Mot de passe incorrect !' }));
                    }
                })
            })
        } catch (err) {
            console.log(err);
        }
    });
}

module.exports = {
    addUser,
    getUsers,
    modifyUser,
    changePassword
}