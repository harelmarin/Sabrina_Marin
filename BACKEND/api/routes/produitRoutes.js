const express = require('express');
const router = express.Router();
const produitController = require('../controllers/produitController');

router.get('/', produitController.getIndex);
router.get('/search', produitController.searchProduct);
router.get('/catalogue', produitController.catalogue);
router.get('/:id', produitController.getProduit);
router.post('/ajouter', produitController.postAjouter);
router.post('/:id/deduct', produitController.deductQuantity);
router.post('/addUserCommand', produitController.addUserCommand);

router.get('/user/:id', produitController.getUserById);

router.post('/connectionUser', produitController.userConnection);
router.post('/InscriptionUser', produitController.userInscription);

module.exports = router;
