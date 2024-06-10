function currencyMapping(currency) {
    const currencyMapping = {
        'EURO': '€',
        'DOLLARS': '$',
        'POUNDS': '£'
    };
    return currencyMapping[currency] || currency;
}

document.addEventListener('DOMContentLoaded', function () {
    const favorisContainer = document.getElementById('favoris-container');

    let LikeCart = localStorage.getItem('favoris');
    LikeCart = LikeCart ? JSON.parse(LikeCart) : [];

    new Sortable(favorisContainer, {
        animation: 150, 
        onEnd: updateOrder 
    });

    if (LikeCart.length > 0) {
        LikeCart.forEach((product) => {
            let currency = currencyMapping(product.currency);
            const productElement = document.createElement('div');
            productElement.classList.add('favoris-item');
            productElement.classList.add('produitsfav');

            productElement.innerHTML = `
            <a href="/backend/produit/${product.id}">
              <img src="${product.imagePath}" alt="${product.name}" class="favoris-image">
                </a>
                
                    <h3>${product.name}</h3>
                    <h4>Genre: ${product.gender}</h4>
                    <h5>Prix: ${product.price} ${currency}</h5>
                
            `;
            //le  bouton pour pouvoir supprimer un produit des favoris
            const removeButton = document.createElement('button');
            removeButton.innerText = 'Supprimer';
            removeButton.className = 'remove-button';
            productElement.appendChild(removeButton);
            removeButton.addEventListener('click', function () {
                LikeCart = LikeCart.filter(p => p.id !== product.id);
                localStorage.setItem('favoris', JSON.stringify(LikeCart));
                productElement.remove();
            });
            favorisContainer.appendChild(productElement);
           
        });
    } else {
        favorisContainer.innerHTML = '<h5 class="titre-fav">Vos Favoris sont vides </h5>';
    }
});

function removeFavoris(productId) {
    let LikeCart = localStorage.getItem('favoris');
    LikeCart = LikeCart ? JSON.parse(LikeCart) : [];

    LikeCart = LikeCart.filter(product => product.id !== productId);

    localStorage.setItem('favoris', JSON.stringify(LikeCart));
}

function updateOrder(event) {
    const items = event.target.querySelectorAll('.favoris-item');
    const newOrder = [];
    items.forEach(item => {
      newOrder.push(parseInt(item.getAttribute('data-id')));
    });
    console.log('Nouvel ordre des favoris :', newOrder);
  }
