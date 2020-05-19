/* global svDocReady */

svDocReady(function () {

    'use strict';

    var jq = jQuery;

    jq('.sv-text-portlet.af-searchIcon').on('click', function (e) {
        jq('.af-hiddenSearchForm').toggle();
    });

    // Link whole puff...
    jq('.af-popularShortcuts--item').on('click', function (e) {

        var target = jq(e.target),
            link,
            url;

        if (!target.is('.af-popularShortcuts--item')) {
            target = target.closest('.af-popularShortcuts--item');
        }

        link = target.find('a');
        url = link.prop('href');
        document.location.href = url;
    });
});

