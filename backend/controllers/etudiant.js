const pool = require('../config/db.js')

const getEtudiant = async (req, res) => {
    const { FILIEREID } = req.query
    pool.getConnection((err, conn) => {
        if (err) throw err;
        try {
            const qry = `SELECT etudiant.* FROM etudiant inner join filiere on etudiant.FILIEREID = filiere.FILIEREID
     where
     filiere.FILIEREID = ?`;
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

const addEtudiant = async (req, res) => {
    const { FILIEREID, NOMETUDIANT, PRENOMETUDIANT, NUMEROTELETUDIANT } = req.body.data
    let error = false
    pool.getConnection((err, conn) => {
        if (err) throw err;
        try {
            var qry = ''
            if (NUMEROTELETUDIANT !== '')
                qry = `INSERT INTO etudiant (FILIEREID, NOMETUDIANT, PRENOMETUDIANT, NUMEROTELETUDIANT) VALUE(?,?,?,?)`;
            else
                qry = `INSERT INTO etudiant (FILIEREID, NOMETUDIANT, PRENOMETUDIANT) VALUE(?,?,?)`;
            conn.query(qry, [parseInt(FILIEREID), NOMETUDIANT, PRENOMETUDIANT, parseInt(NUMEROTELETUDIANT)], (err, result) => {
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

const addExistingEtudiant = async (req, res) => {
    const { etudiantId, selectedFiliere } = req.body
    var data = []
    pool.getConnection((err, conn) => {
        if (err) throw err;
        try {
            const qry = `SELECT * FROM etudiant WHERE CODEETUDIANT like ${etudiantId}`;
            conn.query(qry, (err, result) => {
                if (err) throw err;
                console.log(result)
                data = [selectedFiliere, result[0].NOMETUDIANT, result[0].PRENOMETUDIANT, result[0].NUMEROTELETUDIANT]
                //Add 1st year student into 2nd year student
                const qry2 = `INSERT IGNORE into etudiant (FILIEREID,NOMETUDIANT,PRENOMETUDIANT,NUMEROTELETUDIANT) values(?,?,?,?)`
                conn.query(qry2, data, (err, result) => {
                    if (err) throw err;
                    console.log('res', result.insertId)
                    const newId = result.insertId
                    const qry3 = `SELECT * FROM note WHERE CODEETUDIANT like ${etudiantId}`
                    conn.query(qry3, (err, result) => {
                        if (err) throw err;
                        const notes = result
                        notes.forEach(note => {
                            const qry4 = `INSERT IGNORE into note (CODEETUDIANT,MODULEID,C1,C2,C3,C4,C5,C6,P1,TH,PR) values(?,?,?,?,?,?,?,?,?,?,?)`
                            conn.query(qry4,
                                [newId, note.MODULEID, note.C1, note.C2, note.C3, note.C4, note.C5, note.C6, note.P1, note.TH, note.PR],
                                (err, result) => {
                                    if (err) throw err;
                                    console.log(result)
                                });
                        });
                    });
                });
            });

        } catch (err) {
            console.log(err);
        }
        conn.release();
    });
}

const deleteEtudiant = async (req, res) => {
    pool.getConnection((err, conn) => {
        if (err) throw err;
        try {
            const qry = `DELETE FROM note WHERE CODEETUDIANT like ${req.params.etudiantId}`;

            conn.query(qry, (err, result) => {
                conn.release();
                if (err) throw err;
                pool.getConnection((err, conn) => {
                    if (err) throw err;
                    try {
                        const qry = `DELETE FROM etudiant WHERE CODEETUDIANT like ${req.params.etudiantId}`;

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
        } catch (err) {
            console.log(err);
        }
    });
}

const modifyEtudiant = async (req, res) => {
    pool.getConnection((err, conn) => {
        const { CODEETUDIANT, NOMETUDIANT, PRENOMETUDIANT, NUMEROTELETUDIANT } = req.body.editedEtudiant
        if (err) throw err;
        try {
            var dataArray
            var qry
            if (NUMEROTELETUDIANT === '') {
                qry = 'UPDATE etudiant SET NOMETUDIANT=?, PRENOMETUDIANT=? WHERE CODEETUDIANT=?'
                dataArray = [NOMETUDIANT, PRENOMETUDIANT, NUMEROTELETUDIANT]
            }
            else {
                qry = 'UPDATE etudiant SET NOMETUDIANT=?, PRENOMETUDIANT=?, NUMEROTELETUDIANT=? WHERE CODEETUDIANT=?'
                dataArray = [NOMETUDIANT, PRENOMETUDIANT, NUMEROTELETUDIANT, CODEETUDIANT]
            }
            conn.query(qry, dataArray, (err, result) => {
                conn.release();
                if (err) throw err;
                res.send(JSON.stringify(result));
            });
        } catch (err) {
            console.log(err);
        }
    });
}

const modifyEtudiantNotes = async (req, res) => {
    pool.getConnection((err, conn) => {
        const { id, cc, t, p, ti } = req.body
        if (err) throw err;
        try {
            const qry = 'UPDATE etudiant SET CC=?,TH=?,PR=?,TI=?  WHERE CODEETUDIANT=?'
            const dataArray = [cc, t, p, ti, id]
            conn.query(qry, dataArray, (err, result) => {
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
    getEtudiant,
    addEtudiant,
    deleteEtudiant,
    modifyEtudiant,
    addExistingEtudiant,
    modifyEtudiantNotes
}