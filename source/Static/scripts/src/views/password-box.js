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
            isFillPassword: false,
            events: {                
                'click': 'viewMainPage'
            },

            initialize: function () {
                this.registerEvent();
            },

            registerEvent: function() {
                var isCheckFillPassword = true;

                var defaultText = "Password";
                var continueText = "Continue<br/>To invitation";
                var password = "";
                var encodePassword = "";
                var _self = this;

                $('body').on('keypress', function(e){
                    if(!isCheckFillPassword)
                        return;

                    if(e.which == 13){ // enter
                        _self.$el.trigger('passwordDone');
                        _self.$el.find('span').html(continueText);
                        isCheckFillPassword = false;
                        _self.isFillPassword = true;
                    }
                    else{
                        password += String.fromCharCode(e.which);
                        encodePassword += "•";

                        _self.$el.find('span').html(encodePassword);
                    }
                });

                $('body').on('keyup', function(e){
                    if(!isCheckFillPassword)
                        return;

                    if(e.which == 8){ // backspace
                        if(password.length > 0){
                            password = password.substring(0, password.length - 1);
                            encodePassword = encodePassword.substring(0, encodePassword.length - 1);

                            _self.$el.find('span').html(encodePassword);
                            if(password.length == 0) {
                                _self.$el.find('span').html(defaultText);
                            }
                        }
                    }
                });
            },

            viewMainPage: function() {
                if(this.isFillPassword) {
                    animate(this.$el, {
                        scale: 10,
                        translateY: "0px"
                    }, { 
                        duration: 1000,
                        easing: "easeInOutSine"
                    });
                }
            }
        });
    }


    return {
        init: function (container, isCreate) {
            return init(container, isCreate);
        }
    };
});
