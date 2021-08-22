require('dotenv').config()
const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken')

const {
    getEtudiant,
    addEtudiant,
    addExistingEtudiant,
    deleteEtudiant,
    modifyEtudiant,
    modifyEtudiantNotes
} = require('../controllers/etudiant.js')

router.get('/', authenticateToken, getEtudiant)
router.post('/', authenticateToken, addEtudiant)
router.post('/exist', authenticateToken, addExistingEtudiant)
router.delete('/:etudiantId', authenticateToken, deleteEtudiant)
router.put('/', authenticateToken, modifyEtudiant)
router.put('/notes', authenticateToken, modifyEtudiantNotes)

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

module.exports = router;