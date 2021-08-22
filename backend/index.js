const express = require('express');
const cookieParser = require("cookie-parser");
const professeur = require('./routes/professeur.js')
const auth = require('./routes/auth.js')
const user = require('./routes/user.js')
const annee = require('./routes/annee.js')
const filiere = require('./routes/filiere.js')
const niveau = require('./routes/niveau.js')
const etudiant = require('./routes/etudiant.js')
const matiere = require('./routes/matiere.js')
const note = require('./routes/note.js')

require('dotenv/config');

const app = express();
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', auth)
app.use('/api/professeur', professeur);
app.use('/api/user', user)
app.use('/api/annee', annee)
app.use('/api/filiere', filiere)
app.use('/api/niveau', niveau)
app.use('/api/etudiant', etudiant)
app.use('/api/matiere', matiere)
app.use('/api/note', note)


const PORT = process.env.PORT || 4000; // backend routing port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});