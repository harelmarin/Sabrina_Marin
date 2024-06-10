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


        let cart = localStorage.getItem('cart');
        cart = cart ? JSON.parse(cart) : [];
        let totalAmount = 0;
        let productDescription = `ACHAT DES PRODUITS CHEZ WETHEFOOT`;
        let Currency = "eur";
        cart.forEach(product => {
            totalAmount += (product.price - (product.price * product.reduction) / 100) * product.quantity;

            // Vérifiez si currency est toujours null et si oui, affectez-lui la devise actuelle du produit
           
        });
        if (Currency === null) {
            throw new Error("Aucune devise n'a été trouvée pour les produits dans le panier.");
        }
        totalAmount = Math.round(totalAmount * 100);


        var { paymentMethod, error } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            document.getElementById('card-errors').textContent = error.message;
        } else {
            var emailResponse = await fetch('/backend/payment/sendConfirmationEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: form.name.value,
                    firstname: form.firstname.value,
                    email: form.email.value,
                    address: form.address.value
                })
            });

            if (!emailResponse.ok) {
                document.getElementById('card-errors').textContent = 'Erreur lors de l\'envoi de l\'email de confirmation.';
            } else {
                document.getElementById('submitCode').onclick = function () {
                    const enteredCode = document.getElementById('confirmationCode').value;
                    // Traitez le code de confirmation ici
                    console.log("Code de confirmation entré : " + enteredCode);
                    closeModal();
                }
                
                var confirmUserResponse = await fetch('/backend/payment/confirmUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: form.name.value,
                        firstname: form.firstname.value,
                        email: form.email.value,
                        address: form.address.value,
                        enteredCode: enteredCode,
                        cart: cart,
                    })
                });

                if (!confirmUserResponse.ok) {
                    document.getElementById('card-errors').textContent = 'Erreur lors de la confirmation du code.';
                } else {

                    var paymentResponse = await fetch('/backend/payment/process', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            amount: totalAmount,
                            currency: Currency,
                            source: paymentMethod.id,
                            description: productDescription,
                            cart: cart,
                        })
                    });

                    if (!paymentResponse.ok) {
                        document.getElementById('card-errors').textContent = 'Erreur lors du traitement du paiement.';
                    } else {
                        console.log("payment réussi");
                        localStorage.removeItem('cart');
                        window.location.href = '/backend/payment/confirmation';
                    }
                }
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