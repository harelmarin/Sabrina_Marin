document.addEventListener('DOMContentLoaded', function() {
    const addToCartButton = document.getElementById('add-to-cart-button');
    const colorButtons = document.querySelectorAll('.color-button');
    const sizeButtons = document.querySelectorAll('.size-button');
   
    // Init le Carrousel avec Swiper pour le bas
    var swiperBottom = new Swiper('.swiper-bottom', {
        slidesPerView: 3,
        freeMode: true,
        watchSlidesVisibility: true,
        direction: 'vertical',
        allowTouchMove: false,
        noSwiping: true, 
    });
    // Init le Carrousel avec Swiper pour le haut
    var swiperTop = new Swiper('.swiper-top', {
        direction: 'vertical',
        allowTouchMove: false,
        noSwiping: true,
        autoplay: {                    
            delay:2000,  
        },
        thumbs: {
            swiper: swiperBottom,
        },
        on: {
            init: function() {
                swiperBottom.allowTouchMove = false;
                swiperBottom.allowSlidePrev = false;
                swiperBottom.allowSlideNext = false;
            }
        }
    });

    // Initialiser les images avec la couleur par défaut (première couleur dans la liste)
    const defaultColor = document.querySelector('.color-button').dataset.color.toLowerCase();
    updateProductImages(defaultColor);

    colorButtons.forEach(button => {
        button.addEventListener('click', function () {
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
        button.addEventListener('click', function () {
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
            img.parentElement.style.display = 'none';
        });

        // Afficher uniquement les images qui contiennent la couleur dans leur chemin
        imageElements.forEach(img => {
            const imgSrcLowerCase = img.src.toLowerCase();
            if (imgSrcLowerCase.includes(color)) {
                img.parentElement.style.display = 'flex';
            }
        });

        // Réinitialiser Swiper après la mise à jour des images
        swiperTop.update();
        swiperBottom.update();
    }
    //ajouter un produit au panier
    addToCartButton.addEventListener('click', function () {
        const selectedColor = document.querySelector('.color-button.selected').dataset.color;
        const selectedSize = document.querySelector('.size-button.selected').dataset.size;
        const displayedImage = document.querySelector('.product-image[style*="display: block;"]');
        // Récupérer le chemin de la première image correspondant à la couleur sélectionnée
        const productImages = document.querySelectorAll('.product-image');
        let imagePath = '';
        for (let i = 0; i < productImages.length; i++) {
            const img = productImages[i];
            const imgSrcLowerCase = img.src.toLowerCase();
            if (imgSrcLowerCase.includes(selectedColor)) {
                imagePath = img.src;
                break;
            }
        }
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
        console.log('Produit ajouté au panier', product);
    });

    // masquer les descptions avec +100caracteres
    var descriptionElement = document.getElementById("product-description");
    var descriptionContainer = document.getElementById("description-container");
    var showMoreBtn = document.getElementById("show-more-btn");

    var description = descriptionElement.dataset.description;
    var truncatedDescription = description.length > 100 ? description.slice(0, 100) + "..." : description;
  
    descriptionElement.textContent = truncatedDescription;

    // display le bouton voir plus si la description > 100 caractères
    if (description.length > 100) {
        showMoreBtn.style.display = "block";
    }
   showMoreBtn.addEventListener("click", function() {
        // remplacement de la description tronquée par la description complète
        descriptionElement.textContent = description;
        showMoreBtn.style.display = "none";
    });
    //ajouter le bouton au container
    descriptionContainer.appendChild(showMoreBtn);
});