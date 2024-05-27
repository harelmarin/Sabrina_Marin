// Init le Carrousel avec Swiper
var swiper_bottom = new Swiper('.swiper-bottom', {
        slidesPerView: 3,
        freeMode: true,
        watchSlidesVisibility: true,
        direction: 'vertical',
        allowTouchMove: false,
        noSwiping: true, 
    });



// Init le Carrousel avec Swiper
var swiper = new Swiper('.swiper-top', {
    direction:'vertical',
    allowTouchMove: false,
    noSwiping: true, 
    // Flèches suivantes et précédentes
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    thumbs: {
        swiper: swiper_bottom,
    },
    on: {
        init: function() {
            swiper_bottom.allowTouchMove = false;
            swiper_bottom.allowSlidePrev = false;
            swiper_bottom.allowSlideNext = false;
        }
    }
});
