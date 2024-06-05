// Init le Carrousel avec Swiper
const swiper = new Swiper('.swiper', {
    slidesPerView: 3,
    spaceBetweenSlides: 0,
    direction: 'horizontal',
    loop: true,
    centeredSlides: true,
    autoplay: {                    
      delay: 3000,  
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
    breakpoints: {
      1050: {
        slidesPerView: 3,
        spaceBetweenSlides: 0,
        centeredSlides: true,
      },
      762: {
        slidesPerView: 2,
        spaceBetween: 0,
        centeredSlides: false,
      },
      0: {
        slidesPerView: 1,
        spaceBetween: 0,
        centeredSlides: true,
      },


      
    },
});
