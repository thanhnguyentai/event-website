define(['jquery', 'underscore', 'backbone', 'base/modules/animate', 'base/modules/screenFull', 'base/modules/video_youtube_module', 'base/modules/eventDispatcher'], function ($, _, backbone, animate, screenFull, videoModule, eventDispatcher) {

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
                this.localDispatcher = eventDispatcher();
                this.videoId = this.getYoutubeId(this.$el.find('.video-content').attr('data-video'));
                this.listenTo(this.localDispatcher, 'stateChange.Video', this.stateChange);

                this.videoHeight = this.$el.height();
                //this.registerEvent();

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

            getYoutubeId: function (url) {

                var id = '';

                url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);

                if (url[2] !== undefined) {
                    id = url[2].split(/[^0-9a-z_\-]/i);
                    id = id[0];
                }
                else {
                    id = url;
                }

                return id;
            },

            stateChange: function(evt, arg){
                if(evt && evt == "ended") {
                    if(screenFull.isFullscreen){
                        screenFull.exit();
                    }

                    var _self = this;

                    var timeout = setTimeout(function() {
                        clearTimeout(timeout);
                        _self.showFinalPage();
                    }, 1000);
                }
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
                    _self.$el.addClass('active');
                    _self.showVideoYoutube();
                    setTimeout(function(){
                        //var videoPlayer = _self.$el.find('#videoPlayer').get(0);
                        //videoPlayer.play();
                    }, 500);
                });
            },

            showVideoYoutube: function() {
                videoModule.then(_.bind(this.loadVideo, this));
            },

            loadVideo: function(api) {
                this.$playerContainer = $('<div class="video-youtube-container"></div>');
                this.$el.find('.video-content').eq(0).append(this.$playerContainer);

                return api.create(this.$playerContainer.get(0), {
                    height: '100%',
                    width: '100%',
                    videoId: this.videoId
                }, this.localDispatcher).then(_.bind(this.ready, this));
            },

            ready: function(player) {
                this.player = player;
            },

            showFinalPage: function() {
                if(this.isShowingFinalPage)
                    return;
                
                $('#finalPageContainer').css('display', 'block');
                //var videoPlayer = this.$el.find('#videoPlayer').get(0);
                //videoPlayer.pause();
                if(this.player) {
                    this.player.base.pauseVideo();
                }
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

                    // Calculate scale value for box border shadow
                    var scale = 1.3 * Math.round(finalWidth/boxWidth); 
                    var widthShadowAfterScale = scale * (_self.$el.find('.box-border').width() - 2);
                    var targetWidthShadowAfterScale = scale * _self.$el.find('.box-border').width() - 4;

                    animate($('#passwordBox'), {
                        scale: scale,
                        translateY: targetTranslate + "px"
                    }, { 
                        duration: 1250,
                        easing: "easeInOutSine"
                    });

                    animate(_self.$el.find('.box-border__shadow'), {
                        scale: targetWidthShadowAfterScale/widthShadowAfterScale
                    }, { 
                        duration: 1250,
                        easing: "easeInOutSine"
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
