const pool = require('../config/db.js')

const getFiliere = async (req, res) => {
    pool.getConnection((err, conn) => {
        if (err) throw err;
        try {
            const qry = `SELECT filiere.*, annee.ANNEE, niveau.NIVEAU FROM filiere
inner join annee
on filiere.ANNEEID = annee.ANNEEID
inner join niveau
on filiere.NIVEAUID = niveau.NIVEAUID`;
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

const addFiliere = async (req, res) => {
    const { ANNEEID, NIVEAUID, NOMFILIERE } = req.body
    let error = false
    pool.getConnection((err, conn) => {
        if (err) throw err;
        try {
            const qry = `INSERT INTO filiere (ANNEEID, NIVEAUID, NOMFILIERE) VALUE(?,?,?)`;
            conn.query(qry, [ANNEEID, NIVEAUID, NOMFILIERE], (err, result) => {
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

const deleteFiliere = async (req, res) => {
    pool.getConnection((err, conn) => {
        if (err) throw err;
        try {
            const qry = `DELETE FROM filiere WHERE FILIEREID like ${req.params.filiereId}`;
            conn.query(qry, (err, result) => {
                conn.release();
                if (err) {
                    console.log(err)
                    res.end(JSON.stringify({ err: true, msg: 'Impossible de supprimer un année non vide' }));
                }
                res.send(JSON.stringify(result));
            });
        } catch (err) {
            console.log(err);
        }
    });
}

const modifyFiliere = async (req, res) => {
    pool.getConnection((err, conn) => {
        const { FILIEREID, ANNEEID, NIVEAUID, NOMFILIERE } = req.body.editedFiliere
        if (err) throw err;
        try {
            const qry = 'UPDATE filiere SET ANNEEID=?, NIVEAUID=?, NOMFILIERE=? WHERE FILIEREID=?'
            conn.query(qry, [ANNEEID, NIVEAUID, NOMFILIERE, FILIEREID], (err, result) => {
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
    getFiliere,
    addFiliere,
    deleteFiliere,
    modifyFiliere
}