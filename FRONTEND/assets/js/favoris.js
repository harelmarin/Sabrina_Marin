
document.addEventListener('DOMContentLoaded', function () {
    const posts = document.querySelectorAll('.post');
    posts.forEach((post) => {
        const likeButton = post.querySelector('.like');

 //select la source de l'image
 const img = post.querySelector('.product-imagePath');
 let image_path = img.src;
         console.log("image liké   "+image_path)
        likeButton.addEventListener('click', function () {
            const product = {
                id: post.querySelector('.produit-idProduct').dataset.id,
                name: post.querySelector('.product-name').dataset.name,
                gender: post.querySelector('.product-gender').dataset.name,
                price: parseFloat(post.querySelector('.product-price').dataset.price),
                currency: post.querySelector('.product-price').dataset.currency,
                imagePath: image_path,
            };

            let LikeCart = localStorage.getItem('favoris');
            LikeCart = LikeCart ? JSON.parse(LikeCart) : [];

            const existingProductIndex = LikeCart.findIndex(item => item.id === product.id);

            if (existingProductIndex > -1) {
                likeButton.classList.remove('coeur_like');
                likeButton.classList.add('coeur');
                LikeCart.splice(existingProductIndex, 1);
                alert('Produit retiré des favoris');
            } else {
                console.log(img);
                likeButton.classList.remove('coeur');
                likeButton.classList.add('coeur_like');
                LikeCart.push(product);
            }

            localStorage.setItem('favoris', JSON.stringify(LikeCart));
            console.log('Produit ajouté aux favoris', product);
        });
    });
});