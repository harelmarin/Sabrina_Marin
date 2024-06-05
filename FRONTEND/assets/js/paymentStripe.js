// Fonction de conversion de devise
function convertCurrency(currency) {
    const currencyMapping = {
        'EURO': 'eur',
        'DOLLARS': 'usd',
        'POUNDS': 'gbp'
    };
    return currencyMapping[currency] || currency;
}

document.addEventListener('DOMContentLoaded', function () {
    var stripe = Stripe('pk_test_51OkP9QKa0BEOKwek4AcHZOLCTI4gsDDZSCzWGrRjQt8hHy8sCueAiNxxwnjbUAPfEEtOXRiJ72nF2oO5puW0G8oW00efoSjW1x');
    var elements = stripe.elements();
    var cardElement = elements.create('card');
    cardElement.mount('#card-element');

    var form = document.getElementById('payment-form');
    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        // Charger les produits du panier
        let cart = localStorage.getItem('cart');
        cart = cart ? JSON.parse(cart) : [];
        let totalAmount = 0;
        let currency = 'eur'; // Par défaut, définir sur EUR

        cart.forEach(product => {
            currency = convertCurrency(product.currency); // Assurre que tous les produits ont la même devise
            totalAmount += product.price * product.quantity;
        });

        // Conversion en centimes pour Stripe
        totalAmount = Math.round(totalAmount * 100);

        var { paymentMethod, error } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            document.getElementById('card-errors').textContent = error.message;
        } else {
            var response = await fetch('/backend/payment/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: totalAmount,
                    currency: currency,
                    paymentMethodId: paymentMethod.id, // Envoyer l'ID de la méthode de paiement
                    description: 'Paiement des produits du panier WETHEFOOT',
                    cart: cart // Envoyer les détails du panier au backend
                })
            });

            if (!response.ok) {
                document.getElementById('card-errors').textContent = 'Erreur lors du traitement du paiement.';
            } else {
                var { clientSecret } = await response.json();
                //cnfirmer le pauement avec le clientSECret
                var result = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: paymentMethod.id,
                    use_stripe_sdk: true,
                });

                if (result.error) {
                    document.getElementById('card-errors').textContent = result.error.message;
                }else{
                    localStorage.removeItem('cart');
                    window.location.href = '/backend/payment/confirmation'; // redirection du client confirmation
    
                } }
        }
    });
});
