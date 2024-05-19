// Init le Carrousel avec Swiper
const swiper = new Swiper('.swiper', {
    slidesPerView: 3,
    spaceBetweenSlides: 0,
    direction: 'horizontal',
    loop: true,
    centeredSlides: true,
    autoplay: {                    
      delay: 4000,  
  },
    // Scrollbar
    scrollbar: {
      el: '.swiper-scrollbar',
      hide: true,
    },
    // Flèches suivantes et précédentes
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
});
