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
                    translateY: this.$el.find('#passwordBox').height() + 50 + "px"
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

                var videoPlayer = this.$el.find('#videoPlayer').get(0);
                videoPlayer.pause();

                this.isShowingFinalPage = true;

                var _self = this;

                var windowWidth = $(window).width();
                var boxWidth = $('#passwordBox').width();

                animate($('body'), 'scroll', { offset: 0, duration: 250, easing: "easeInOutQuad" });

                $('#passwordBox .password-text').css('display','none');
                this.$el.find('.video-content').css('opacity','0');
                this.$el.parent().find('.footer-logo').css('opacity','0');
                $('#passwordBox').addClass('final-stage');

                animate($('#passwordBox'), {
                    scale: 1.25 * Math.round(windowWidth/boxWidth),
                    translateY: "0px"
                }, { 
                    duration: 1250,
                    easing: "easeInOutSine"
                }).then(function(){
                });

                $('#finalPageContainer').css('display', 'block');
                animate($('#finalPageContainer'), "fadeIn", {
                    duration: 250,
                    easing: "easeInOutSine"
                }).then(function() {
                    /*
                    animate($('#firstPageContainer'), "fadeOut", { 
                        duration: 500,
                        easing: "easeInOutSine",
                        delay: 500
                    });
                    */
                    $('#finalPageContainer').addClass('active');
                }); 
            }
        });
    }


    return {
        init: function (container, isCreate) {
            return init(container, isCreate);
        }
    };
});
