const axios = require('axios');
const fs = require('fs');
const path = require('path');
const stripe = require('stripe')('sk_test_51OkP9QKa0BEOKwekOTKYJaJQPDSwfMmT4Fb8PtYYKgixcOyL5II3106UbajXitNMxy4MUAs767XG21ZE8JId4wKt00El13BkiO');
const nodemailer = require('nodemailer');
const dotenvPath = path.resolve(__dirname, '../.env');

let confirmationCode;

const apiBaseUrl = 'http://localhost:3000/api/produits';

if (fs.existsSync(dotenvPath)) {
    console.log('.env file found');
    require('dotenv').config({ path: dotenvPath });
} else {
    console.log('.env file not found');
}
const paymentController = {};

function genererCodeConfirmation() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }

    return code;
}

paymentController.sendConfirmationEmail = async (req, res) => {
    const { email, name } = req.body;
    const passWord = process.env.EMAIL_PASS;
    const emailAuth = process.env.EMAIL;

    confirmationCode = genererCodeConfirmation();
    const transporter = nodemailer.createTransport({
        service: 'gmail', // service d'email
        auth: {
            user: emailAuth,
            pass: passWord,
        }
    });

    const mailOptions = {
        from: emailAuth,
        to: email,
        subject: 'Confirmation de paiement',
        text: `Bonjour ${name},\n\nVotre code de confirmation est : ${confirmationCode}\n\nMerci.`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ confirmationCode: confirmationCode });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email de confirmation:', error);
        errorMessage = error;
        res.status(500).render('security', { errorMessage: 'Erreur lors de l\'envoi de l\'email de confirmation' });
    }
};

paymentController.confirmUser = async (req, res) => {
    try {
        const { address, enteredCode, cart } = req.body;
        const userId = req.session.userId;  //recup de l'id de la session
        if (enteredCode !== confirmationCode) {
            console.log("le code de confirmation   " + confirmationCode);
            console.log("le code entré   " + enteredCode);
            console.log("CODE INCORRECT")
            return res.status(400).render('security', 'Code de confirmation incorrect');
        }
        console.log("li d de la session    " + userId);
        console.log("le code de confirmation   " + confirmationCode);
        console.log("le code entré   " + enteredCode);
        console.log("CODE CORRECT")

        // Ajouter la commande de l'utilisateur
        const user = { userId, address, cart };
        const response = await axios.post(`${apiBaseUrl}/addUserCommand`, user);
        
        // Si la commande est ajoutée avec succès, déduire les quantités des produits
        if (response.data && response.data.userId) {
            for (let product of cart) {
                await axios.post(`${apiBaseUrl}/${product.id}/deduct`, {
                    quantity: product.quantity
                });
            }
            res.status(200).json({ userId: response.data.userId });
        } else {
            console.error('userId is missing in the response:', response.data);
            res.status(500).json({ error: 'userId is missing in the response' });
        }
    } catch (error) {
        console.error('Erreur lors de la confirmation du code:', error);
        res.status(500).json({ error: 'Erreur lors de la confirmation du code.' });
    }
};

paymentController.processPayment = async (req, res) => {
    try {
        console.log("process payment ");
        const { amount, currency, source, description } = req.body;

        // Validate request data
        if (!amount || !currency || !source || !description) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Créer le paiement avec Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            payment_method_types: ['card'],
            description: description,
            payment_method: source,
            confirm: true // Confirmation paiement immédiatement
        });

        // Si le paiement est réussi, envoyer un email de confirmation
        // Note: Le cart ne doit pas être envoyé ici, il sera utilisé après la confirmation
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
