const express = require('express');
const produitController = require('../controllers/produitController');

const router = express.Router();

router.get('/', produitController.getIndex);
router.get('/produit/:id', produitController.getProduit);
router.post('/ajouter', produitController.postAjouter);
router.get('/admin',produitController.admin)
router.get('/catalogue',produitController.catalogue)
router.get('/search',produitController.searchProduct)
module.exports = router;