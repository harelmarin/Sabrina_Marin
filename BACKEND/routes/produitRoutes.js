const express = require('express');
const produitController = require('../controllers/produitController');

const router = express.Router();

router.get('/', produitController.getIndex);
router.get('/produit/:id', produitController.getProduit);
router.post('/ajouter', produitController.postAjouter);
router.get('/admin',produitController.admin)

module.exports = router;