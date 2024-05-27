// controllers/paymentController.js

const stripe = require('stripe')('sk_test_51OkP9QKa0BEOKwekOTKYJaJQPDSwfMmT4Fb8PtYYKgixcOyL5II3106UbajXitNMxy4MUAs767XG21ZE8JId4wKt00El13BkiO');

const paymentController = {};

paymentController.processPayment = async (req, res) => {
    try {
        const { amount, currency, source, description } = req.body;

        // Créez le paiement avec Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            payment_method_types: ['card'],
            description: description,
            payment_method: source,
            confirm: true // Confirmez le paiement immédiatement
        });

        // Si le paiement est réussi, renvoyez une réponse appropriée
        res.status(200).json({ message: 'Paiement réussi', paymentIntent: paymentIntent });
    } catch (error) {
        console.error('Erreur lors du traitement du paiement:    ', error);
        res.status(500).json({ error: 'Erreur lors du traitement du paiement' });
    }
};

paymentController.confirmation = async (req, res) => {
    try {
        // Ici, vous pouvez gérer la confirmation du paiement
        // Par exemple, mettre à jour la base de données avec les détails du paiement, envoyer un e-mail de confirmation, etc.

        // Renvoyez une réponse appropriée pour indiquer que le paiement a été confirmé avec succès sur la page confirmation
     res.render('confirmation', { message: 'Votre paiement a été confirmé avec succès.' });
     console.log("Le paiement a été confirmé avec succès, traitement effectué par stripe")
    } catch (error) {
        console.error('Erreur lors de la confirmation du paiement:', error);
        res.status(500).json({ error: 'Erreur lors de la confirmation du paiement' });
    }
};

module.exports = paymentController;
