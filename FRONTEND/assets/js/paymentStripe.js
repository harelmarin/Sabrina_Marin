// Fonction de conversion de devise
function convertCurrency(currency) {
    const currencyMapping = {
        'EURO': 'eur',
        'DOLLARS': 'usd',
        'POUNDS': 'gbp'
    };
    return currencyMapping[currency] || currency;
}
//afficher le prix total sur la page
const productsAmount = document.getElementById('products-amount');
// Stripe
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
        let productDescription = `ACHAT DES PRODUITS  CHEZ WETHEFOOT`;
        cart.forEach(product => {
            currency = convertCurrency(product.currency); // Assurre que tous les produits ont la même devise
            totalAmount += (product.price - (product.price * product.reduction) / 100) * product.quantity;
        });

        // Conversion en centimes pour Stripe
        totalAmount = Math.round(totalAmount * 100);


        //afficher le motant total a payer sur la page

        productsAmount.innerHTML = `
        <h1> Total à payer: ${totalAmount / 100} </h1>
    `;

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
                    source: paymentMethod.id,
                    description: productDescription,
                    cart: cart // Envoyer les détails du panier au backend
                })
            });

            if (!response.ok) {
                document.getElementById('card-errors').textContent = 'Erreur lors du traitement du paiement.';
            } else {
                console.log("payment réussi")
                //vider le panier
                localStorage.removeItem('cart');
                window.location.href = '/backend/payment/confirmation'; // Rediriger vers la page de confirmation
            }
        }
    });
    //
    //
    //suggestions d'aadresses
    const addressInput = document.getElementById('address');
    const suggestionsList = document.getElementById('suggestions');

    addressInput.addEventListener('input', async function () {
        const query = addressInput.value;

        if (query.length < 3) {
            suggestionsList.innerHTML = '';
            return;
        }

        const response = await fetch(`https://data.geopf.fr/geocodage/completion?text=${query}&type=PositionOfInterest,StreetAddress&maximumResponses=5`);
        const data = await response.json();

        if (data.status === 'OK') {
            suggestionsList.innerHTML = '';

            data.results.forEach(result => {
                const listItem = document.createElement('li');
                listItem.textContent = result.fulltext;
                listItem.style.cursor = 'pointer';

                listItem.addEventListener('click', function () {
                    addressInput.value = result.fulltext;
                    suggestionsList.innerHTML = '';
                });

                suggestionsList.appendChild(listItem);
            });
        }
    });
});