/**********************************************************************
 * main.js
 * behaviours for avm landingpage
 * @author: Sven Kesting <sven@v26.org>
 * @author: Elina Sundukova <elina.sundukova@thinkmoto.de>
 * @dependencies: jQuery
 *********************************************************************/

// global landingpage object
var avmlp = {
    // properties
    debug: true,

    defaultHeight: 960,
    defaultWidth: 1200,
    zoom: 1,
    sectionNames: [
        "start",
        "innenleben",
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
    aniStart: 1200,
    aniStep: 1,
    aniTargetStep: 1,
    aniImages: [],
    aniTotalImages: 250,

    // methods
    initAnimationImages: function() {
        for(var i = 0; i < this.aniTotalImages; i++) { // loop for each image in sequence
            this.aniImages[i] =  new Image(); // add image object to array
            this.aniImages[i].src = "./frames/400px/comp_" + this.pad(i, 4) + ".png";
        }
    },


    initInsideView :function(){
        $('#detailed-view').beforeAfter({
            animateIntro : true,
            introDelay : 2000,
            introDuration : 300,
            showFullLinks : false
        });
    },


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

        if (this.debug) {
            jQuery("#debug-section-height").text(h + "px");
            jQuery("#debug-zoom").text(this.zoom.toPrecision(3));
        }
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
        this.setViewportContent();

        // set Navigation Hilite
        var currentSection = this.sectionNames[currentSectionIndex];
        if ( ! $("#primary ." + currentSection).hasClass("active") ) {
            $("#primary li").removeClass("active");
            $("#primary ." + currentSection).addClass("active");
        }
    },

    initViewPort: function() {
        // clone sections
        this.$slides = $(".slide").clone();
        this.$viewport = $("#viewport");

        this.setViewportContent();
        // this.setNavigationState();
        this.$viewport.show();

        // hide original slides
        $(".slide").hide();

    },

    setViewportContent: function() {
        var $currentSlide = $( this.$slides[this.currentSectionIndex] );

        this.$viewport.find("header").html(
            $currentSlide.find("header").html()
        );
        this.$viewport.find("#packshot").attr("src",
            $currentSlide.find(".packshot").attr("src")
        );
        this.$viewport.find("p").html(
            $currentSlide.find("p").html()
        );
        // Start
        if (this.currentSectionIndex === 0) {
            this.$viewport.find(".logo-fritz-color").show();
            this.$viewport.find(".logo-fritz").hide();
        } else {
            this.$viewport.find(".logo-fritz-color").hide();
            this.$viewport.find(".logo-fritz").show();
        }

        // Look Inside
        if(this.currentSectionIndex === 1) {
            if (!this.$viewport.find("#detailed-view").length) {
                // first run - init before/after slider
                this.$viewport.append($currentSlide.find("#detailed-view"));
                this.initInsideView();
            } else {
                // just show the slider
                this.$viewport.find("#detailed-view").show();
            }
            this.$viewport.find("#packshot").hide();

        } else {

            this.$viewport.find("#detailed-view").hide();
            this.$viewport.find("#packshot").show();

        }

        if (this.debug) {
            jQuery("#debug-section-index").text(this.currentSectionIndex);
        }

    },

    // change product animation image
    changeFrame: function() {
        // if the image exists in the array
        if(this.aniImages.length > 0 && this.aniImages[this.aniStep]) {
            if(this.aniImages[this.aniStep].complete) { // if the image is downloaded and ready
                if($('#packshot').attr('src') !== this.aniImages[this.aniStep].src) {
                    $('#packshot').attr('src',this.aniImages[this.aniStep].src); // change the source of our placeholder image
                }
            }
        }
    },

    pad: function(number, length) { // pad numbers with leading zeros for JPEG sequence file names
        var str = '' + number; while (str.length < length) { str = '0' + str; } return str;
    }

};

// Document ready handler
jQuery( document ).ready(function( $ ) {

    // Debug
    if ($("#debug-bar").length) {
        $("#debug-bar").on("click", function(e) {
            e.preventDefault();
            $("#debug-bar").remove();
            avmlp.debug = false;
        });
    } else {
        avmlp.debug = false;
    }

    // clickable bullets in Navigation
    $("#primary li").on("click", function(e) {
        e.preventDefault();
        var href = $(this).children("a").attr("href");
        if (href) {
            window.location = href;
        }
    });

    avmlp.resizeSections();
    // avmlp.initInsideView();
    // initialise view port - all slides will displayed in there
    avmlp.initViewPort();

    // TODO: initial Navigation State isn't correct when url fragment is set.
    avmlp.setNavigationState();

    avmlp.initAnimationImages();



});

// resize handler
jQuery( window ).on( "resize", function() {
    avmlp.resizeSections();
});


/* Taken from
Javascript-video-scrubber Demo
Created by Gary Hepting and the Dev Team at Emerge Interactive
Fork, follow and watch on Github at https://github.com/ghepting/javascript-video-scrubber
Visit Emerge Interctive at http://emergeinteractive.com/
*/
var requestAnimFrame = (function() {
    // reduce CPU consumption, improve performance
    return  window.requestAnimationFrame       ||
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

    var t = $(window).scrollTop();
    if (t > avmlp.aniStart * avmlp.zoom) {

        avmlp.aniTargetStep = Math.ceil ( ( t - (avmlp.aniStart * avmlp.zoom ) ) / 12 ); // what frame to animate to
        if( avmlp.aniTargetStep !== avmlp.aniStep ) {
            // increment the step until we arrive at the target step
            avmlp.aniStep += Math.ceil((avmlp.aniTargetStep - avmlp.aniStep) / 5);
        }
        avmlp.changeFrame();
    }

    if (avmlp.debug) {
        $("#debug-scroll-top").text(t + "px");
    }

})();



