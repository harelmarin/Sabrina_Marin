const express = require('express');
const router = express.Router();
const produitController = require('../controllers/produitController');

router.get('/', produitController.getIndex);
router.get('/search', produitController.searchProduct);
router.get('/catalogue', produitController.catalogue);
router.get('/:id', produitController.getProduit);
router.post('/ajouter', produitController.postAjouter);

module.exports = router;
