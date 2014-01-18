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
    currentSection: false,
    lastSection: false,
    sectionTop: [],
    sectionFrames: [
        48,
        48,
        48,
        48,
        48,
        48,
        48
    ],

    aniSpeed: 20,
    aniTimeoutID: null,
    aniImages: [],
    aniStep: 0,
    aniTargetStep: 0,
    aniLastStep: null,
    animationData: false,
    isAnimationReady: false,

    // methods
    setSectionTop: function() {
        var h = 0;
        for(var i = 0; i < this.sectionFrames.length; i++) {
            this.sectionTop[i] = h;
            h += this.sectionFrames[i] * this.aniSpeed;
        }
        // this.sectionTop = [
        //     0,
        //     48 * this.aniSpeed,
        //     96 * this.aniSpeed,
        //     144 * this.aniSpeed,
        //     192 * this.aniSpeed,
        //     240 * this.aniSpeed,
        //     345 * this.aniSpeed
        // ];
    },

    loadAnimationImages: function() {

        var frames = this.animationData.frames;

        for (var i = 0; i < frames.length; i++) {
            if (!frames[i].img) {
                this.aniImages[i] = {
                    "low": null,
                    "high": null,
                    "highSrc": null
                };
            } else {
                this.aniImages[i] = {
                    "low": new Image(),
                    "high": new Image(),
                    "highSrc": this.animationData.hiSrcPrefix + frames[i].img
                };
                this.aniImages[i].low.src = this.animationData.lowSrcPrefix + frames[i].img;
                // $(this.aniImages[i].low).on("load", function(e) {
                //     // TODO: this handler could be used to toggle a loading indicator
                // })
            }
        }
    },

    resizeSections: function() {
        var h = jQuery("html").height();
        var w = jQuery("html").width();
        // jQuery("section").css("height", h + "px");
        var zoom = this.zoom;
        // update zoom
        if (h < this.defaultHeight) {
            this.zoom = h / this.defaultHeight;
        } else {
            this.zoom = 1;
        }
        if (w < this.defaultWidth) {
            if ( (w / this.defaultWidth) < this.zoom ) {
                this.zoom = w / this.defaultWidth;
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
        // var top = -(this.defaultHeight - this.defaultHeight * this.zoom) / 2;
        // apply scaling to slides
        var left = ($("body").width() - (1200 * this.zoom)) / 2;
        if (left < 0) {
            left = 0;
        }
        jQuery("section .slide").css({
            "-webkit-transform": "scale(" + this.zoom + ", " + this.zoom + ")",
            "-ms-transform": "scale(" + this.zoom + ", " + this.zoom + ")",
            "transform": "scale(" + this.zoom + ", " + this.zoom + ")",
            "left": left + "px"
        });
    },

    setNavigationState: function() {

        $( window ).trigger( "sectionChange", [ this.currentSection ] );

    },

    initScrollAnimation: function(animationData) {
        this.animationData = animationData;
        this.isAnimationReady = true;
        this.loadAnimationImages();


        // all sections get a fixed position, the top values are stored in the this.sectionTop array
        $("#viewport").css({
            "position": "fixed",
            "top": 0
        });
        $("section").css({
            "position": "absolute",
            "top": 0
        });

        // create new slide for the packshot animation
        var $section = $('<section id="packshot-wrapper" />');
        var $slide = $('<div class="slide packshot-slide" />');
        var $packshot =$('<img src="frames/960px/0000.png" id="packshot" width="960" height="640" alt="FRITZ!Box 7490" />');
        $packshot.appendTo($slide);
        $slide.appendTo($section);
        $section.prependTo($("#viewport"));

        // set scale for new slide as well
        this.applyZoom();

        // remove packshot-images from slides
        $("img.packshot").remove();

        // remove background from other slides, we'll use the background from the packshot-wrapper
        $(".slide").not(".packshot-slide").css("background", "transparent");

        // we need an element with the original height to re-enable scrolling
        var docHeight = this.sectionTop[this.sectionTop.length - 1] + this.defaultHeight;
        $("#scroll-placeholder").height(docHeight);

        // the fragment links need fixing
        var _this = this;
        $(".link-next").on("click", function(e) {
            e.preventDefault();
            _this.scrollToSection($(this).attr("href"));
        });

        // TODO: Nav-Links

        $("section").hide();
        // TODO: Show section requested by url fragment
        $("section#start").show();
        $("section#packshot-wrapper").show();
    },


    scrollToSection: function(fragment) {
        // TODO
        console.log("scrollToSection:", fragment);
    },

    // change product animation
    changeFrame: function() {
        if (this.debug) {
            $("#debug-section").text(this.animationData.frames[this.aniStep].s);
        }

        // show/hide sections
        var currentSection = this.animationData.frames[this.aniStep].s;
        if (this.lastSection !== currentSection) {
            $("#" + currentSection).show();
            $("#" + this.lastSection).hide();
            if (!this.animationData.frames[this.aniStep].imgCss) { // reset img position
                $("#packshot").css({
                    "top": "136px"
                });
            }
        }
        this.lastSection = currentSection;

        // Opacity for header
        if ($("#" + currentSection + " header").css("opacity") != this.animationData.frames[this.aniStep].ho ) {
            $("#" + currentSection + " header").css("opacity", this.animationData.frames[this.aniStep].ho);
        }

        // Opacity for paragraph
        if ($("#" + currentSection + " p").css("opacity") != this.animationData.frames[this.aniStep].po ) {
            $("#" + currentSection + " p").css("opacity", this.animationData.frames[this.aniStep].po);
        }

        // opacity fritz logo - not on every slide
        if ($("#" + currentSection + " .logo-fritz-color").length && $("#" + currentSection + " .logo-fritz-color").css("opacity") !== this.animationData.frames[this.aniStep].flo ) {
            $("#" + currentSection + " .logo-fritz-color").css("opacity", this.animationData.frames[this.aniStep].flo);
        }

        // opacity avm logo - not on every slide
        if ($("#" + currentSection + " .logo-avm").length && $("#" + currentSection + " .logo-avm").css("opacity") !== this.animationData.frames[this.aniStep].flo ) {
            $("#" + currentSection + " .logo-avm").css("opacity", this.animationData.frames[this.aniStep].alo);
        }

        // additional properties
        var a;
        var properties;
        if (a = this.animationData.frames[this.aniStep].a) {
            for (var e in a) {
                if (!a.hasOwnProperty(e)) {
                    continue;
                }
                properties = a[e];
                $("#" + currentSection + " " + e).css(properties);
            }
        }

        // execute code - always remember, eval is evil
        if (this.animationData.frames[this.aniStep].code) {
            eval(this.animationData.frames[this.aniStep].code);
        }

        // css code for #packshot
        if (this.animationData.frames[this.aniStep].imgCss) {
            $("#packshot").css(this.animationData.frames[this.aniStep].imgCss);
        }

        // packshot images
        if(this.aniImages.length && this.aniImages[this.aniStep]) {
            var aniImage = this.aniImages[this.aniStep];
            if (!aniImage.low) {
                if ($("#packshot:visible").length) {
                    $('#packshot').hide();
                }
                return;
            }
            if(aniImage.low.complete) { // if the image is downloaded and ready
                if (!$("#packshot:visible").length) {
                    $('#packshot').show();
                }
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
                    });
                }
            }
        }
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
    },

    setSliderPosition: function(pos) {
        $(".drag-wrapper").css({ "left": pos });
        avmlp.updateSlider();
    }

};

