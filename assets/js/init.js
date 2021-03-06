jQuery(document).ready(function($) {

    const $header = $('#header');
    const $welcome = $('#welcome');
    const $menuToggler = $('#menuToggler');
    const $headerCollapse = $('#headerCollapse');

    /**
     * A tiny plugin to check if element exist and if
     * does act accordingly
     *
     * @param  {Function} callback A callback funciton to call if element exists
     * @return {object}            jQuery element object
     */
    $.fn.exists = function( callback ) {
        var args = [].slice.call( arguments, 1 );

        if ( ! callback ) {
            return this.length;
        }

        if ( this.length ) {
            callback.call( this, args );
        }

        return this;
    };


    /**
     * Mobile menu
     */
    $menuToggler.click( function(e) {
        let $this = $(this);

        if ( $this.hasClass('open') ) {
            $headerCollapse.slideUp().removeClass('open');
            $this.attr( 'aria-expanded', false ).removeClass('open');
        } else {
            $headerCollapse.slideDown().addClass('open');
            $this.attr( 'aria-expanded', true ).addClass('open');
        }

        e.preventDefault();
    });


    function repositionMainHeader() {
        let headerPosition = $header.position();
        let windowPosition = $(window).scrollTop();

        if ( windowPosition > headerPosition.top ) {
            $header.addClass('short');
        } else {
            $header.removeClass('short');
        }
    }

    if ( $(window).width() > 991.9 ) {

        /**
         * Animated header
         */
        $(window).scroll(function() {
            repositionMainHeader();
        });

        $(document).ready(function() {
            repositionMainHeader();
        });

        /**
         * Remove active classes
         */
        $welcome.waypoint( function() {
            $('#mainNav > li').removeClass('active');
        }, { offset : '-75%' });

    } else {

        /**
         * Close the mobile menu on link click
         */
        $('#mainNav > li > a').on('click', function() {
            $headerCollapse.slideUp().removeClass('open');
            $menuToggler.attr( 'aria-expanded', false ).removeClass('open');
        });
    }


    /**
     * Main nav
     */
    $('#mainNav > li').each( function() {
        let $this    = $(this);
            $target  = $this.data('target') ? $( $this.data('target') ) : false,
            elOffset = $this.data('offset') ? $this.data('offset') : 70; // header height

        if ( $target && $target.length ) {
            $target.waypoint( function() {
                $('#mainNav > li').removeClass('active');
                $this.addClass('active');
            }, { offset : elOffset });
        }
    });


    // To fix focus poblem on Chrome mobile
    $.fn.focusNoScroll = function() {
        var x = window.scrollX,
            y = window.scrollY;

        this.focus();
        window.scrollTo(x, y);

        return this;
    };


    /**
     * Smooth scroll. For back to top target #wrapper
     */
    $('a[href*="#"]').not('[href="#"]').not('[href="#0"]').click( function( event ) {
        if ( location.pathname.replace( /^\//, '' ) == this.pathname.replace( /^\//, '' ) && location.hostname == this.hostname ) {

            let $this = $(this);
            let target = $( this.hash );

            target = target.length ? target : $( '[name=' + this.hash.slice( 1 ) + ']' );

            // Skip bootstrap slider buttons as well
            if ( target.length && ( $this.data('slide') === undefined ) && ( $this.data('toggle') === undefined ) ) {

                // Do we have a custom offset?
                var offset = $this.data('offset') || 0;

                // Only prevent default if animation is actually gonna happen
                event.preventDefault();

                $( 'html, body' ).animate({
                    scrollTop: ( target.offset().top - offset )
                }, 1000, function() {
                    let $target = $( target );
                    $target.focusNoScroll();
                    if ( $target.is( ":focus" ) ) {
                        return false;
                    } else {
                        $target.attr( 'tabindex', '-1' );
                        $target.focusNoScroll();
                    };
                });
            }
        }
    });


    /**
     * We can't have a caption going out of the carousel box because
     * of the overflow:hidden so we have a custom captions
     */
    $("#aboutCarousel").on('slide.bs.carousel', function(evt) {

        let step = $(evt.relatedTarget).index();

        $('#aboutCaptions .carousel-captione:not(#aboutCaption-' + step + ')').hide('fast', function() {
            $('#aboutCaption-' + step).fadeIn();
        });
    });


    /**
     * Read more / less .btnReadMore
     */
    $('.btnReadMore').on('click', function() {
        let $this = $(this);

        $this.html( $this.attr('aria-expanded') == 'true' ? 'Read more' : 'Read less');
    });


    /**
     * Add class to visible elements so we can add css
     * accordingly
     */
    $('#projects .project:visible:last').addClass('last-visible');
    $('#moreProjects').on('shown.bs.collapse', function () {
        $('#projects .project').removeClass('last-visible');
        $('#projects .project:visible:last').addClass('last-visible');
    });


    /**
     * A fix for no swipe for Bootstrap 4 Carousel
     *
     * @see https://github.com/twbs/bootstrap/issues/17118#issuecomment-382643969
     */
    let touchStartX = null;

    $('.carousel').each(function() {
        let $carousel = $(this);
        $(this).on('touchstart', function (event) {
            let e = event.originalEvent;
            if (e.touches.length == 1) {
                let touch = e.touches[0];
                touchStartX = touch.pageX;
            }
        }).on('touchmove', function (event) {
            let e = event.originalEvent;
            if (touchStartX != null) {
                let touchCurrentX = e.changedTouches[0].pageX;
                if ((touchCurrentX - touchStartX) > 60) {
                    touchStartX = null;
                    $carousel.carousel('prev');
                } else if ((touchStartX - touchCurrentX) > 60) {
                    touchStartX = null;
                    $carousel.carousel('next');
                }
            }
        }).on('touchend', function () {
            touchStartX = null;
        });
    });


    /**
     * Disable autoplay video on mobile since
     * we are hiding it anyway
     */
    let screenWidth = $(window).width();
    if ( screenWidth < 768 ) {
        $('video').removeAttr('autoplay');
    } else {
        $('video').attr('autoplay');
    }

}); // jQuery end

// Sections animation on scroll
window.sr = ScrollReveal({
    viewFactor : 0.15,
    duration   : 1000,
    distance   : "0px",
    scale      : 0.8,
    mobile     : false,
    reset      : false
});

sr.reveal('.animate');
sr.reveal('.animate-delay', { duration: 1000 }, 250);