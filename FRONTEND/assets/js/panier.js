function currencyMapping(currency) {
    const currencyMapping = {
        'EURO': '€',
        'DOLLARS': '$',
        'POUNDS': '£'
    };
    return currencyMapping[currency] || currency;
}

document.addEventListener('DOMContentLoaded', function() {
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
        productID= product.id
        productImg.className = 'cart-item-image';                     
        const productDetails = document.createElement('div');
        productDetails.className = 'cart-item-details';
        let currency=currencyMapping(product.currency);
        
        productDetails.innerHTML = `
            <h3>${product.name}</h3>
            <h4>Taille : ${product.size}</h4>
            <h5>Qté : ${product.quantity}</h5>
            <p>Livraison en 3 à 6 jours</p>
            <h2>${product.price} ${currency}</h2>
        `;
        //inserer l'image dans une balise a
        const productLink = document.createElement('a');    
        productLink.href = `/backend/produit/${productID}`;
        productLink.appendChild(productImg);
        productDiv.appendChild(productLink);
      
        productDiv.appendChild(productDetails);
        cartItemsDiv.appendChild(productDiv);

        total += product.price * product.quantity;
    });

    document.getElementById('total-price').innerText = `Total: ${total} EUR`;

    const clearCartButton = document.getElementById('clear-cart');
    clearCartButton.addEventListener('click', function() {
        localStorage.removeItem('cart');
        cartItemsDiv.innerHTML = '';
        document.getElementById('total-price').innerText = 'Total: 0 EUR';
    });
});