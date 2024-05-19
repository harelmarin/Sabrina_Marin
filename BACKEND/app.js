const express = require('express');
const mysql = require('mysql');
const path = require('path');
const myConnection = require('express-myconnection');
const bodyParser = require('body-parser');
const port = 8000;
const fs = require('fs');
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

// Page introuvable
app.use((req, res) => {
  res.status(404).render('pageIntrouvable');
});

app.listen(port, () => {
  console.log('server listening on port 8000');
});