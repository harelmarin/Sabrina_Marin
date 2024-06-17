const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const myConnection = require('express-myconnection');
const produitApiRoutes = require('./routes/produitRoutes');
const viewRoutes = require('./routes/viewRoutes'); // Importer les routes des vues

const dotenvPath = path.resolve(__dirname, '../.env');
const imagesBdPath = path.resolve(__dirname, './Images_BD');

if (fs.existsSync(dotenvPath)) {
    console.log('.env file found');
    require('dotenv').config({ path: dotenvPath });
} else {
    console.log('.env file not found');
}

if (fs.existsSync(imagesBdPath)) {
    console.log('Images_BD folder found');
} else {
    console.log('Images_BD folder not found');
}

const optionBd = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: 3306,
    database: 'ecommerce'
};


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(myConnection(mysql, optionBd, 'pool'));
app.use('/api/Images_BD', express.static(imagesBdPath));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const assetsPath = path.resolve(__dirname, './assets');
app.use('/assets', express.static(assetsPath));

// Utiliser les routes des vues
app.use('/', viewRoutes);

// Utiliser les routes de l'API
app.use('/api/produits', produitApiRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`API server running on port ${port}`);
});