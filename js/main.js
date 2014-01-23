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
    debug: false,

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
    offsetSize: 0,
    currentSection: false,
    lastSection: false,
    targetOffset: 0,

    aniJsonFile: "js/animation.json", // set this to "js/animation.json" if you want to make changes
    aniSpeed: 20,
    aniTimeoutID: null,
    aniImages: [],
    aniStep: 0,
    aniTargetStep: 0,
    aniLastStep: null,
    animationData: false,
    isAnimationReady: false,
    sectionOffset: [ // update these, if you insert new frames in animation.json
        0,
        69,
        148,
        266,
        323,
        400,
        485
    ],

    // methods
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
                // $(this.aniImages[i].low).on("load", function() {
                //     $("#led-5-off").toggle();
                //     window.setTimeout(function() {
                //         $("#led-5-off").hide();
                //     }, 400);
                // });
            }
        }
    },



    redrawDotNav: function(){


        var section1Top =  0;
        // The top of each section is offset by half the distance to the previous section.
        var section2Top =  $('#start').offset().top - (($('#heimnetz').offset().top - $('#start').offset().top) / 2);
        var section3Top =  $('#heimnetz').offset().top - (($('#wlan').offset().top - $('#heimnetz').offset().top) / 2);
        var section4Top =  $('#wlan').offset().top - (($('#usb3').offset().top - $('#wlan').offset().top) / 2);
        var section5Top =  $('#usb3').offset().top - (($('#telefonie').offset().top - $('#usb3').offset().top) / 2);
        var section6Top =  $('#telefonie').offset().top - (($('#fritzos').offset().top - $('#telefonie').offset().top) / 2);
        var section7Top =  $('#fritzos').offset().top - (($('#auszeichnungen').offset().top - $('#fritzos').offset().top) / 2);
        var section8Top =  $('#auszeichnungen').offset().top - (($(document).height() - $('#auszeichnungen').offset().top) / 2);

        $('nav.primary li').removeClass('active');
        if($(document).scrollTop() <= section1Top && $(document).scrollTop() < section2Top){

        } else if ($(document).scrollTop() >= section2Top && $(document).scrollTop() < section3Top){
             $('nav.primary li.start').addClass('active');
             $('section').removeClass('active');
             $('section#start').addClass('active');

        }
         else if ($(document).scrollTop() >= section3Top && $(document).scrollTop() < section4Top){
            $('nav.primary li.heimnetz').addClass('active');
            $('section').removeClass('active');
            $('section#heimnetz').addClass('active');

        }
         else if ($(document).scrollTop() >= section4Top && $(document).scrollTop() < section5Top){
            $('nav.primary li.wlan').addClass('active');
            $('section').removeClass('active');
            $('section#wlan').addClass('active');

        }
         else if ($(document).scrollTop() >= section5Top && $(document).scrollTop() < section6Top){
             $('nav.primary li.usb3').addClass('active');
             $('section').removeClass('active');
             $('section#usb3').addClass('active');

        }
         else if ($(document).scrollTop() >= section6Top && $(document).scrollTop() < section7Top){
            $('nav.primary li.telefonie').addClass('active');
            $('section').removeClass('active');
            $('section#telefonie').addClass('active');

        }
         else if ($(document).scrollTop() >= section7Top && $(document).scrollTop() < section8Top){
           $('nav.primary li.fritzos').addClass('active');
           $('section').removeClass('active');
           $('section#fritzos').addClass('active');

        }
        else if ($(document).scrollTop() >= section8Top){
            $('nav.primary li.auszeichnungen').addClass('active');
            $('section').removeClass('active');
            $('section#auszeichnungen').addClass('active');
            // $('#footer-section').css('display', 'block');
        }


    },


    resizeSections: function() {
        var h = jQuery("html").height();
        var w = jQuery("html").width();
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
        this.applyZoom();
        if (this.debug) {
            jQuery("#debug-section-height").text(h + "px");
            jQuery("#debug-zoom").text(this.zoom.toPrecision(3));
        }
    },

    applyZoom: function() {
       var top = ($(window).height() - this.defaultHeight * this.zoom) / 2;
       if($(window).height() > $(window).width()) {
            this.offsetSize = top;
       } else {
        this.offsetSize = 0;
        top = 0;
       }

        var left = ($("body").width() - (1200 * this.zoom)) / 2;
        if (left < 0) {
            left = 0;
        }
        jQuery("section .slide").css({
            "-webkit-transform": "scale(" + this.zoom + ", " + this.zoom + ")",
            "-ms-transform": "scale(" + this.zoom + ", " + this.zoom + ")",
            "transform": "scale(" + this.zoom + ", " + this.zoom + ")",
            "left": left + "px",
            "z-index": 2,
            "margin-top":'' + top + 'px',
            'box-sizing': 'content-box'
        });
    },

    setNavigationState: function() {

        $( window ).trigger( "sectionChange", [ this.currentSection ] );


    },

    initScrollAnimation: function(animationData) {
        this.animationData = animationData;
        this.isAnimationReady = true;

        // create new slide for the packshot animation
        var $section = $('<section id="packshot-wrapper" />');
        var $slide = $('<div class="slide packshot-slide" />');
        var $packshot =$('<img src="frames/960px/0000.png" id="packshot" width="960" height="640" alt="FRITZ!Box 7490" />');
        $packshot.appendTo($slide);

        // LED's off to visualize loading
        // $('<img src="images/led-2-off.png" width="39" height="101" id="led-2-off" />').appendTo($slide);
        // $('<img src="images/led-3-off.png" width="34" height="104" id="led-3-off" />').appendTo($slide);
        // $('<img src="images/led-4-off.png" width="36" height="104" id="led-4-off" />').appendTo($slide);
        // $('<img src="images/led-5-off.png" width="38" height="104" id="led-5-off" />').appendTo($slide);
        // window.setTimeout(function() {
        //     $("#led-2-off").hide();
        // }, 400);
        // window.setTimeout(function() {
        //     $("#led-3-off").hide();
        // }, 800);
        // window.setTimeout(function() {
        //     $("#led-4-off").hide();
        // }, 1200);


        this.loadAnimationImages();

        // multiple frame-offset with speed to get actual pixels
        for(var i = 0; i < this.sectionOffset.length; i++) {
            this.sectionOffset[i] = this.sectionOffset[i] * this.aniSpeed;
        }

        // the section wrapper get's a fixed position
        // all sections have absolute pos with top 0
        $("#viewport").css({
            "position": "fixed",
            "top": 0
        });
        $("section").css({
            "position": "absolute",
            "top": 0
        });



        $slide.appendTo($section);
        $section.prependTo($("#viewport"));

        // set scale for new slide as well
        this.applyZoom();

        // remove packshot-images from slides
        $("img.packshot").remove();

        // remove background from other slides, we'll use the background from the packshot-wrapper
        $(".slide").not(".packshot-slide").css("background", "transparent");

        // we need an element with the original height to re-enable scrolling
        var docHeight = this.animationData.frames.length * this.aniSpeed + this.defaultHeight;
        $("#scroll-placeholder").height(docHeight);

        // the fragment links need fixing
        var _this = this;
        $(window).on('hashchange',function() {
            _this.scrollToSection(location.hash);
        });

        $("section").hide();
        $("section#start").show();
        $("section#packshot-wrapper").show();

        // jump to section if hash is set
        if (location.hash) {
            window.setTimeout(function() {
                // give it a little time
                _this.scrollToSection(location.hash);
            }, 200);

        }

    },
    bindKeyDown: function() {
        $(document).keydown(function(e){
            if (e.keyCode == 40) {
               $('section.active').find('.arrow-next').trigger('click');
               return false;
            }
        });
    },



    scrollToSection: function(fragment) {
        var sectionName = fragment.slice(1);
        var offset;
        if (this.sectionNames.indexOf(sectionName) > -1) {
            offset = this.sectionOffset[this.sectionNames.indexOf(sectionName)];
            if (offset !== $(window).scrollTop()) {
                var _this = this;
                window.setTimeout(function() {
                    _this.slowScroll(offset)
                }, 25);
            }

        }
        // $(window).scrollTop(offset);
    },

    slowScroll: function(offset) {
        var o = $(window).scrollTop();
        if (o < offset) {
            $(window).scrollTop(o + 20);
        } else {
            $(window).scrollTop(o - 20);
        }
        if (Math.floor((offset - $(window).scrollTop()) / 20) !== 0 ) {
            var _this = this;
            window.setTimeout(function() {
                _this.slowScroll(offset)
            }, 25);
        }
        // console.log("slowScroll", offset);
    },

    // change product animation
    changeFrame: function() {
        if (this.debug) {
            $("#debug-section").text(this.animationData.frames[this.aniStep].s);
        }

        // show/hide sections
        var currentSection = this.animationData.frames[this.aniStep].s;
        if (this.lastSection !== currentSection) {

            $("#" + currentSection).show().addClass('active');

            // Update navigation
            $('nav.primary').find('li').removeClass('active');
            $('nav.primary').find('li.' + currentSection).addClass('active');

            $("#" + this.lastSection).hide().removeClass('active');
            if (!this.animationData.frames[this.aniStep].imgCss) { // reset img position
                $("#packshot").css({
                    "top": "136px"
                });
            }
        }
        this.lastSection = currentSection;

        // Opacity for header
        if ($("#" + currentSection + " header").css("opacity") !== this.animationData.frames[this.aniStep].ho ) {
            $("#" + currentSection + " header").css("opacity", this.animationData.frames[this.aniStep].ho);
        }

        // Opacity for paragraph
        if ($("#" + currentSection + " p.para").css("opacity") !== this.animationData.frames[this.aniStep].po ) {
            $("#" + currentSection + " p.para").css("opacity", this.animationData.frames[this.aniStep].po);
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
        var a = this.animationData.frames[this.aniStep].a;

        var f = this.animationData.frames[this.aniStep].f;

        var properties;
        if (a) {
            for (var e in a) {
                if (!a.hasOwnProperty(e)) {
                    continue;
                }
                properties = a[e];
                $("#" + currentSection + " " + e).css(properties);
            }
        }

        if (f) {
            for (var e in f) {
                if (!f.hasOwnProperty(e)) {
                    continue;
                }
                properties = f[e];
                $(e).css(properties);
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
                    }, 50);
                    // change the source of our placeholder image
                    $('#packshot').attr('src', aniImage.low.src);
                    $('#packshot').css({
                        "top": aniImage.top + "px",
                        "left": aniImage.left+ "px",
                        "margin-left": aniImage.marginLeft+ "px",

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
            duration: 1500,
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

    // SVG Logo, if browser can handle it
    if($("html").hasClass("svg"))  {
        $('#viewport').append('<img src="images/avm-logo.svg" class="logo-avm" width="70" height="42" alt="AVM logo">');
    } else {
        $('#viewport').append('<img src="images/logo-avm.png" class="logo-avm" width="79" height="43" alt="avm" />');
    }



    // KeyDown
    avmlp.bindKeyDown();
    // Debug
    if (window.location.search.slice(1) === "debug") {
        avmlp.debug = true;
        $("body").addClass("debug");
    }
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
        url: avmlp.aniJsonFile,
        dataType: "json",
        success: function(data) {
            if($('html').hasClass('desktop')) {
                avmlp.initScrollAnimation(data);
            }

        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Oh noes! Getting animation properties failed because: ", errorThrown);
        }
    });

    // clickable bullets in Navigation
    $(".primary li").css("cursor", "pointer");
    $(".primary li").on("click", function(e) {
        e.preventDefault();
        $('section').removeClass('active');

        var href = $(this).find("a").attr("href");
        if (href) {
            window.location = href;

            $(this).parents("ul").find("li").removeClass("active");
            $(this).addClass("active");
            avmlp.setNavigationState();
            $('' + href + '').addClass('active');

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

    $('.link-next').on('click', function(e){

        if(!$('html').hasClass('desktop')) {
            e.preventDefault();
            var obj = $(this);
            var getHref = obj.attr("href").split("#")[1];
            $('section').removeClass('active');
            $('section#' + getHref + '').addClass('active');
            $('nav.primary li').removeClass('active').next('.' + getHref + '').addClass('active');
            var offsetSize = avmlp.offsetSize;

            $(window).scrollTop($("[id*='"+getHref+"']").offset().top - offsetSize);
        }
    });




});

// resize handler
jQuery( window ).on( "resize", function() {
    avmlp.resizeSections();
});
jQuery( window ).on( "orientationchange", function( event ) {
    avmlp.applyZoom();
 });
jQuery( window ).on( "scroll", function(event) {
    if(!$('html').hasClass('desktop')) {
        avmlp.redrawDotNav();
    }

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

    if (avmlp.isAnimationReady && avmlp.aniStep !== avmlp.aniLastStep && avmlp.aniStep < avmlp.animationData.frames.length) {
        avmlp.changeFrame();
        avmlp.aniLastStep = avmlp.aniStep;
    }

    if (avmlp.debug) {
        $("#debug-animation-step").text(avmlp.aniStep);
        $("#debug-scroll-top").text(t + "px");
    }

})();



