const pool = require('../config/db.js')

const getNote = async (req, res) => {
    const { matiereId, filiereId } = req.query
    pool.getConnection((err, conn) => {
        if (err) throw err;
        try {
            const qry = `select note.*, etudiant.* 
            from note 
            inner join 
            etudiant on 
            etudiant.CODEETUDIANT = note.CODEETUDIANT
             where 
             note.MODULEID = ? and etudiant.FILIEREID = ?`;
            conn.query(qry, [matiereId, filiereId], (err, result) => {
                conn.release();
                if (err) throw err;
                res.send(JSON.stringify(result));
            });
        } catch (err) {
            console.log(err);
        }
    });
}

const getNoteByEtudMat = async (req, res) => {
    const { etudiantId, matiereId } = req.query
    pool.getConnection((err, conn) => {
        if (err) throw err;
        try {
            const qry = `SELECT * FROM note WHERE CODEETUDIANT=? AND MODULEID=?`;
            conn.query(qry, [etudiantId, matiereId], (err, result) => {
                conn.release();
                if (err) throw err;
                res.send(JSON.stringify(result));
            });
        } catch (err) {
            console.log(err);
        }
    });
}

const getNoteByEtud = async (req, res) => {
    const { etudiantId } = req.query
    pool.getConnection((err, conn) => {
        if (err) throw err;
        try {
            const qry = `select note.*,module.* 
            from note inner join module 
            on note.MODULEID = module.MODULEID 
            inner join filiere
            on module.FILIEREID = filiere.FILIEREID 
            inner join annee 
            on filiere.ANNEEID =annee.ANNEEID
            where CODEETUDIANT like ?
            ORDER by annee.ANNEE,module.CODEMODULE `;
            conn.query(qry, [etudiantId], (err, result) => {
                conn.release();
                if (err) throw err;
                res.send(JSON.stringify(result));
            });
        } catch (err) {
            console.log(err);
        }
    });
}

const addNote = async (req, res) => {
    const { CODEETUDIANT, MODULEID } = req.body
    console.log(CODEETUDIANT, MODULEID)
    pool.getConnection((err, conn) => {
        if (err) throw err;
        try {
            const qry = `insert ignore into 
            note (CODEETUDIANT,MODULEID) 
            values(?,?)`;
            conn.query(qry, [CODEETUDIANT, MODULEID], (err, result) => {
                conn.release();
                if (err) throw err;
                res.send(JSON.stringify(result));
            });
        } catch (err) {
            console.log(err);
        }
    });
}

const modifyNote = async (req, res) => {
    const notes = req.body.notes
    notes.forEach(note => {
        const { NOTEID, C1, C2, C3, C4, C5, C6, P1, TH, PR, MoyenneC } = note
        pool.getConnection((err, conn) => {
            if (err) throw err;
            try {
                const qry = `UPDATE note SET 
            C1=?, C2=?,C3=?,C4=?,C5=?,C6=?,P1=?,TH=?,PR=?,MoyenneC=?
            WHERE NOTEID=?`
                conn.query(qry, [C1, C2, C3, C4, C5, C6, P1, TH, PR, MoyenneC, NOTEID],
                    (err, result) => {
                        conn.release();
                        if (err) throw err;
                    });
            } catch (err) {
                console.log(err);
            }
        });
    });
    res.send(JSON.stringify({ msg: 'end' }));
}

module.exports = {
    getNote,
    addNote,
    modifyNote,
    getNoteByEtudMat,
    getNoteByEtud
}