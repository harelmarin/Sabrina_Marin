//serveur backend app.js
const fs = require('fs');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const produitRoutes = require('./routes/backofficeRoutes');
// Activer CORS pour toutes les routes
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Définir les chemins  pour servir les fichiers statiques 
const assetsPath = path.resolve(__dirname, '../FRONTEND/assets');

// Vérifier si le dossier assets existe
if (fs.existsSync(assetsPath)) {
    console.log('assets folder found');
} else {
    console.log('assets folder not found');
}
// Servir les fichiers statiques depuis le dossier assets sur /backend
app.use('/assets', express.static(assetsPath));
app.use('/backend/assets', express.static(assetsPath));

// View engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/../FRONTEND/templates');




// Routes
app.use('/backend', produitRoutes);

// Page introuvable (404)
app.use((req, res) => {
    res.status(404).render('security', { errorMessage: "Page introuvable" });
});

// Autres erreurs de serveur
app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).render('security', { errorMessage: "Erreur serveur" });
});

// Start server
const port = 8000;
app.listen(port, () => {
    console.log(`Backend server running on port ${port}`);
});
