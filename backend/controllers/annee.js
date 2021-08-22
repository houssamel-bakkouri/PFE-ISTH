const pool = require('../config/db.js')

const deleteAnnee = async (req, res) => {
    pool.getConnection((err, conn) => {
        if (err) throw err;
        try {
            const qry = `DELETE FROM annee WHERE ANNEEID like ${req.params.anneeId}`;
            conn.query(qry, (err, result) => {
                conn.release();
                // if (err) throw err;
                if (err) res.end(JSON.stringify({ err: true, msg: 'Impossible de supprimer un année non vide' }));
                res.send(JSON.stringify(result));
            });
        } catch (err) {
            console.log(err);
        }
    });
}

const modifyAnnee = async (req, res) => {
    pool.getConnection((err, conn) => {
        const { annee, anneeId } = req.body.editedAnnee
        if (err) throw err;
        try {
            const qry = 'UPDATE annee SET ANNEE=? WHERE ANNEEID=?'
            conn.query(qry, [annee, anneeId], (err, result) => {
                conn.release();
                if (err) throw err;
                res.send(JSON.stringify(result));
            });
        } catch (err) {
            console.log(err);
        }
    });
}

const getAnnee = async (req, res) => {
    pool.getConnection((err, conn) => {
        if (err) throw err;
        try {
            const qry = ` select
 annee.ANNEEID as anneeId,
 annee.ANNEE as annee,
 (select count(filiere.FILIEREID)  from filiere where annee.ANNEEID=filiere.ANNEEID)as nbrFilieres,
 (select count(niveau.NIVEAUID) from niveau, filiere
 where
 niveau.NIVEAUID = filiere.NIVEAUID
 and annee.ANNEEID=filiere.ANNEEID
 )as nbrNiveaux ,
 (select count(etudiant.CODEETUDIANT) from etudiant, filiere where
 etudiant.FILIEREID = filiere.FILIEREID )
 as nbrEtudiants
from annee`;
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

const addAnnee = async (req, res) => {
    const year = req.body.year
    let error = false
    pool.getConnection((err, conn) => {
        if (err) throw err;
        try {
            const qry = `INSERT INTO annee (ANNEE) VALUE(?)`;
            conn.query(qry, [year], (err, result) => {
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

module.exports = {
    getAnnee,
    addAnnee,
    modifyAnnee,
    deleteAnnee
}