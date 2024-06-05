const axios = require('axios');
const stripe = require('stripe')('sk_test_51OkP9QKa0BEOKwekOTKYJaJQPDSwfMmT4Fb8PtYYKgixcOyL5II3106UbajXitNMxy4MUAs767XG21ZE8JId4wKt00El13BkiO');

const paymentController = {};

paymentController.processPayment = async (req, res) => {
    try {
        const { amount, currency, source, description, cart } = req.body;

        // Validate request data
        if (!amount || !currency || !source || !description || !cart) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
//creer le paiement avec stripe
const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: currency,
    payment_method_types: ['card'],
    description: description,
    payment_method: source,
    confirm: true // Confirmez le paiement immédiatement
});

        // Deduct product quantities
        for (let product of cart) {
            await axios.post(`http://localhost:3000/api/produits/${product.id}/deduct`, {
                quantity: product.quantity
            });
        }

       // Si le paiement est réussi, renvoyez une réponse appropriée
       res.status(200).json({ message: 'Paiement réussi', paymentIntent: paymentIntent });
    
    } catch (error) {
        console.error('Error processing payment:', error); // Log the error stack trace
        res.status(500).json({ error: error.message });
    }
};

paymentController.confirmation = async (req, res) => {
    try {
    res.render('confirmation', { message: 'Votre paiement a été confirmé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la confirmation du paiement:', error);
        res.status(500).json({ error: 'Erreur lors de la confirmation du paiement' });
    }  

};

module.exports = paymentController;