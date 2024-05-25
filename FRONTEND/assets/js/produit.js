document.addEventListener('DOMContentLoaded', function() {
    const addToCartButton = document.getElementById('add-to-cart-button');
    const colorInputs = document.querySelectorAll('input[name="color"]');
    const sizeInputs = document.querySelectorAll('input[name="size"]');
    const productImagesDiv = document.getElementById('product-images');

    // Les chemins d'images sont définis dynamiquement dans le script intégré
    // const imagesPaths est déjà défini dans le script intégré au-dessus

    colorInputs.forEach(input => {
        input.addEventListener('change', function() {
            updateProductImages(input.value);
        });
    });

    function updateProductImages(color) {
        productImagesDiv.innerHTML = '';
        imagesPaths[color].forEach(imagePath => {
            const img = document.createElement('img');
            img.src = imagePath;
            img.width = 140;
            productImagesDiv.appendChild(img);
        });
    }

    addToCartButton.addEventListener('click', function() {
        const selectedColor = document.querySelector('input[name="color"]:checked').value;
        const selectedSize = document.querySelector('input[name="size"]:checked').value;
        const product = {
            id: document.getElementById('produit-idProduct').dataset.id,
            name: document.getElementById('product-name').dataset.name,
            price: parseFloat(document.getElementById('product-price').dataset.price),
            currency: document.getElementById('product-price').dataset.currency,
            reduction: parseFloat(document.getElementById('product-reduction').dataset.reduction),
            quantity: parseInt(document.getElementById('quantity').value),
            color: selectedColor,
            size: selectedSize
        };

        let cart = localStorage.getItem('cart');
        cart = cart ? JSON.parse(cart) : [];

        const existingProductIndex = cart.findIndex(item => item.id === product.id && item.color === product.color && item.size === product.size);

        if (existingProductIndex > -1) {
            cart[existingProductIndex].quantity += product.quantity;
        } else {
            cart.push(product);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Produit ajouté au panier');
        console.log('Produit ajouté au panier', product);
    });

    // Initialiser les images avec la couleur par défaut (white)
    updateProductImages('white');
});
