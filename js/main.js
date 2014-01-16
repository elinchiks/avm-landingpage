/**********************************************************************
 * main.js
 * behaviours for avm landingpage
 * @author: Sven Kesting <sven@v26.org>
 * @author: Elina Sundukova <elina.sundukova@thinkmoto.de>
 * @dependencies: jQuery, jQuery UI Draggable
 *********************************************************************/

// global landingpage object
var avmlp = {
    // properties
    defaultHeight: 960,
    defaultWidth: 1200,
    zoom: 1,
    sectionNames: [
        "start",
        "heimnetz",
        "wlan",
        "usb3",
        "telefonie",
        "fritzos",
        "auszeichnungen"
    ],
    currentSectionIndex: 0,
    $slides: null,
    $viewport: null,

    // product animation
    aniStart: 1800,
    aniStep: 1,
    aniTargetStep: 1,
    aniImages: [],
    aniTotalImages: 250,
    aniImagesLowSrcPrefix: "./frames/320px/",
    aniImagesHighSrcPrefix: "./frames/960px/",
    aniTimeoutID: null,
    desktop: !Modernizr.touch,

    // methods
    resizeSections: function() {
        var h = jQuery("html").height();
        var w = jQuery("html").width();
        jQuery("section").css("height", h + "px");
        var zoom = this.zoom;
        // update zoom
        if (h < this.defaultHeight) {
            this.zoom = h / this.defaultHeight;
        } else {
            this.zoom = 1;
        }
        if (w < this.defaultWidth) {
            if ( (w / this.defaultHeight) < this.zoom ) {
                this.zoom = w / this.defaultHeight;
            }
        }
        if (zoom !== this.zoom) {
            this.applyZoom();
        }

    },

    // Positioning viewport in the middle
    positionViewport: function() {
        var width = $('#viewport').width();
        $('#viewport').css({'left':'50%', 'margin-left': -width /2 });
    },

    positionSlide: function() {
        var width = $('.slide').width();
        $('.slide').css({'left':'50%', 'margin-left': -width /2 });
    },

    applyZoom: function() {
        var top = -(this.defaultHeight - this.defaultHeight * this.zoom) / 2;
        // TODO: left needs to be set, especially for narrow viewports

        // apply scaling to slides and viewport
        jQuery("section .slide, #viewport").css({
            "-webkit-transform": "scale(" + this.zoom + ", " + this.zoom + ")",
            "-ms-transform": "scale(" + this.zoom + ", " + this.zoom + ")",
            "transform": "scale(" + this.zoom + ", " + this.zoom + ")",
            "top": top + "px"
        });
    },

    setNavigationState: function() {
        var currentSectionIndex = Math.floor( $(window).scrollTop() / ( this.defaultHeight * this.zoom ) );
        if (currentSectionIndex < 0) {
            currentSectionIndex = 0;
        }
        if (currentSectionIndex >= avmlp.sectionNames.length) {
            currentSectionIndex = avmlp.sectionNames.length - 1;
        }
        if (currentSectionIndex === this.currentSectionIndex) {
            return; // section hasn't changed
        }
        this.currentSectionIndex = currentSectionIndex;

        // update content!
        // this.setViewportContent();

        // set Navigation Hilite
        var currentSection = this.sectionNames[currentSectionIndex];
        if ( ! $("#primary ." + currentSection).hasClass("active") ) {
            $("#primary li").each(function(){
                $(this).removeClass("active");
            });
            $("#primary ." + currentSection).addClass("active");
            // trigger event
            // console.log(currentSection);
            $( window ).trigger( "sectionChange", [ currentSection ] );
        }
    },

    pad: function(number, length) { // pad numbers with leading zeros for JPEG sequence file names
        var str = '' + number; while (str.length < length) { str = '0' + str; } return str;
    },

    // set inside/outside slider positions
    updateSlider: function() {
        var w = Math.floor( $(".drag-wrapper").position().left / this.zoom);
        $(".inside-view-before").width(w+18);
        $(".inside-view-after").width( 960 - (w+18) );
        $(".inside-view-after").css("background-position", 960 - (w+18) + "px 0");
    },

    animateSlider: function(pos) {
        $(".drag-wrapper").animate({ "left": pos }, {
            duration: 1200,
            easing: "easeOutElastic",
            progress: function() {
                avmlp.updateSlider();
            }
        });
    }

};

// Document ready handler
jQuery( document ).ready(function( $ ) {
    // clickable bullets in Navigation
    $("#primary li").css("cursor", "pointer");
    $("#primary li").on("click", function(e) {
        e.preventDefault();
        var href = $(this).find("a").attr("href");
        if (href) {
            window.location = href;
        }
    });

    avmlp.resizeSections();
    avmlp.positionViewport();
    avmlp.positionSlide();


    // inside/outside image - using jquery ui draggable
    $(".drag-wrapper").draggable({
        axis: "x",
        cursor: "move",
        handle: ".drag-handle",
        containment: ".inside-view",
        start: function(){
            $('.inside-view-before').find('.hotspot.active').removeClass('active');
        },
        drag: function() {
            avmlp.updateSlider();

        },
        stop: function() {
            avmlp.updateSlider();
        }
    });
    // avmlp.animateSlider(450);

    // make hotspot callout's sticky
    $(".hotspot").on("mouseenter", function() {
        $(".hotspot").removeClass("active");
        $(this).addClass("active");
    });


});

// resize handler
jQuery( window ).on( "resize", function() {
    avmlp.resizeSections();
    avmlp.positionSlide();
});

jQuery( window ).on( "sectionChange", function(e, sectionName ) {
    switch (sectionName) {
        case "start":
            break;
        case "heimnetz":
            window.setTimeout(function() {
                avmlp.animateSlider(450);
            }, 400);
            break;
        case "wlan":
            break;
        case "usb3":
            break;
        case "telefonie":
            break;
        case "fritzos":
            break;
        case "auszeichnungen":
            break;
    }
});



/* Taken from
Javascript-video-scrubber Demo
Created by Gary Hepting and the Dev Team at Emerge Interactive
Fork, follow and watch on Github at https://github.com/ghepting/javascript-video-scrubber
Visit Emerge Interctive at http://emergeinteractive.com/
*/
var requestAnimFrame = (function() {
    // reduce CPU consumption, improve performance
    return window.requestAnimationFrame    ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();

(function animloop(){ // the smoothest animation loop possible
    requestAnimFrame(animloop);
    // Highlight Navigation
    avmlp.setNavigationState();
})();



