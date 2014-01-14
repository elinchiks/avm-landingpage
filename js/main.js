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

    // methods
    initAnimationImages: function() {
        for(var i = 0; i < this.aniTotalImages; i++) { // loop for each image in sequence
            this.aniImages[i] = {
                "top": 136,
                "left": 122,
                "low": new Image(),
                "high": new Image(),
                "highSrc": this.aniImagesHighSrcPrefix + "comp_" + this.pad(i, 4) + ".png"
            };
            this.aniImages[i].low.src = this.aniImagesLowSrcPrefix + "comp_" + this.pad(i, 4) + ".png";
        }

        // override the positions
        this.aniImages[20].top = 154;
        this.aniImages[21].top = 172;
        this.aniImages[22].top = 190;
        this.aniImages[23].top = 208;
        this.aniImages[24].top = 226;
        this.aniImages[25].top = 244;
        this.aniImages[26].top = 262;
        this.aniImages[27].top = 280;
        this.aniImages[28].top = 298;
        this.aniImages[29].top = 316;
        this.aniImages[30].top = 334;
        this.aniImages[31].top = 352;
        this.aniImages[32].top = 370;
        this.aniImages[33].top = 388;
        this.aniImages[34].top = 406;
        this.aniImages[35].top = 424;
        this.aniImages[36].top = 442;
        this.aniImages[37].top = 460;
        this.aniImages[38].top = 478;
        this.aniImages[39].top = 496;
        this.aniImages[40].top = 514;
        this.aniImages[41].top = 532;
        this.aniImages[42].top = 550;
        this.aniImages[43].top = 560;
        this.aniImages[44].top = 575;
        this.aniImages[45].top = 580;
        this.aniImages[46].top = 570;
        this.aniImages[47].top = 560;
        this.aniImages[48].top = 550;
        this.aniImages[49].top = 540;
        this.aniImages[50].top = 530;
        this.aniImages[51].top = 520;
        this.aniImages[52].top = 510;
        this.aniImages[53].top = 500;
        this.aniImages[54].top = 490;
        this.aniImages[55].top = 480;
        this.aniImages[55].top = 470;
        this.aniImages[56].top = 460;
        this.aniImages[57].top = 450;
        this.aniImages[58].top = 440;
        this.aniImages[59].top = 430;
        this.aniImages[60].top = 420;
        this.aniImages[61].top = 410;
        this.aniImages[62].top = 400;
        this.aniImages[63].top = 390;
        this.aniImages[64].top = 380;
        this.aniImages[65].top = 370;
        this.aniImages[66].top = 360;
        this.aniImages[67].top = 350;
        this.aniImages[68].top = 340;
        this.aniImages[69].top = 330;
        this.aniImages[70].top = 320;
        this.aniImages[71].top = 310;
        this.aniImages[72].top = 300;
        this.aniImages[73].top = 290;
        this.aniImages[74].top = 280;
        this.aniImages[75].top = 290;
        this.aniImages[76].top = 270;
        this.aniImages[77].top = 270;
        this.aniImages[78].top = 270;
        this.aniImages[79].top = 260;
        this.aniImages[80].top = 260;
        this.aniImages[81].top = 260;
        this.aniImages[82].top = 260;
        this.aniImages[83].top = 260;
        this.aniImages[84].top = 260;
        this.aniImages[85].top = 260;
        this.aniImages[86].top = 260;
        this.aniImages[87].top = 260;
        this.aniImages[88].top = 260;
        this.aniImages[89].top = 260;
        this.aniImages[90].top = 260;
        this.aniImages[91].top = 260;
        this.aniImages[92].top = 260;
        this.aniImages[93].top = 260;
        this.aniImages[94].top = 260;
        this.aniImages[95].top = 260;
        this.aniImages[96].top = 260;
        this.aniImages[97].top = 260;
        this.aniImages[98].top = 260;
        this.aniImages[99].top = 260;
        this.aniImages[100].top = 250;
        this.aniImages[101].top = 240;
        this.aniImages[102].top = 230;
        this.aniImages[103].top = 220;
        this.aniImages[104].top = 210;
        this.aniImages[105].top = 200;
        this.aniImages[106].top = 190;
        this.aniImages[108].top = 180;
        this.aniImages[109].top = 170;
        this.aniImages[110].top = 160;
        this.aniImages[111].top = 150;
        this.aniImages[112].top = 140;
        this.aniImages[113].top = 136;
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

        
        this.$viewport.find(".description").html(
            $currentSlide.find(".description").html()
        );

        // Start
        if (this.currentSectionIndex === 0) {
            this.$viewport.find(".logo-fritz-color").show();
            this.$viewport.find(".logo-fritz").hide();
            this.$viewport.find(".link-next").show();


        } else {
            this.$viewport.find(".logo-fritz-color").hide();
            this.$viewport.find(".logo-fritz").show();
            this.$viewport.find(".link-next").hide();
        }


       // Showing product graphics and fetures (WLAN)
        if($currentSlide.find(".product-graphics").length) {
            this.$viewport.find(".product-graphics").html(
            $currentSlide.find(".product-graphics").html()
        );
            this.$viewport.find(".product-graphics").show();
        } else {
            this.$viewport.find(".product-graphics").hide();
        }

        // Showing product fetures (WLAN)

        if($currentSlide.find(".product-features").length) {
            this.$viewport.find(".product-features").html(
            $currentSlide.find(".product-features").html()
        );
            this.$viewport.find(".product-features").show();
        } else {
            this.$viewport.find(".product-features").hide();
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

        // Fix positions
        var sectionId = "#" + this.sectionNames[this.currentSectionIndex];
        this.$viewport.find("header").css({
            "top": $(sectionId).find("header").css("top"),
            "left": $(sectionId).find("header").css("left")
        });

        this.$viewport.find("#packshot").css({
            "top": $(sectionId).find(".packshot").css("top"),
            "left": $(sectionId).find(".packshot").css("left")
        });
        this.$viewport.find("#packshot").attr("src",
            $(sectionId).find(".packshot").attr("src")
        );


        this.$viewport.find(".description").css({
            "bottom": $(sectionId).find(".description").css("bottom"),
            "left": $(sectionId).find(".description").css("left")
        });



        if (this.debug) {
            jQuery("#debug-section-index").text(this.currentSectionIndex);
        }

    },

    // change product animation image
    changeFrame: function() {
        // if the image exists in the array
        if(this.aniImages.length > 0 && this.aniImages[this.aniStep]) {
            var aniImage = this.aniImages[this.aniStep];

            if(aniImage.low.complete) { // if the image is downloaded and ready

                if($('#packshot').attr('src') !== aniImage.low.src &&
                    $('#packshot').attr('src') !== aniImage.highSrc ) {
                    window.clearTimeout(this.aniTimeoutID);

                    // load hi-quality src
                    this.aniTimeoutID = window.setTimeout(function() {
                        $('#packshot').attr('src', aniImage.highSrc);
                    }, 100);

                    // change the source of our placeholder image
                    $('#packshot').attr('src', aniImage.low.src);
                    $('#packshot').css({
                        "top": aniImage.top + "px",
                        "left": aniImage.left + "px",
                    });

                    if (this.debug) {
                        $("#debug-animation-step").text(this.aniStep);
                    }
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
        avmlp.aniTargetStep = Math.ceil ( ( t - ( avmlp.aniStart * avmlp.zoom ) ) / 12 );
    } else {
        avmlp.aniTargetStep = 0;
    }

    // what frame to animate to
    if( avmlp.aniTargetStep !== avmlp.aniStep ) {
        // increment the step until we arrive at the target step
        avmlp.aniStep += Math.ceil(( avmlp.aniTargetStep - avmlp.aniStep) / 5);
    }
    avmlp.changeFrame();

    if (avmlp.debug) {
        $("#debug-scroll-top").text(t + "px");
    }

})();



