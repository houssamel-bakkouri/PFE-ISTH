const pool = require('../config/db.js')


const addProf = async (req, res) => {
    const { nom, prenom, tel, email, cin } = req.body.prof
    let error = false
    pool.getConnection((err, conn) => {
        if (err) throw err;
        try {
            const qry = `INSERT INTO professeur(NOMPROF,PRENOMPROF,TELPROFESSEUR,EMAILPROFESSEUR,CINPROF) VALUES(?,?,?,?,?)`;
            conn.query(qry, [nom, prenom, parseInt(tel), email, cin], (err, result) => {
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
        res.end(JSON.stringify({ err: false }))
}

const getProfs = async (req, res) => {
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
}

const deleteProf = async (req, res) => {
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
}

const modifyProf = async (req, res) => {
    pool.getConnection((err, conn) => {
        const { NOMPROF, PRENOMPROF, TELPROFESSEUR, EMAILPROFESSEUR, CINPROF, NUMEROPROFESSEUR } = req.body.editedProf
        if (err) throw err;
        try {
            const qry = 'UPDATE professeur SET NOMPROF=?, PRENOMPROF=?,TELPROFESSEUR=?,EMAILPROFESSEUR=?,CINPROF=? WHERE NUMEROPROFESSEUR=?'
            conn.query(qry, [NOMPROF, PRENOMPROF, parseInt(TELPROFESSEUR), EMAILPROFESSEUR, CINPROF, NUMEROPROFESSEUR], (err, result) => {
                conn.release();
                if (err) throw err;
                res.send(JSON.stringify(result));
            });
        } catch (err) {
            console.log(err);
        }
    });
}

module.exports = {
    addProf,
    getProfs,
    deleteProf,
    modifyProf
}