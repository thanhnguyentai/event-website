define(['jquery', 'underscore', 'backbone', 'base/modules/animate'], function ($, _, backbone, animate) {

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
                'passwordDone': 'showVideo'
            },

            initialize: function () {
                this.videoHeight = this.$el.height();

                this.registerEvent();
            },

            registerEvent: function(){
                var isFullScreen = false;

                var exitFullscreen = function () {
                    if(document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if(document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if(document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    }
                }

                this.$el.find('video').on('ended', function(){
                    console.log('video ended');
                    if(isFullScreen){
                        exitFullscreen();
                    }
                });

                this.$el.find('video').on('webkitfullscreenchange mozfullscreenchange fullscreenchange', function(){
                    isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                });
            },

            showVideo: function() {
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
