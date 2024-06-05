const axios = require('axios');
const stripe = require('stripe')('sk_test_51OkP9QKa0BEOKwekOTKYJaJQPDSwfMmT4Fb8PtYYKgixcOyL5II3106UbajXitNMxy4MUAs767XG21ZE8JId4wKt00El13BkiO');

const paymentController = {};

paymentController.processPayment = async (req, res) => {
    try {
        const { amount, currency, paymentMethodId, description, cart } = req.body;

        // Validate request data
        if (!amount || !currency || !paymentMethodId || !description || !cart) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method: paymentMethodId, // Associate the payment method here
            confirmation_method: 'manual', // Indicate that confirmation is manual
            confirm: true, // Confirm the payment immediately
            description,
            use_stripe_sdk: true // For handling 3D Secure authentication
        });

        // Deduct product quantities
        for (let product of cart) {
            await axios.post(`http://localhost:3000/api/produits/${product.id}/deduct`, {
                quantity: product.quantity
            });
        }

        res.json({ success: true, clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error processing payment:', error); // Log the error stack trace
        res.status(500).json({ error: error.message });
    }
};

paymentController.confirmation = async (req, res) => {
    res.render('confirmation');
};

module.exports = paymentController;