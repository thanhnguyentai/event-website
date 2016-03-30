define(['jquery', 'underscore', 'base/modules/jitRequire', 'vendor/fastclick'],
    function ($, _, jitRequire, fastClick) {
        'use strict';
        fastClick.attach(document.body);
        jitRequire.findDeps($(document));
    });