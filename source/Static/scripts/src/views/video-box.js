define(['jquery', 'underscore', 'backbone', 'base/modules/animate', 'base/modules/screenFull'], function ($, _, backbone, animate, screenFull) {

    'use strict';

    function init(container, isCreate) {
        var backboneView = backboneInit();
        if (isCreate)
            return new backboneView({
                el: container
            });
        else
            return backboneView;

    }

    function backboneInit() {
        return Backbone.View.extend({
            events: {      
                'passwordDone': 'showVideo',
                'clickPasswordBox': 'showFinalPage'
            },

            initialize: function () {
                this.videoHeight = this.$el.height();
                this.registerEvent();

                var windowHeight = $(window).height();
                var passwordBox = this.$el.find('#passwordBox').eq(0);
                var footerLogo = this.$el.parent().find('.footer-logo').eq(0);
                var footerTop = windowHeight - 70 - (footerLogo.offset().top + footerLogo.height());
                if(footerLogo.offset().top + footerTop < passwordBox.offset().top + passwordBox.height()){
                    footerTop = 0;
                }

                footerLogo.css({
                    opacity : 1,
                    top: footerTop
                });

                this.footerTop = footerTop;
            },

            registerEvent: function(){
                var _self = this;
                this.$el.find('video').on('ended', function(){
                    if(screenFull.isFullscreen){
                        screenFull.exit();
                    }

                    var timeout = setTimeout(function() {
                        clearTimeout(timeout);
                        _self.showFinalPage();
                    }, 1000);
                });
            },

            showVideo: function() {
                var _self = this;

                this.$el.addClass('active');

                animate(this.$el.find('#passwordBox'), {
                    translateY: this.videoHeight / 2 + this.$el.find('#passwordBox').height() / 2 + 50 + "px"
                }, { 
                    duration: 750,
                    easing: "easeInOutSine"
                });

                animate(this.$el.parent().find('.footer-logo'), {
                    translateY: this.$el.find('#passwordBox').height() + 50 - this.footerTop + "px"
                }, { 
                    duration: 750,
                    easing: "easeInOutSine"
                }).then(function(){
                    var videoPlayer = _self.$el.find('#videoPlayer').get(0);
                    videoPlayer.play();
                });
            },

            showFinalPage: function() {
                if(this.isShowingFinalPage)
                    return;
                
                $('#finalPageContainer').css('display', 'block');
                var videoPlayer = this.$el.find('#videoPlayer').get(0);
                videoPlayer.pause();
                this.isShowingFinalPage = true;

                var _self = this;

                setTimeout(function(){
                    var firstPage = $('#firstPageContainer');
                    var finalPage = $('#finalPageContainer');
                    var finalPageLong = finalPage.height();

                    var deltaOffset = firstPage.offset().top - finalPage.offset().top;
                    var positionOfBoxWithFinalPage = deltaOffset + firstPage.height()/2;
                    var targetTranslate = finalPageLong/2 - positionOfBoxWithFinalPage;

                    var windowWidth = $(window).width();
                    var windowHeight = $(window).height();
                    var finalWidth = windowWidth > windowHeight ? windowWidth : windowHeight;
                    if(finalWidth < finalPageLong)
                        finalWidth = finalPageLong;

                    var boxWidth = $('#passwordBox').width();

                    animate($('body'), 'scroll', { offset: 0, duration: 250, easing: "easeInOutQuad" });

                    $('#passwordBox .password-text').css('display','none');
                    _self.$el.find('.video-content').css('opacity','0');
                    _self.$el.parent().find('.footer-logo').css('opacity','0');
                    $('#passwordBox').addClass('final-stage');

                    animate($('#passwordBox'), {
                        scale: 1.3 * Math.round(finalWidth/boxWidth),
                        translateY: targetTranslate + "px"
                    }, { 
                        duration: 1250,
                        easing: "easeInOutSine"
                    }).then(function(){
                    });

                    animate($('#finalPageContainer'), "fadeIn", {
                        duration: 250,
                        easing: "easeInOutSine"
                    }).then(function() {
                        $('#finalPageContainer').addClass('active');
                    }); 
                }, 100);
            }
        });
    }


    return {
        init: function (container, isCreate) {
            return init(container, isCreate);
        }
    };
});
