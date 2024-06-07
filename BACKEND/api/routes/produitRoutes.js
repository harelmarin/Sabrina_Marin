const express = require('express');
const router = express.Router();
const produitController = require('../controllers/produitController');

router.get('/', produitController.getIndex);
router.get('/search', produitController.searchProduct);
router.get('/catalogue', produitController.catalogue);
router.get('/:id', produitController.getProduit);
router.post('/ajouter', produitController.postAjouter);
router.post('/:id/deduct', produitController.deductQuantity);
router.post('/addUser', produitController.incrementQuantity);
module.exports = router;
