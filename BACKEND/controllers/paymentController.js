const axios = require('axios');
const stripe = require('stripe')('sk_test_51OkP9QKa0BEOKwekOTKYJaJQPDSwfMmT4Fb8PtYYKgixcOyL5II3106UbajXitNMxy4MUAs767XG21ZE8JId4wKt00El13BkiO');
const nodemailer = require('nodemailer');
const dotenvPath = path.resolve(__dirname, '../.env');

// Configuration de l'URL de base de l'API
const apiBaseUrl = 'http://localhost:3000/api/produits';

if (fs.existsSync(dotenvPath)) {
    console.log('.env file found');
    require('dotenv').config({ path: dotenvPath });
} else {
    console.log('.env file not found');
}

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
    confirm: true //confirmation paiement immédiatement
});

        // Deduct product quantities
        for (let product of cart) {
            await axios.post(`${apiBaseUrl}/${product.id}/deduct`, {
                quantity: product.quantity
            });
        }

       // Si le paiement est réussi,
       res.status(200).json({ message: 'Paiement réussi', paymentIntent: paymentIntent });
    
    } catch (error) {
        console.error('Error processing payment:', error); // Log the error stack trace
        res.status(500).json({ error: error.message });
    } 
};

paymentController.confirmation = async (req, res) => {
    try {
    res.render('confirmation', { message: 'Votre paiement a été confirmé avec succès.' });
    // requete a l'api pour ajouter l'utilisateur à la base de données


    } catch (error) {
        console.error('Erreur lors de la confirmation du paiement:', error);
        res.status(500).json({ error: 'Erreur lors de la confirmation du paiement' });
    }  

};




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
    confirmationCode=genererCodeConfirmation();

    const transporter = nodemailer.createTransport({
        service: 'gmail', // service d'email
        auth: {
            user:`${emailAuth}`,
            pass:`${passWord}`,
        }
    });

    const mailOptions = {
        from: `${emailAuth}`,
        to: email,
        subject: 'Confirmation de paiement',
        text: `Bonjour ${name},\n\nVotre code de confirmation est : ${confirmationCode}\n\nMerci.`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email de confirmation envoyé' });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email de confirmation:', error);
        res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email de confirmation' });
    }
};



paymentController.processPayment = async (req, res) => {
    try {
        const { amount, currency, source, description, cart, name, firstname, email, address, confirmationCode } = req.body;

        // Validate request data
        if (!amount || !currency || !source || !description || !cart) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Créer le paiement avec Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            payment_method_types: ['card'],
            description: description,
            payment_method: source,
            confirm: true
        });

        // Déduire les quantités de produits
        for (let product of cart) {
            await axios.post(`http://localhost:3000/api/produits/${product.id}/deduct`, {
                quantity: product.quantity
            });
        }

        // Enregistrer l'utilisateur dans la base de données
        const user = await db.query('INSERT INTO users (name, firstname, email, address, code) VALUES (?, ?, ?, ?, ?)', 
            [name, firstname, email, address, confirmationCode]);

        // Lier l'utilisateur et les produits achetés
        for (let product of cart) {
            await db.query('INSERT INTO buy (idProduct, idUser) VALUES (?, ?)', [product.id, user.insertId]);
        }

        // Si le paiement est réussi, renvoyez une réponse appropriée
        res.status(200).json({ message: 'Paiement réussi', paymentIntent: paymentIntent });

    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ error: error.message });
    }
};
module.exports = paymentController;