// Document ready handler
jQuery( document ).ready(function( $ ) {
    avmlp.setSectionTop();

    // Debug
    if ($("#debug-bar").length) {
        $("#debug-bar").on("click", function(e) {
            e.preventDefault();
            $("body").removeClass("debug");
            $("#debug-bar").remove();
            avmlp.debug = false;
        });
    } else {
        avmlp.debug = false;
    }

    // Ajax-Load animation properties & and initialize animation
    $.ajax({
        url: "js/animation.json",
        dataType: "json",
        success: function(data) {
            avmlp.initScrollAnimation(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Oh noes! Getting animation properties failed because: ", errorThrown);
        }
    });

    // clickable bullets in Navigation
    $("#primary li").css("cursor", "pointer");
    $("#primary li").on("click", function(e) {
        e.preventDefault();
        var href = $(this).find("a").attr("href");
        if (href) {
            window.location = href;
            $(this).parents("ul").find("li").removeClass("active");
            $(this).addClass("active");
        }
    });

    avmlp.resizeSections();

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

    // make hotspot callout's sticky
    $(".hotspot").on("mouseenter", function() {
        $(".hotspot").removeClass("active");
        $(this).addClass("active");
    });


});

// resize handler
jQuery( window ).on( "resize", function() {
    avmlp.resizeSections();
});


// with the sectionChange event we can control some animations taht should play when a slide is entered
jQuery( window ).on( "sectionChange", function(e, sectionName ) {
    $('section').removeClass('active');
    setTimeout(function(){
        $('#' + sectionName ).addClass('active');
    }, 100);

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

    var t = $(window).scrollTop();
    avmlp.aniTargetStep = Math.ceil ( t / avmlp.aniSpeed );

    // what frame to animate to
    if( avmlp.aniTargetStep !== avmlp.aniStep ) {
        // increment the step until we arrive at the target step
        avmlp.aniStep += Math.ceil( ( avmlp.aniTargetStep - avmlp.aniStep) / 5);
    }

    if (avmlp.isAnimationReady && avmlp.aniStep !== avmlp.aniLastStep) {
        avmlp.changeFrame();
        avmlp.aniLastStep = avmlp.aniStep;
    }

    if (avmlp.debug) {
        $("#debug-animation-step").text(avmlp.aniStep);
        $("#debug-scroll-top").text(t + "px");
    }

})();



