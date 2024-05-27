document.addEventListener('DOMContentLoaded', function() {
    const addToCartButton = document.getElementById('add-to-cart-button');
    const colorButtons = document.querySelectorAll('.color-button');
    const sizeButtons = document.querySelectorAll('.size-button');
    const productImagesDiv = document.getElementById('product-images');

    // Initialiser les images avec la couleur par défaut (première couleur dans la liste)
    const defaultColor = document.querySelector('.color-button').dataset.color.toLowerCase();
    updateProductImages(defaultColor);

    colorButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedColorButton = document.querySelector('.color-button.selected');
            if (selectedColorButton) {
                selectedColorButton.classList.remove('selected');
            }
            button.classList.add('selected');
            const color = button.dataset.color.toLowerCase();
            updateProductImages(color);
        });
    });

    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedSizeButton = document.querySelector('.size-button.selected');
            if (selectedSizeButton) {
                selectedSizeButton.classList.remove('selected');
            }
            button.classList.add('selected');
        });
    });

    function updateProductImages(color) {
        const imageElements = document.querySelectorAll('.product-image');

        // Masquer toutes les images
        imageElements.forEach(img => {
            img.style.display = 'none';
        });

        // Afficher uniquement les images qui contiennent la couleur dans leur chemin
        imageElements.forEach(img => {
            const imgSrcLowerCase = img.src.toLowerCase();
            if (imgSrcLowerCase.includes(color)) {
                img.style.display = 'block';
                productImagesDiv.appendChild(img);
            }
        });
    }

    addToCartButton.addEventListener('click', function() {
        const selectedColor = document.querySelector('.color-button.selected').dataset.color;
        const selectedSize = document.querySelector('.size-button.selected').dataset.size;
        const displayedImage = document.querySelector('.product-image[style*="display: block;"]');
        const imagePath = displayedImage ? displayedImage.src : '';

        const product = {
            id: document.getElementById('produit-idProduct').dataset.id,
            name: document.getElementById('product-name').dataset.name,
            price: parseFloat(document.getElementById('product-price').dataset.price),
            currency: document.getElementById('product-price').dataset.currency,
            reduction: parseFloat(document.getElementById('product-reduction').dataset.reduction),
            quantity: parseInt(document.getElementById('quantity').value),
            color: selectedColor,
            size: selectedSize,
            imagePath: imagePath
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
});