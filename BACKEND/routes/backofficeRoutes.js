//routes serveur backend
const express = require('express');
const produitBackController = require('../controllers/produitBackController');
const paymentController = require('../controllers/paymentController');
const { checkAuth } = require('./middleware');
const router = express.Router();

router.get('/load',(req, res)=>res.render('load'));//page de chargement 
router.get('/home', produitBackController.getIndex);//page d'acceuil
router.get('/mentions', (req, res) => res.render('mentions'));
router.get('/produit/:id', produitBackController.getProduit);
router.get('/panier', (req, res) => res.render('panier'));
router.get('/favoris', (req, res) => res.render('favoris'));
router.get('/login', (req, res) => res.render('login'))
router.get('/catalogue', produitBackController.catalogue);
router.get('/search', produitBackController.searchProduct);

router.get('/user/:id/commands', produitBackController.displayCommand)

router.post('/connection', produitBackController.connection);
router.post('/signup', produitBackController.inscription);



router.get('/payment',produitBackController.renderPaymentPage);

router.post('/payment/process',paymentController.processPayment);
router.get('/payment/confirmation',paymentController.confirmation);
router.post('/payment/sendConfirmationEmail', paymentController.sendConfirmationEmail);
router.post('/payment/confirmUser', paymentController.confirmUser);
module.exports = router;


