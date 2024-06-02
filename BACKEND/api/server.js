const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const myConnection = require('express-myconnection');
const produitApiRoutes = require('./routes/produitRoutes');

// Définir les chemins pour .env et Images_BD
const dotenvPath = path.resolve(__dirname, '../.env');
const imagesBdPath = path.resolve(__dirname, './Images_BD');

// Vérifier si le fichier .env existe
if (fs.existsSync(dotenvPath)) {
    console.log('.env file found');
    require('dotenv').config({ path: dotenvPath });
} else {
    console.log('.env file not found');
}

// Vérifier si le dossier Images_BD existe
if (fs.existsSync(imagesBdPath)) {
    console.log('Images_BD folder found');
} else {
    console.log('Images_BD folder not found');
}

// Configuration des options de la base de données
const optionBd = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: 3306,
    database: 'ecommerce'
};

// verif si les variables d'environnement sont correctement chargées
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('PORT:', process.env.PORT);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connexion à la base de données
app.use(myConnection(mysql, optionBd, 'pool'));

// Servir les fichiers statiques depuis le dossier Images_BD
app.use('/api/Images_BD', express.static(imagesBdPath));

// Routes de mon api
app.use('/api/produits', produitApiRoutes);

// Démarrage du serveur
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`API server running on port ${port}`);
});
