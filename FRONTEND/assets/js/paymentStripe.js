// Fonction de conversion de devise
function convertCurrency(currency) {
    const currencyMapping = {
        'EURO': 'eur'
    };
    return currencyMapping[currency] || currency;
}

document.addEventListener('DOMContentLoaded', function() {
    var stripe = Stripe('pk_test_51OkP9QKa0BEOKwek4AcHZOLCTI4gsDDZSCzWGrRjQt8hHy8sCueAiNxxwnjbUAPfEEtOXRiJ72nF2oO5puW0G8oW00efoSjW1x');
    var elements = stripe.elements();
    var cardElement = elements.create('card');
    cardElement.mount('#card-element');

    var form = document.getElementById('payment-form');
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        var reductionPercentage = document.getElementById('product-reduction').dataset.reduction;
        var productName = document.getElementById('product-name').dataset.name;
        var productDescription = `ACHAT DE '${productName}' CHEZ PYRAMIDE`;
        var productPrice = document.getElementById('product-price').dataset.price;
        var productCurrency = document.getElementById('product-price').dataset.currency;
        var quantity = document.getElementById('quantity').value;

        // Conversion de la devise
        productCurrency = convertCurrency(productCurrency);
        
        // Appliquer la réduction au produit
        var priceReducted = (productPrice - (productPrice * reductionPercentage) / 100);

        // Calculer le prix total en fonction de la quantité
        var totalAmount = priceReducted * quantity;
        
        console.log(productName, productDescription, totalAmount, productCurrency);

        var { paymentMethod, error } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            document.getElementById('card-errors').textContent = error.message;
        } else {
            var response = await fetch('/payment/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: totalAmount * 100, // Stripe utilise les plus petites unités (centimes)
                    currency: productCurrency,
                    source: paymentMethod.id,
                    description: productDescription,
                    quantity: quantity // Inclure la quantité dans le corps de la requête
                })
            });

            if (!response.ok) {
                document.getElementById('card-errors').textContent = 'Erreur lors du traitement du paiement.';
            } else {
                window.location.href = '/payment/confirmation'; // Rediriger vers la page de confirmation
            }
        }
    });

});
