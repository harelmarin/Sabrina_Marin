function currencyMapping(currency) {
    const currencyMapping = {
        'EURO': '€',
        'DOLLARS': '$',
        'POUNDS': '£'
    };
    return currencyMapping[currency] || currency;
}

document.addEventListener('DOMContentLoaded', function () {
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
        prodID = product.id
        productImg.className = 'cart-item-image';
        const productDetails = document.createElement('div');
        productDetails.className = 'cart-item-details';
        let currency = currencyMapping(product.currency);
        let priceReduce = Math.round(product.price - (product.price * product.reduction) / 100)
        productDetails.innerHTML = `
            <h3>${product.name}</h3>
            <h4>Taille : ${product.size}</h4>
            <h5>Qté : ${product.quantity}</h5>
            <p>Livraison en 3 à 6 jours</p>
            <h2> ${priceReduce} ${currency}</h2>
        `;
        //inserer l'image dans une balise a
        const productLink = document.createElement('a');
        productLink.href = `/backend/produit/${prodID}`;
        productLink.appendChild(productImg);
        productDiv.appendChild(productLink);
        productDiv.appendChild(productDetails);
        cartItemsDiv.appendChild(productDiv);
        total += priceReduce * product.quantity;

        //le  bouton pour pouvoir supprimer un produit du panier
        const removeButton = document.createElement('button');
        const ImgSupp = document.createElement('img');
        ImgSupp.src = '../assets/img/fermer.png';
        removeButton.className = 'remove-button';
        removeButton.appendChild(ImgSupp);

        productDiv.appendChild(removeButton);
        removeButton.addEventListener('click', function () {
            cart = cart.filter(p => p.id !== product.id);
            localStorage.setItem('cart', JSON.stringify(cart));
            productDiv.remove();
            total -= priceReduce * product.quantity;
            document.getElementById('total-price').innerText = `Total: ${total} EUR`;
        });
    });
  
    const clearCartButton = document.getElementById('clear-cart');
    clearCartButton.addEventListener('click', function () {
        localStorage.removeItem('cart');
        cartItemsDiv.innerHTML = '';
        document.getElementById('total-price').innerText = 'Total: 0 EUR';
        document.getElementById('checkout-button').style.display = 'none';
        //masquer la div des produits
        document.getElementById('cart-items').style.display = 'none';
    });
});