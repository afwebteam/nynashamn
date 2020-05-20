/* global svDocReady */

svDocReady(function () {

    'use strict';

    var jq = jQuery,
        relatedFileLinks,
        accordionContainer;

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

    function addAccordionFunctions(accordionContainers) {

        jq.each(accordionContainers, function (i, e) {

            var container = jq(e),
                items = container.find('.sv-font-stor-svart, h2, h3');

            jq.each(items, function (index, elem) {
                var item = jq(elem),
                    span = jq('<span/>', {
                        class: 'af-accordionText',
                        text: 'Visa'
                    });

                item.attr('aria-expanded', false);
                item.addClass('af-closed');
                item.append(span);

                item.on('click', function (e) {
                    var target = jq(e.target),
                        content = target.next('.normal'),
                        text = target.find('.af-accordionText'),
                        isExpanded = (item.attr('aria-expanded') === 'true');

                    if (isExpanded) {
                        item.attr('aria-expanded', false);
                        content.hide();
                        item.removeClass('af-open');
                        text.text('Visa');
                    } else {
                        item.attr('aria-expanded', true);
                        item.addClass('af-open');
                        content.show();
                        text.text('Dölj');
                    }

                });
            });
        });
    }

    relatedFileLinks = jq('.af-related-information a[href*="/download/"]');
    accordionContainer = jq('.sv-decoration-generell-dragspel');

    try {
        addFileInfoToFiles(relatedFileLinks);
    } catch (e) { }

    try {
        addAccordionFunctions(accordionContainer);
    } catch (e) { }

});

