/* global svDocReady, afQuery, afStartAtHit, afSearchTerm */

var AF = AF || {};

svDocReady(function () {

    'use strict';

    var jq = jQuery,
        relatedFileLinks,
        accordionContainer,
        mql = window.matchMedia('screen and (max-width: 880px)'),
        isMobile;

    AF.isEmptyString = function (aString) {

        if (!aString || aString === '') {
            return true;
        }

        return false;
    };

    AF.isMobileView = function () {
        return isMobile;
    };

    AF.setIsMobileView = function (anIsMobile) {
        isMobile = anIsMobile;
    };

    function mediaQueryChecker(aMql) {
        AF.setIsMobileView(aMql.matches);
    }

    AF.setIsMobileView(mql.matches);
    mql.addListener(mediaQueryChecker);

    jq('.sv-text-portlet.af-searchIcon').on('click', function (e) {

        var target = jq(e.target),
            field = jq('.sv-searchform-portlet .af-textInputField'),
            form = field.closest('form'),
            hiddenSearchForm,
            hiddenSearchFormField;

        e.preventDefault();
        target.toggleClass('active');

        if (field && field.length > 0) {
            if (AF.isMobileView()) {
                hiddenSearchForm = jq('.af-hiddenSearchForm');
                hiddenSearchFormField = hiddenSearchForm.find('input[name="query"]');

                //hiddenSearchForm.toggle();
                hiddenSearchForm.slideToggle();
                hiddenSearchFormField.focus();
            } else {

                form.addClass('af-upscale');
                setTimeout(function () {
                    form.removeClass('af-upscale');
                }, 200);

                field.focus();
            }

        } else {
            hiddenSearchForm = jq('.af-hiddenSearchForm');
            hiddenSearchFormField = hiddenSearchForm.find('input[name="query"]');

            //hiddenSearchForm.toggle();
            hiddenSearchForm.slideToggle();
            hiddenSearchFormField.focus();

        }
    });

    // Link whole puff...
    jq('.af-startpage-current .sv-channel-item').on('click', function (e) {

        var target = jq(e.target),
            link,
            url;

        if (!target.is('.sv-channel-item')) {
            target = target.closest('.sv-channel-item');
        }

        link = target.find('a');
        url = link.prop('href');
        document.location.href = url;

    });

    jq('.sv-decoration-generell-bla-knapp--external, .sv-decoration-generell-bla-knapp--intern').hover(function (e) {
        var target = jq(e.target);

        target.css('cursor', 'pointer');

    }, function () { });

    jq('.sv-decoration-generell-bla-knapp--external, .sv-decoration-generell-bla-knapp--intern').on('click', function (e) {
        var target = jq(e.target),
            possibleLink = target.find('a'),
            href;

        if (possibleLink && possibleLink.length > 0) {
            href = possibleLink.prop('href');
            document.location.href = href;
        }
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
                        content,
                        text,
                        isExpanded;

                    if (target.is('.af-accordionText')) {
                        target = target.closest('p');
                    }

                    content = target.next('.normal');
                    text = target.find('.af-accordionText');
                    isExpanded = (item.attr('aria-expanded') === 'true');

                    if (isExpanded) {
                        item.attr('aria-expanded', false);
                        content.slideUp();
                        item.removeClass('af-open');
                        text.text('Visa');
                    } else {
                        item.attr('aria-expanded', true);
                        item.addClass('af-open');
                        content.slideDown();
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

    jq('.sv-search-facets-header').on('click', function (e) {
        var target = jq(e.target),
            facets = jq('.sv-search-facet-backgroundColor'),
            text = target.find('.af-accordionText'),
            isExpanded;

        if (!target.is('.sv-search-facets-header')) {
            target = target.closest('.sv-search-facets-header');
        }

        isExpanded = (target.attr('aria-expanded') === 'true');

        if (isExpanded) {
            target.attr('aria-expanded', false);
            facets.hide();
            target.removeClass('af-open');
            text.text('Visa');
        } else {
            target.attr('aria-expanded', true);
            target.addClass('af-open');
            facets.show();
            text.text('Dölj');
        }
    });

    jq('.af-MobileMenu').on('click', function (e) {

        var target = jq(e.target),
            tabs = jq('.af-mobileTabs'),
            theMenu = jq('.af-mobileMainMenu'),
            activeMenuItem,
            allLists,
            allItems;

        if (target.is('p')) {
            target = target.closest('.af-MobileMenu');
        }

        activeMenuItem = theMenu.find('.activeMenuItem');

        if (activeMenuItem && activeMenuItem.length > 0) {
            allLists = activeMenuItem.parents('ul');
            allItems = activeMenuItem.parents('li');

            jq.each(allLists, function (i, e) {
                var menu = jq(e);
                if (!menu.is('.af-mobileMainMenu')) {
                    menu.css('display', 'block');
                }
            });

            jq.each(allItems, function (i, e) {
                var item = jq(e);
                item.addClass('open');
            });
        }

        //theMenu.toggle();
        theMenu.slideToggle();
        tabs.toggle();
        target.toggleClass('af-MobileMenu--active');
    });

    // Mobile menu
    jq('.af-menuIcon').on('click', function (e) {

        var target = jq(e.target),
            container = target.closest('li'),
            sublevel = container.find('ul').first();

        container.toggleClass('open');
        sublevel.toggle();
    });

    jq('.sv-decoration-generell-kommentarer p.sv-font-sidfot-rubrik').on('click', function (e) {
        jq('.af-commentOfPageDialog').envDialog('toggle');
    });

    // Feedback form
    jq('.af-commentOfPageDialog .af-feedbackSubmit').on('click', function (e) {

        var target = jq(e.target),
            container = target.closest('.env-modal-dialog__content'),
            form = container.find('form'),
            inputs = container.find('input, textarea'),
            actionURL = form.prop('action'),
            actionMethod = form.prop('method'),
            valid = true,

            name, mail, message, spam;

        container.find('.env-form-element--danger').removeClass('env-form-element--danger');
        jq.each(inputs, function (i, e) {
            var input = jq(e),
                inputValue = input.val();

            if (input.is('textarea')) {

                if (AF.isEmptyString(inputValue)) {
                    valid = false;
                    input.closest('.env-form-element').addClass('env-form-element--danger');
                } else {
                    message = inputValue;
                }

            } else if (input.prop('name') === 'name2' && inputValue !== '') {
                // Probably spam robot
                valid = false;
                spam = inputValue;
            } else if (input.prop('name') === 'name') {
                name = inputValue;
            } else if (input.prop('name') === 'mail') {
                mail = inputValue;
            }
        });

        if (valid) {
            jq.ajax({
                url: actionURL,
                method: actionMethod,
                data: {
                    spam: spam,
                    name: name,
                    mail: mail,
                    message: message,
                    ajax: true
                },
                success: function (data) {
                    if (data && data.indexOf('success') > -1) {
                        jq('.af-commentOfPageDialog').envDialog('hide');
                    }
                }
            });
        }
    });

    // Link the whole area on the function links at the top of the page
    jq('header .af-center img.sv-svg').each(function (index, item) {

        var img = jq(item),
            imgPortlet = img.closest('.sv-image-portlet'),
            textImgContainer = imgPortlet.closest('.af-center'),
            a = imgPortlet.find('a'),
            link;

        if (a && a.prop('href')) {
            link = a.prop('href');

            if (link) {

                textImgContainer.hover(function () {
                    textImgContainer.css('cursor', 'pointer');
                }, function () {

                });

                textImgContainer.on('click', function (e) {

                    e.preventDefault();

                    if (link.indexOf('#Kontaktcenter') > 0) {
                        jq('html, body').animate({ scrollTop: jq('#Kontaktcenter').offset().top }, 800);

                        //jq('#Kontaktcenter').get(0).scrollIntoView();
                    } else {
                        document.location.href = link;
                    }
                });
            }
        }
    });

    // Search
    function getParameterValue(anURL, aParameter) {

        var url = new URL(anURL),
            value = url.searchParams.get(aParameter);

        return value;
    }

    function replaceUrlParam(url, paramName, paramValue) {
        if (paramValue == null) {
            paramValue = '';
        }
        var pattern = new RegExp('\\b(' + paramName + '=).*?(&|#|$)');
        if (url.search(pattern) >= 0) {
            return url.replace(pattern, '$1' + paramValue + '$2');
        }
        url = url.replace(/[?#]$/, '');
        return url + (url.indexOf('?') > 0 ? '&' : '?') + paramName + '=' + paramValue;
    }

    jq('.af-hideWithJS').css('display', 'none');
    jq('.af-loadMoreSearchResult a').on('click', function (e) {

        var target = jq(e.target),
            loadMoreURL = target.prop('href'),
            completeLoadMoreURL = loadMoreURL + afQuery;

        e.preventDefault();

        if (!afStartAtHit && !afSearchTerm) {
            afStartAtHit = getParameterValue(completeLoadMoreURL, 'startAtHit');
            afSearchTerm = getParameterValue(completeLoadMoreURL, 'query');
        } else {
            afStartAtHit = parseInt(afStartAtHit) + 10;
            completeLoadMoreURL = replaceUrlParam(completeLoadMoreURL, 'startAtHit', afStartAtHit);
        }

        jq.ajax({
            url: completeLoadMoreURL,
            dataType: 'html',
            success: function (data) {

                var resultList = jq('.sv-search-result'),
                    dataAsHtml = jq(data),
                    newHits;

                if (dataAsHtml) {
                    newHits = dataAsHtml.find('.sv-search-hit');

                    jq.each(newHits, function (index, hit) {
                        resultList.append(hit);
                    });

                    if (newHits.length < 10) {
                        jq('.af-loadMoreSearchResult').remove();
                    }
                } else {
                    jq('.af-loadMoreSearchResult').remove();
                }
            }
        });
    });

    jq('.sv-searchform-portlet .af-textInputField').on('focus', function (e) {

        var target = jq(e.target),
            div = target.closest('div');

        div.addClass('af-rotate');
        setTimeout(function () {
            div.removeClass('af-rotate');
        }, 500);
    });

    // Current filter
    jq('.af-currentFilter .af-accordionText').on('click', function (e) {

        var target = jq(e.target),
            pElem = target.closest('p'),
            isExpanded = (pElem.attr('aria-expanded') === 'true'),
            content = jq('.af-currentFilter--dateFilter--inner');

        if (isExpanded) {
            content.slideUp(200);
            pElem.attr('aria-expanded', false);
            pElem.removeClass('af-open');
        } else {
            content.slideDown(200);
            pElem.attr('aria-expanded', true);
            pElem.addClass('af-open');
        }
    });

    function loopAreas(anUL, anValue, setActive) {

        jq.each(anUL.find('li'), function (index, elem) {

            var target = jq(elem).find('a'),
                targetText = target.text();

            if (targetText === anValue) {

                if (setActive) {
                    target.addClass('active');
                } else {
                    target.removeClass('active');
                }
            }

        });
    }

    jq('.af-currentFilter .af-currentFilter--result--area a').on('click', function (e) {

        var target = jq(e.target),
            isActive = target.hasClass('active'),
            portletURL = target.data('portleturl'),
            paramValue = target.text(),
            resultTarget = jq('.af-currentFilter--result ul'),

            topAreaFilter = jq('ul.af-currentFilter--areas');

        e.preventDefault();

        if (isActive) {
            target.removeClass('active');

            jq.ajax({
                url: portletURL,
                data: {
                    omrade: ''
                },
                dataType: 'html',
                success: function (data) {
                    resultTarget.html(data);
                    /*
                    resultTarget.slideUp('slow', function () {
                        resultTarget.html(data);
                        resultTarget.slideDown('slow');
                    });
                    */

                    loopAreas(topAreaFilter, '', false);
                }
            });
        } else {
            target.addClass('active');

            jq.ajax({
                url: portletURL,
                data: {
                    omrade: paramValue
                },
                dataType: 'html',
                success: function (data) {
                    resultTarget.html(data);
                    /*
                    resultTarget.slideUp('slow', function () {
                        resultTarget.html(data);
                        resultTarget.slideDown('slow');
                    });
                    */

                    loopAreas(topAreaFilter, paramValue, true);
                }
            });
        }

    });

    jq('.af-currentFilter .af-currentFilter--areas a').on('click', function (e) {

        var target = jq(e.target),
            isActive = target.hasClass('active'),
            portletURL = target.data('portleturl'),
            paramValue = target.text(),
            resultTarget = jq('.af-currentFilter--result ul');

        e.preventDefault();

        if (isActive) {
            target.removeClass('active');

            jq.ajax({
                url: portletURL,
                data: {
                    omrade: ''
                },
                dataType: 'html',
                success: function (data) {

                    resultTarget.html(data);
                    /*
                    resultTarget.slideUp('slow', function () {
                        resultTarget.html(data);
                        resultTarget.slideDown('slow');
                    });
                    */
                }
            });
        } else {
            jq('.af-currentFilter--areas .active').removeClass('active');
            target.addClass('active');
            jq.ajax({
                url: portletURL,
                data: {
                    omrade: paramValue
                },
                dataType: 'html',
                success: function (data) {

                    resultTarget.html(data);

                    /*
                    resultTarget.slideUp('slow', function () {
                        resultTarget.html(data);
                        resultTarget.slideDown('slow');
                    });
                    */
                }
            });
        }
    });

    jq('.af-currentFilter--dateFilter--inner--year--title').on('click', function (e) {

        var target = jq(e.target),
            list = jq('.af-currentFilter--dateFilter--inner--year--list'),
            isExpanded = (list.attr('aria-expanded') === 'true');

        if (isExpanded) {
            list.slideUp();
            target.removeClass('af-open');
            list.attr('aria-expanded', false);
        } else {
            list.slideDown();
            target.addClass('af-open');
            list.attr('aria-expanded', true);
        }

    });

    jq('.af-currentFilter--dateFilter--inner--month--title').on('click', function (e) {
        var target = jq(e.target),
            list = jq('.af-currentFilter--dateFilter--inner--month--list'),
            isExpanded = (list.attr('aria-expanded') === 'true');

        if (isExpanded) {
            list.slideUp();
            target.removeClass('af-open');
            list.attr('aria-expanded', false);
        } else {
            list.css('display', 'flex').slideDown();
            target.addClass('af-open');
            list.attr('aria-expanded', true);
        }
    });

    jq('.af-currentFilter--dateFilter--inner--year--listItem a').on('click', function (e) {

        var target = jq(e.target),
            list = target.closest('ul'),
            value = target.text(),
            monthValue = jq('.af-currentFilter--dateFilter--inner--month--list .active'),
            allNews = jq('.af-currentFilter--result li');

        e.preventDefault();
        jq('.af-currentFilter--dateFilter--inner--year--listItem .active').removeClass('active');
        target.addClass('active');

        if (monthValue && monthValue.length > 0) {
            monthValue = monthValue.data('monthvalue');
        } else {
            monthValue = null;
        }

        jq.each(allNews, function (index, elem) {
            var theElem = jq(elem),
                yearData = theElem.data('year'),
                monthData = theElem.data('month');

            if (yearData === parseInt(value)) {

                if (monthValue) {

                    if (monthValue === monthData) {
                        theElem.show();
                    } else {
                        theElem.hide();
                    }

                } else {
                    theElem.show();
                }
            } else {
                theElem.hide();
            }
        });

        jq('.af-currentFilter--dateFilter--inner--year--title.af-open').removeClass('af-open');
        list.slideUp();
    });

    jq('.af-currentFilter--dateFilter--inner--month--list').on('click', function (e) {

        var target = jq(e.target),
            list = target.closest('ul'),
            value = target.data('monthvalue'),
            yearValue = jq('.af-currentFilter--dateFilter--inner--year--listItem .active'),
            allNews = jq('.af-currentFilter--result li');

        e.preventDefault();
        jq('.af-currentFilter--dateFilter--inner--month--list .active').removeClass('active');
        target.addClass('active');

        if (yearValue && yearValue.length > 0) {
            yearValue = yearValue.text();
        } else {
            yearValue = null;
        }

        jq.each(allNews, function (index, elem) {
            var theElem = jq(elem),
                yearData = theElem.data('year'),
                monthData = theElem.data('month');

            if (monthData === value) {

                if (yearValue) {

                    if (yearData === parseInt(yearValue)) {
                        theElem.show();
                    } else {
                        theElem.hide();
                    }

                } else {
                    theElem.show();
                }
            } else {
                theElem.hide();
            }
        });

        jq('.af-currentFilter--dateFilter--inner--month--title.af-open').removeClass('af-open');
        list.slideUp();
    });

    jq('.af-currentFilter--dateFilter--inner--clear a').on('click', function (e) {

        var allNews = jq('.af-currentFilter--result li');

        e.preventDefault();

        jq('.af-currentFilter--dateFilter--inner--month--list .active').removeClass('active');
        jq('.af-currentFilter--dateFilter--inner--year--listItem .active').removeClass('active');

        jq.each(allNews, function (index, elem) {
            var theElem = jq(elem);

            theElem.show();
        });
    });

    // Important message
    jq('.af-importantMessage--hide').on('click', function (e) {

        var target = jq(e.target),
            importantMessageContainer = jq('.af-importantMessage'),
            isSmall = importantMessageContainer.hasClass('af-smallMessage');

        if (isSmall) {
            target.addClass('af-open');
            target.text('Dölj');
            importantMessageContainer.removeClass('af-smallMessage');
        } else {
            target.removeClass('af-open');
            target.text('Visa');
            importantMessageContainer.addClass('af-smallMessage');
        }

        console.log('flfds');
    });
});