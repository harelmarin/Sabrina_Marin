const express = require('express');
const mysql = require('mysql');
const path = require('path');
const myConnection = require('express-myconnection');
const bodyParser = require('body-parser');
const port = 8000;
require('dotenv').config();

// Configuration de la connexion à la base de données
const optionBd = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: 3306,
  database: 'ecommerce'
};

const produitRoutes = require('./routes/produitRoutes');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(myConnection(mysql, optionBd, 'single'));

// Config-gestion fichiers statiques
app.use("/Images_BD", express.static(path.join(__dirname, 'Images_BD')));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/../FRONTEND/templates');
app.use('/assets', express.static(path.join(__dirname, '../FRONTEND/assets')));

// Routes
app.use('/', produitRoutes);

// Page introuvable (404)
app.use((req, res, next) => {
    res.status(404).render('security', { errorMessage: "Page introuvable" });
  });
  
  // Autres erreurs de serveur
  app.use((err, req, res, next) => {
    // Déterminez le statut de l'erreur
    const status = err.status || 500; // Si aucun statut n'est défini, utilisez 500 (erreur interne du serveur)
    // Renvoyez le code d'erreur et la page de sécurité avec un message approprié
    res.status(status).render('security', { errorMessage: "Erreur serveur" });
  });
  

app.listen(port, () => {
  console.log('server listening on port 8000');
});