//routes serveur backend
const express = require('express');
const produitBackController = require('../controllers/produitBackController');
const paymentController = require('../controllers/paymentController');
const router = express.Router();

router.get('/home', produitBackController.getIndex);//page d'acceuil
router.get('/mentions', (req, res) => res.render('mentions'));
router.get('/produit/:id', produitBackController.getProduit);
router.get('/panier', (req, res) => res.render('panier'));
router.get('/catalogue', produitBackController.catalogue);
router.get('/search', produitBackController.searchProduct);

router.get('/payment',(req, res)=>res.render('payment'))


router.post('/payment/process',paymentController.processPayment);
router.get('/payment/confirmation',paymentController.confirmation);

module.exports = router;


