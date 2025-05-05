(function ($) {

    'use strict';

    /*-------------------------------------------
        off-canvas-menu
    --------------------------------------------- */

    $('.off-canvas-menu .has-dropdown').prepend('<span class="toggle-btn"><i class="icon"></i></span>');

    $('.off-canvas-menu .has-dropdown > .toggle-btn').on('click', function (e) {
        e.preventDefault();
        $(this).parent().toggleClass('active');
        $(this).parent().children('.sub-menu').slideToggle();
        $(this).parent().siblings().children('.sub-menu').slideUp();
        $(this).parent().siblings().removeClass('active');
    });

    $(".off-canvas-overlay").on('click', function () {
        $(this).parent().removeClass('active');
        $('.off-canvas-wrap').removeClass('active');
    });
    $(".off-canvas-close").on('click', function () {
        $('.off-canvas-section').removeClass('active');
        $('.off-canvas-wrap').removeClass('active');
    });

    $(".open-menu-bar").on('click', function () {
        $('.off-canvas-section').addClass('active');
        $('.off-canvas-wrap').addClass('active');
    });

    /*-------------------------------------------
        nice select
    --------------------------------------------- */
    if (jQuery(".nice-select-active").length > 0) {
        $('.nice-select-active select').niceSelect();
    }


    //shopping-cart-bar
    $(".shopping-cart").on("click", function () {
        $(".cart-menu-right").addClass('cart-info');
    });
    $(".close-icon").click(function () {
        $(".cart-menu-right").removeClass('cart-info');

    });

    //---------------------------Sticky Header


    let win = $(window);
    let sticky_id = $(".main-header-area");
    win.on('scroll', function () {
        let scroll = win.scrollTop();
        if (scroll < 245) {
            sticky_id.removeClass("sticky-header");
        } else {
            sticky_id.addClass("sticky-header");
        }
    });


    $(window).on('load', function () { // makes sure the whole site is loaded

        // -------------------- Site Preloader
        $('#ctn-preloader').fadeOut(); // will first fade out the loading animation
        $('#preloader').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website.
        $('body').delay(350).css({ 'overflow': 'visible' });

    });  //End On Load Function


    //------------------ scrollupfunc();

    var scrollToTopBtn = $('#scrollToTopBtn');

    $(window).scroll(function () {
        if ($(window).scrollTop() > 300) {
            scrollToTopBtn.addClass('show');
        } else {
            scrollToTopBtn.removeClass('show');
        }
    });

    scrollToTopBtn.on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, '300');
    });


    /*------------------------------------
        Data-Background
    --------------------------------------*/
    $("[data-background]").each(function () {
        $(this).css("background-image", "url(" + $(this).attr("data-background") + ")")
    });

    $("[data-bg-color]").each(function () {
        $(this).css("background", $(this).attr("data-bg-color"))
    });

    if (jQuery(".odometer").length > 0) {
        $('.odometer').appear(function (e) {
            var odo = $(".odometer");
            odo.each(function () {
                var countNumber = $(this).attr("data-count");
                $(this).html(countNumber);
            });
        });
    }

    if (jQuery(".open-popup-video").length > 0) {
        new VenoBox({
            selector: '.open-popup-video',
            numeration: true,
            infinigall: true,
            share: true,
            spinner: 'rotating-plane'
        });
    }

    if (jQuery(".testimonial-slider-active").length > 0) {
        let testimonialSlider = new Swiper('.testimonial-slider-active', {
            // Optional parameters
            slidesPerView: 2,
            slidesPerColumn: 1,
            paginationClickable: true,
            loop: true,
            spaceBetween: 60,

            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },

            // Navigation arrows
            navigation: {
                nextEl: '.testimonial-button-next',
                prevEl: '.testimonial-button-prev',
            },

            a11y: false,

            breakpoints: {
                320: {
                    slidesPerView: 1,
                },
                768: {
                    slidesPerView: 1,
                },
                992: {
                    slidesPerView: 2,
                },
                1200: {
                    slidesPerView: 2,
                },
            },
        })
    }

    if (jQuery(".testimonial-slider-active-2").length > 0) {
        let testimonialSlider2 = new Swiper('.testimonial-slider-active-2', {
            // Optional parameters
            slidesPerView: 3,
            slidesPerColumn: 1,
            paginationClickable: true,
            loop: true,
            spaceBetween: 30,

            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },

            // If we need pagination
            pagination: {
                el: '.swiper-pagination-2',
                clickable: true,
            },

            // Navigation arrows
            navigation: {
                nextEl: '.testimonial-button-next-2',
                prevEl: '.testimonial-button-prev-2',
            },

            a11y: false,

            breakpoints: {
                320: {
                    slidesPerView: 1,
                },
                768: {
                    slidesPerView: 1,
                },
                992: {
                    slidesPerView: 2,
                },
                1200: {
                    slidesPerView: 3,
                },
            },
        })
    }

    if (jQuery(".testimonial-slider-active-3").length > 0) {
        let testimonialSlide3 = new Swiper('.testimonial-slider-active-3', {
            // Optional parameters
            slidesPerView: 1,
            slidesPerColumn: 1,
            paginationClickable: true,
            loop: true,
            spaceBetween: 30,

            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },

            // If we need pagination
            pagination: {
                el: '.swiper-pagination-3',
                clickable: true,
            },

            // Navigation arrows
            navigation: {
                nextEl: '.testimonial-button-next-3',
                prevEl: '.testimonial-button-prev-3',
            },

            a11y: false
        })
    }

    if (jQuery(".brand-layout-2").length > 0) {
        let brandlayout2 = new Swiper('.brand-layout-2', {
            // Optional parameters
            slidesPerView: 5,
            slidesPerColumn: 1,
            paginationClickable: true,
            loop: true,
            spaceBetween: 30,
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },

            a11y: false,
            breakpoints: {
                320: {
                    slidesPerView: 1,
                },
                768: {
                    slidesPerView: 3,
                },
                992: {
                    slidesPerView: 4,
                },
                1200: {
                    slidesPerView: 5,
                },
            },
        })
    }

    if (jQuery(".blog-classic-slider").length > 0) {
        let blogClassicActive = new Swiper('.blog-classic-slider', {
            // Optional parameters
            slidesPerView: 1,
            slidesPerColumn: 1,
            paginationClickable: true,
            loop: true,
            spaceBetween: 30,
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },

            a11y: false,
            // Navigation arrows
            navigation: {
                nextEl: '.testimonial-button-next-3',
                prevEl: '.testimonial-button-prev-3',
            },

        })
    }

    //product__item__slider
    $('.product__item__slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: '.product__thumb__slider'
    });
    $('.product__thumb__slider').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        asNavFor: '.product__item__slider',
        autoplay: true,
        autoplaySpeed: 3000,
        dots: false,
        arrows: false,
        centerMode: false,
        focusOnSelect: true,
        responsive: [
            {
                breakpoint: 1201,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                }
            },

            {
                breakpoint: 980,
                settings: {
                    slidesToShow: 3,
                }
            },

            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 3,
                }
            }
        ]
    });



    /* Cart Plus Minus Js */
    $(".cart-plus-minus").append('<div class="dec qtybutton">-</div><div class="inc qtybutton">+</div>');
    $(".qtybutton").on("click", function () {
        var $button = $(this);
        var oldValue = $button.parent().find("input").val();
        if ($button.text() == "+") {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            // Don't allow decrementing below zero
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        $button.parent().find("input").val(newVal);
    });

    //jquiry-price-slider
    $(function () {
        $("#slider-range").slider({
            range: true,
            min: 0,
            max: 500,
            values: [75, 300],
            slide: function (event, ui) {
                $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
            }
        });
        $("#amount").val("$" + $("#slider-range").slider("values", 0) +
            " - $" + $("#slider-range").slider("values", 1));
    });


    //jquiry-price-slider
    $(function () {
        $("#slider-range").slider({
            range: true,
            min: 0,
            max: 500,
            values: [75, 300],
            slide: function (event, ui) {
                $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
            }
        });
        $("#amount").val("$" + $("#slider-range").slider("values", 0) +
            " - $" + $("#slider-range").slider("values", 1));
    });

    AOS.init();


})(jQuery);
