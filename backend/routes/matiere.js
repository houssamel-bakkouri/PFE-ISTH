require('dotenv').config()
const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken')

const {
    addModule,
    deleteModule,
    modifyModule,
    getModule,
    getModuleByFiliere
} = require('../controllers/matiere.js')

router.get('/', authenticateToken, getModule)
router.get('/search/:filiereId', authenticateToken, getModuleByFiliere)
router.post('/', authenticateToken, addModule)
router.delete('/:matiereId', authenticateToken, deleteModule)
router.put('/', authenticateToken, modifyModule)

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