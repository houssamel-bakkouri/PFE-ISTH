const pool = require('../config/db.js')

const getModule = async (req, res) => {
    const { FILIEREID } = req.query
    pool.getConnection((err, conn) => {
        if (err) throw err;
        try {
            const qry = `SELECT module.*,professeur.NOMPROF,professeur.PRENOMPROF 
            FROM module INNER JOIN professeur 
            ON module.NUMEROPROFESSEUR = professeur.NUMEROPROFESSEUR
             WHERE module.FILIEREID = ?`;
            conn.query(qry, [FILIEREID], (err, result) => {
                conn.release();
                if (err) throw err;
                res.send(JSON.stringify(result));
            });
        } catch (err) {
            console.log(err);
        }
    });
}

const getModuleByFiliere = async (req, res) => {
    pool.getConnection((err, conn) => {
        if (err) throw err;
        try {
            const qry = `SELECT * FROM MODULE WHERE FILIEREID = ?`;
            conn.query(qry, [req.params.filiereId], (err, result) => {
                conn.release();
                if (err) throw err;
                res.send(JSON.stringify(result));
            });
        } catch (err) {
            console.log(err);
        }
    });
}

const addModule = async (req, res) => {
    const { FILIEREID, NUMEROPROFESSEUR, NOMMODULE, COEIFFICIENT, SESSION, CODEMODULE } = req.body.data
    let error = false
    pool.getConnection((err, conn) => {
        if (err) throw err;
        try {
            const qry = `INSERT INTO module (FILIEREID, NUMEROPROFESSEUR, NOMMODULE, COEIFFICIENT, SESSION, CODEMODULE) VALUE(?,?,?,?,?,?)`;
            conn.query(qry, [FILIEREID, NUMEROPROFESSEUR, NOMMODULE, COEIFFICIENT, SESSION, CODEMODULE], (err, result) => {
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

const deleteModule = async (req, res) => {
    pool.getConnection((err, conn) => {
        if (err) throw err;
        try {
            const qry = `DELETE FROM module WHERE MODULEID like ${req.params.matiereId}`;

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

const modifyModule = async (req, res) => {
    pool.getConnection((err, conn) => {
        const { MODULEID, NUMEROPROFESSEUR, NOMMODULE, COEIFFICIENT, SESSION, CODEMODULE } = req.body.editedMatiere
        if (err) throw err;
        try {
            qry = 'UPDATE module SET NUMEROPROFESSEUR=?, NOMMODULE=?, COEIFFICIENT=?, SESSION=?, CODEMODULE=? WHERE MODULEID=?'
            conn.query(qry, [NUMEROPROFESSEUR, NOMMODULE, COEIFFICIENT, SESSION, CODEMODULE, MODULEID], (err, result) => {
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
    getModule,
    addModule,
    modifyModule,
    deleteModule,
    getModuleByFiliere
}