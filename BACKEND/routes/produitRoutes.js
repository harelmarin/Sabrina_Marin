const express = require('express');
const produitController = require('../controllers/produitController');
const   paymentController= require('../controllers/paymentController');

const router = express.Router();
//stripe payment
router.post('/payment/process',paymentController.processPayment);
router.get('/payment/confirmation',paymentController.confirmation);

router.get('/', produitController.index);
router.get('/mentions', produitController.mentionPage);
router.get('/produit/:id', produitController.getProduit);
router.post('/ajouter', produitController.postAjouter);
router.get('/panier', produitController.cartPage);
router.get('/admin',produitController.admin);
router.get('/home',produitController.getIndex);

router.get('/catalogue',produitController.catalogue);
router.get('/search',produitController.searchProduct);

module.exports = router;