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
                "top": "136px",
                "left": "122px",
                "low": new Image(),
                "high": new Image(),
                "highSrc": this.aniImagesHighSrcPrefix + "comp_" + this.pad(i, 4) + ".png"
            };
            this.aniImages[i].low.src = this.aniImagesLowSrcPrefix + "comp_" + this.pad(i, 4) + ".png";
        }
        // override the positions
        this.aniImages[20].top = "154px";
        this.aniImages[21].top = "172px";
        this.aniImages[22].top = "190px";
        this.aniImages[23].top = "208px";
        this.aniImages[24].top = "226px";
        this.aniImages[25].top = "244px";
        this.aniImages[26].top = "262px";
        this.aniImages[27].top = "280px";
        this.aniImages[28].top = "298px";
        this.aniImages[29].top = "316px";
        this.aniImages[30].top = "334px";
        this.aniImages[31].top = "352px";
        this.aniImages[32].top = "370px";
        this.aniImages[33].top = "388px";
        this.aniImages[34].top = "406px";
        this.aniImages[35].top = "424px";
        this.aniImages[36].top = "442px";
        this.aniImages[37].top = "460px";
        this.aniImages[38].top = "478px";
        this.aniImages[39].top = "496px";
        this.aniImages[40].top = "514px";
        this.aniImages[41].top = "532px";
        this.aniImages[42].top = "550px";
        this.aniImages[43].top = "560px";
        this.aniImages[44].top = "575px";
        this.aniImages[45].top = "580px";
        this.aniImages[46].top = "570px";
        this.aniImages[47].top = "560px";
        this.aniImages[48].top = "550px";
        this.aniImages[49].top = "540px";
        this.aniImages[50].top = "530px";
        this.aniImages[51].top = "520px";
        this.aniImages[52].top = "510px";
        this.aniImages[53].top = "500px";
        this.aniImages[54].top = "490px";
        this.aniImages[55].top = "480px";
        this.aniImages[55].top = "470px";
        this.aniImages[56].top = "460px";
        this.aniImages[57].top = "450px";
        this.aniImages[58].top = "440px";
        this.aniImages[59].top = "430px";
        this.aniImages[60].top = "420px";
        this.aniImages[61].top = "410px";
        this.aniImages[62].top = "400px";
        this.aniImages[63].top = "390px";
        this.aniImages[64].top = "380px";
        this.aniImages[65].top = "370px";
        this.aniImages[66].top = "360px";
        this.aniImages[67].top = "350px";
        this.aniImages[68].top = "340px";
        this.aniImages[69].top = "330px";
        this.aniImages[70].top = "320px";
        this.aniImages[71].top = "310px";
        this.aniImages[72].top = "300px";
        this.aniImages[73].top = "290px";
        this.aniImages[74].top = "280px";
        this.aniImages[75].top = "290px";
        this.aniImages[76].top = "270px";
        this.aniImages[77].top = "270px";
        this.aniImages[78].top = "270px";
        this.aniImages[79].top = "260px";
        this.aniImages[80].top = "260px";
        this.aniImages[81].top = "260px";
        this.aniImages[82].top = "260px";
        this.aniImages[83].top = "260px";
        this.aniImages[84].top = "260px";
        this.aniImages[85].top = "260px";
        this.aniImages[86].top = "260px";
        this.aniImages[87].top = "260px";
        this.aniImages[88].top = "260px";
        this.aniImages[89].top = "260px";
        this.aniImages[90].top = "260px";
        this.aniImages[91].top = "260px";
        this.aniImages[92].top = "260px";
        this.aniImages[93].top = "260px";
        this.aniImages[94].top = "260px";
        this.aniImages[95].top = "260px";
        this.aniImages[96].top = "260px";
        this.aniImages[97].top = "260px";
        this.aniImages[98].top = "260px";
        this.aniImages[99].top = "260px";
        this.aniImages[100].top = "250px";
        this.aniImages[101].top = "240px";
        this.aniImages[102].top = "230px";
        this.aniImages[103].top = "220px";
        this.aniImages[104].top = "210px";
        this.aniImages[105].top = "200px";
        this.aniImages[106].top = "190px";
        this.aniImages[108].top = "180px";
        this.aniImages[109].top = "170px";
        this.aniImages[110].top = "160px";
        this.aniImages[111].top = "150px";
        this.aniImages[112].top = "140px";
        this.aniImages[113].top = "136px";
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
            this.$viewport.find(".link-next").show();
        } else {
            this.$viewport.find(".logo-fritz-color").hide();
            this.$viewport.find(".logo-fritz").show();
            this.$viewport.find(".link-next").hide();
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

        // this.$viewport.find("#packshot").css({
        //     "top": $(sectionId).find(".packshot").css("top"),
        //     "left": $(sectionId).find(".packshot").css("left")
        // });

        this.$viewport.find("p").css({
            "bottom": $(sectionId).find("p").css("bottom"),
            "left": $(sectionId).find("p").css("left")
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
                        "top": aniImage.top,
                        "left": aniImage.left,
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

        avmlp.aniTargetStep = Math.ceil ( ( t - ( avmlp.aniStart * avmlp.zoom ) ) / 12 ); // what frame to animate to
        if( avmlp.aniTargetStep !== avmlp.aniStep ) {
            // increment the step until we arrive at the target step
            avmlp.aniStep += Math.ceil(( avmlp.aniTargetStep - avmlp.aniStep) / 5);
        }
        avmlp.changeFrame();
    }

    if (avmlp.debug) {
        $("#debug-scroll-top").text(t + "px");
    }

})();



