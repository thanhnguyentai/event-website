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
                var _self = this;

                this.$el.find('.password-input').focus();
                this.$el.find('.password-input').on('keypress', function(e){
                    e.stopPropagation();

                    if(e.which == 13){ // enter
                        var password = $(this).val();
                        if(password.length > 0){
                            $(this).blur();
                            _self.completeFillPassword();
                        }
                    }
                });

                this.$el.find('.password-input').on('keyup', function(e){
                    e.stopPropagation();
                });

                $('body').on('keypress', function(e){
                    if(!_self.isFillPassword) {
                        var currentPass = _self.$el.find('.password-input').val();
                        var newPass = currentPass + String.fromCharCode(e.which)
                        _self.$el.find('.password-input').val(newPass);

                        if(e.which == 13) {
                            var currentPass = _self.$el.find('.password-input').val();
                            if(currentPass.length > 0){
                                _self.completeFillPassword();
                            }
                        }
                    }
                    else{
                        $(this).off('keypress');
                    }
                });

                $('body').on('keyup', function(e){
                    if(!_self.isFillPassword) {
                        if(e.which == 8){ // backspace
                            var currentPass = _self.$el.find('.password-input').val();
                            if(currentPass.length > 0){
                                currentPass = currentPass.substring(0, currentPass.length - 1);
                                _self.$el.find('.password-input').val(currentPass);
                            }
                        }
                    }
                    else {
                        $(this).off('keyup');
                    }
                });
            },

            completeFillPassword: function(){
                this.$el.trigger('passwordDone');
                this.isFillPassword = true;
                this.$el.addClass('active');
            },

            viewMainPage: function() {
                if(this.isFillPassword) {
                    this.$el.trigger('clickPasswordBox');
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
