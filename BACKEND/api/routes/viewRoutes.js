const express = require('express');
const router = express.Router();
const produitController = require('../controllers/produitController');

// Route pour la page admin
router.get('/admin', (req, res)=> res.render('admin'));
module.exports = router;