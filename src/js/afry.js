/* global svDocReady */

svDocReady(function () {

    'use strict';

    var jq = jQuery,
        relatedFileLinks;

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

    function addFileInfoToFiles(aCollection) {

        jq.each(aCollection, function (i, e) {

            var target = jq(e),
                title = target.attr('title'),
                currentText = target.text(),
                newText;

            newText = currentText + ' (' + title + ')';
            target.text(newText);
        });
    }

    relatedFileLinks = jq('.af-related-information a[href*="/download/"]');
    addFileInfoToFiles(relatedFileLinks);
});

