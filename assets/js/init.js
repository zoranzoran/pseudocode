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
     * We can't have a cpation going out of the carousel box because
     * of the overflow:hidden so we have a custom captions
     */
    $("#aboutCarousel").on('slide.bs.carousel', function(evt) {

        let step = $(evt.relatedTarget).index();

        $('#aboutCaptions .carousel-captione:not(#aboutCaption-' + step + ')').fadeOut('fast', function() {
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

}); // jQuery end


var tag = document.createElement( 'script' );

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName( 'script' )[ 0 ];
firstScriptTag.parentNode.insertBefore( tag, firstScriptTag );

var player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player( 'player', {
        height: '315',
        width: '560',
        videoId: 'Ol35jqmLdNg',
        playerVars : {
            'controls' : 0,
            'showinfo' : 0,
            'rel' : 0,
            'autoplay' : 1,
            'loop' : 1,
            'mute' : 1,
            'modestbranding' : 1,
            'playlist' : 'Ol35jqmLdNg',
            'enablejsapi' : 1,
            'origin' : 'https://pseudocode.agency'
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}


function onPlayerReady( event ) {
    event.target.playVideo();
}

// this is to track loops
var playerStarted = false;

function onPlayerStateChange( event ) {

    var $heroImage = jQuery('#heroImage');

    if ( event.data == YT.PlayerState.PLAYING ) {
        if ( cleanTime() == 0 && !playerStarted ) {
            playerStarted = true;

            if ( $heroImage.is(':visible') ) {
                $heroImage.fadeOut();
            }
        }
    }
}

// utility
function cleanTime() {
    return Math.round( player.getCurrentTime() );
}

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