document.addEventListener('DOMContentLoaded', function() {
    // Initialisation de Stripe
    var stripe = Stripe('pk_test_51OkP9QKa0BEOKwek4AcHZOLCTI4gsDDZSCzWGrRjQt8hHy8sCueAiNxxwnjbUAPfEEtOXRiJ72nF2oO5puW0G8oW00efoSjW1x');
    var elements = stripe.elements();
    var cardElement = elements.create('card');
    cardElement.mount('#card-element');

    // Charger les produits du panier
    let cart = localStorage.getItem('cart');
    cart = cart ? JSON.parse(cart) : [];
    const cartItemsDiv = document.getElementById('cart-items');

    let total = 0;

    cart.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'cart-item';

        const productImg = document.createElement('img');
        productImg.src = product.imagePath;
        productImg.alt = product.name;
        productImg.className = 'cart-item-image';
        productImg.style.width='150px'

        const productDetails = document.createElement('div');
        productDetails.className = 'cart-item-details';
        productDetails.innerHTML = `
        <h3>${product.name}</h3>
        <h2>${product.price} ${product.currency} x ${product.quantity}</h2>
            <h3>Couleur: ${product.color}</h3>
            <h3>Taille: ${product.size}</h3>
        `;

        productDiv.appendChild(productImg);
        productDiv.appendChild(productDetails);
        cartItemsDiv.appendChild(productDiv);

        total += product.price * product.quantity;
    });

    document.getElementById('total-price').innerText = `Total: ${total} EUR`;

    // Vider le panier
    const clearCartButton = document.getElementById('clear-cart');
    clearCartButton.addEventListener('click', function() {
        localStorage.removeItem('cart');
        cartItemsDiv.innerHTML = '';
        document.getElementById('total-price').innerText = 'Total: 0 EUR';
        alert('Panier vidé');
    });

    // Formulaire de paiement
    var form = document.getElementById('payment-form');
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

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
                    amount: total * 100, // Stripe utilise les plus petites unités (centimes)
                    currency: 'eur',
                    source: paymentMethod.id,
                    description: 'Paiement des produits du panier PYRAMIDE'
                })
            });

            if (!response.ok) {
                document.getElementById('card-errors').textContent = 'Erreur lors du traitement du paiement.';
            } else {
                localStorage.removeItem('cart');
                window.location.href = '/payment/confirmation'; // Rediriger vers la page de confirmation
            }
        }
    });
});
