/* global svDocReady, afQuery, afStartAtHit, afSearchTerm */

var AF = AF || {};

svDocReady(function () {

    'use strict';

    var jq = jQuery,
        relatedFileLinks,
        accordionContainer,
        mql = window.matchMedia('screen and (max-width: 880px)'),
        isMobile,
        afPublishedDate;

    AF.hideElemsAfterLoad = function () {
        jq('.af-findSchool-row--filter-areas').hide();
        jq('.af-findSchool-row--filter-productions').hide();
        jq('.af-findSchool-row--filter-forms').hide();
        //jq('.af-uppleva-events-filter-categories').hide();
    };

    AF.removeAttribute = function (anElem, anAttribute) {

        var attr = jq(anElem).attr(anAttribute);

        if (typeof attr !== typeof undefined && attr !== false) {
            jq(anElem).removeAttr(anAttribute);
        }
    };

    AF.isEmptyString = function (aString) {

        if (!aString || aString === '') {
            return true;
        }

        return false;
    };

    AF.updateSearchResult = function () {

        var eserviceContainer = jq('.af-eservicesResult-container'),
            amountServices = eserviceContainer.find('li'),
            theLength;

        if (amountServices && amountServices.length) {
            theLength = amountServices.length;
        } else {
            theLength = 0;
        }

        if (theLength === 0) {
            eserviceContainer.hide();
        } else {
            eserviceContainer.show();
        }
    };

    AF.isMobileView = function () {
        return isMobile;
    };

    AF.setIsMobileView = function (anIsMobile) {
        isMobile = anIsMobile;
    };

    AF.changeStandardSVIcons = function () {
        // Change all standard sitevision file icons
        jq('.sv-linkicon').each(function (index, elem) {
            var theElem = jq(elem),
                title = theElem.prop('title'),
                container;

            if (title && title === 'PDF') {
                container = theElem.closest('ul');

                if (!container || container.length === 0) {
                    container = theElem.closest('p.normal');
                }

                if (container && container.length > 0) {
                    theElem.after('<span style="margin-left: 30px;font-size: 13px;">( PDF )</span>');
                }

            }

            theElem.prop('src', '/images/18.d9ec095172e6db963754cee/1596632006892/filer.svg');
        });
    };

    AF.debugElementSize = function () {

        var docWidth = document.documentElement.offsetWidth;

        [].forEach.call(
            document.querySelectorAll('*'),
            function (el) {
                if (el.offsetWidth > docWidth) {
                    console.log(el);
                    alert(el);
                }
            }
        );
    };

    // If useMonth amount month will be used, else amount days
    function monthDiff(dateFrom, dateTo) {
        return dateTo.getMonth() - dateFrom.getMonth() +
            (12 * (dateTo.getFullYear() - dateFrom.getFullYear()));
    }

    function addDateInfo(anElem) {

        anElem.append(
            jq('<span/>', {
                text: ' ',
                class: 'af-oldArticle-before'
            })
        );

        anElem.append(
            jq('<span/>', {
                text: 'Artikeln är äldre än tre månader',
                class: 'af-oldArticle'
            })
        );
    }

    AF.isOldArticleSingleElem = function (anElem, useMonth, amount) {

        var target = jq(anElem),
            year = target.data('year'),
            month = target.data('month'),
            day = target.data('day'),
            dateObj = new Date(year, month - 1, day),
            now = new Date(),
            diffTime,
            diffDays,
            diffMonths;

        if (!anElem || !amount) {
            return;
        }

        diffTime = Math.abs(now - dateObj);
        diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        diffMonths = monthDiff(dateObj, now);

        if (useMonth && diffMonths >= amount) {
            addDateInfo(target);
        } else if (!useMonth && diffDays >= amount) {
            addDateInfo(target);
        }

    };

    AF.isOldArticle = function (aContainer, amount, useMonth, aTargetClass) {

        var container = jq(aContainer),
            children = container.find('li'),
            now = new Date();

        if (!aContainer || !amount) {
            return;
        }

        jq.each(children, function (index, elem) {

            var target = jq(elem),
                targetText = target.find('.' + aTargetClass),
                year = target.data('year'),
                month = target.data('month'),
                day = target.data('day'),
                dateObj = new Date(year, month - 1, day),
                diffTime,
                diffDays,
                diffMonths;

            diffTime = Math.abs(now - dateObj);
            diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            diffMonths = monthDiff(dateObj, now);

            if (useMonth && diffMonths >= amount) {
                addDateInfo(targetText);
            } else if (!useMonth && diffDays >= amount) {
                addDateInfo(targetText);
            }
        });
    };

    AF.preventBouncingEffect = function () {
        document.ontouchmove = function (event) {
            event.preventDefault();
        };
    };

    AF.preventBouncingEffect();

    AF.isOldArticle('.af-currentFilter .af-currentFilter--result ul', 3, true, 'af-currentFilter--result--pubDate');

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

        // Do not run in edit mode...
        var location = document.location.href;

        if (location.indexOf('/edit/') > -1) {
            return;
        }

        jq.each(accordionContainers, function (i, e) {

            var container = jq(e),
                items = container.find('h2'),
                h3s = container.find('h3.subheading3');

            jq.each(items, function (index, elem) {
                var
                    item = jq(elem),
                    span = jq('<span/>', {
                        class: 'af-accordionText',
                        text: 'Visa'
                    });

                item.attr('aria-expanded', false);
                item.addClass('af-closed');
                item.append(span);

                item.on('click', function (e) {
                    var target = jq(e.target),
                        itemContainer = target.closest('.sv-text-portlet'),
                        content,
                        text,
                        isExpanded,
                        h3s,
                        h3,
                        h3Siblings;

                    if (target.is('.af-accordionText')) {
                        target = target.closest('.af-closed');
                    }

                    content = itemContainer.next('div');
                    h3s = content.find('h3.subheading3');
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

            if (h3s && h3s.length > 0) {

                jq.each(h3s, function (i, e) {

                    var
                        item = jq(e),
                        span = jq('<span/>', {
                            class: 'af-accordionText',
                            text: 'Visa'
                        }),
                        h3Siblings = item.nextUntil('h3.subheading3');

                    item.attr('aria-expanded', false);
                    item.addClass('af-closed');
                    item.append(span);

                    item.on('click', function (e) {

                        var target = jq(e.target),
                            content,
                            container,
                            text,
                            isExpanded;

                        if (target.is('.af-accordionText')) {
                            target = target.closest('.af-closed');
                        }

                        container = target.closest('div.sv-text-portlet');
                        content = container.next('div.sv-layout');
                        text = target.find('.af-accordionText');
                        isExpanded = (item.attr('aria-expanded') === 'true');

                        content.addClass('boxStyle');

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

                    jq.each(h3Siblings, function (j, f) {
                        var sib = jq(f);
                        sib.addClass('boxStyle');
                    });
                });
            }
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

    jq('.sv-facetedsearch-portlet').on('click', '.sv-search-facets-header', function (e) {
        var target = jq(e.target),
            facets = jq('.sv-search-facet-backgroundColor'),
            text,
            isExpanded;

        if (!target.is('.sv-search-facets-header')) {
            target = target.closest('.sv-search-facets-header');
        }

        text = target.find('.af-accordionText');

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
                var menu = jq(e),
                    siblings;

                // Get all siblings
                if (i === 1) {
                    siblings = menu.siblings('ul');

                    jq.each(siblings, function (i, e) {

                        var sibling = jq(e);

                        if (!sibling.is('.af-mobileMainMenu')) {
                            sibling.css('display', 'block');
                        }

                    });
                }

                if (!menu.is('.af-mobileMainMenu')) {
                    menu.css('display', 'block');
                }
            });

            jq.each(allItems, function (i, e) {
                var item = jq(e);

                if (i > 0) {
                    item.addClass('open');
                }
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
            sublevel = container.find('> ul');

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
            p = textImgContainer.find('.sv-font-liten-morkgra'),
            a = imgPortlet.find('a'),
            link;

        if (a && a.prop('href')) {
            link = a.prop('href');

            if (link) {

                textImgContainer.hover(function () {
                    textImgContainer.css('cursor', 'pointer');
                    p.css('text-decoration', 'underline');
                }, function () {
                    p.css('text-decoration', 'none');
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
            completeLoadMoreURL = loadMoreURL + afQuery,
            resultList = jq('.sv-search-result'),
            scrollPosition = resultList.find('li').last().offset().top;

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

                var
                    dataAsHtml = jq(data),
                    newHits;

                if (dataAsHtml) {
                    newHits = dataAsHtml.find('.sv-search-hit');

                    jq.each(newHits, function (index, hit) {
                        resultList.append(hit);
                    });

                    jq(window).scrollTop(scrollPosition);

                    if (newHits.length < 10) {
                        jq('.af-loadMoreSearchResult').remove();
                    }

                    AF.changeStandardSVIcons();
                } else {
                    jq('.af-loadMoreSearchResult').remove();
                }
            }
        });
    });

    jq('.sv-searchform-portlet .af-textInputField').on('focus', function (e) {

        var target = jq(e.target),
            submit = target.next('button');

        submit.addClass('af-rotate');
        setTimeout(function () {
            submit.removeClass('af-rotate');
        }, 500);
    });

    // Current filter
    jq('.af-currentFilter .af-currentFilter--dateFilter .sv-font-stor-svart').on('click', function (e) {

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
            resultTarget = jq('.af-currentFilter--result ul'),
            allAreasElem,
            allAreas = [];

        e.preventDefault();

        if (isActive) {
            target.removeClass('active');

            allAreasElem = jq('.af-currentFilter .af-currentFilter--areas .active');
            jq.each(allAreasElem, function (index, elem) {
                allAreas.push(jq(elem).text());
            });

            jq.ajax({
                url: portletURL,
                data: {
                    omrade: (allAreas.length > 0 ? allAreas : '')
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
            //jq('.af-currentFilter--areas .active').removeClass('active');
            target.addClass('active');

            allAreasElem = jq('.af-currentFilter .af-currentFilter--areas .active');
            jq.each(allAreasElem, function (index, elem) {
                allAreas.push(jq(elem).text());
            });

            jq.ajax({
                url: portletURL,
                data: {
                    omrade: allAreas
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
            allNews = jq('.af-currentFilter--result li'),
            monthValues = [];

        e.preventDefault();
        jq('.af-currentFilter--dateFilter--inner--year--listItem .active').removeClass('active');
        target.addClass('active');

        jq.each(monthValue, function (index, elem) {
            monthValues.push(jq(elem).data('monthvalue'));
        });

        jq.each(allNews, function (index, elem) {
            var theElem = jq(elem),
                yearData = theElem.data('year'),
                monthData = theElem.data('month');

            if (yearData === parseInt(value)) {

                if (monthValues.length > 0) {

                    if (monthValues.indexOf(monthData) > -1) {
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

        //jq('.af-currentFilter--dateFilter--inner--year--title.af-open').removeClass('af-open');
        //list.slideUp();
    });

    jq('.af-currentFilter--dateFilter--inner--month--list').on('click', function (e) {

        var target = jq(e.target),
            list = target.closest('ul'),
            value = target.data('monthvalue'),
            yearValue = jq('.af-currentFilter--dateFilter--inner--year--listItem .active'),
            allNews = jq('.af-currentFilter--result li'),
            monthValuesElems,
            monthValues = [];

        e.preventDefault();
        //jq('.af-currentFilter--dateFilter--inner--month--list .active').removeClass('active');

        if (target.hasClass('active')) {
            target.removeClass('active');
        } else {
            target.addClass('active');
        }

        monthValuesElems = jq('.af-currentFilter--dateFilter--inner--month--listItem .active');
        jq.each(monthValuesElems, function (index, elem) {
            monthValues.push(jq(elem).data('monthvalue'));
        });

        if (yearValue && yearValue.length > 0) {
            yearValue = yearValue.text();
        } else {
            yearValue = null;
        }

        jq.each(allNews, function (index, elem) {
            var theElem = jq(elem),
                yearData = theElem.data('year'),
                monthData = theElem.data('month');

            if (monthValues.indexOf(monthData) > -1) {

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

        //jq('.af-currentFilter--dateFilter--inner--month--title.af-open').removeClass('af-open');
        //list.slideUp();
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
            sessionStorage.setItem('afImportantMessageMinimized', false);
        } else {
            target.removeClass('af-open');
            target.text('Visa');
            importantMessageContainer.addClass('af-smallMessage');
            sessionStorage.setItem('afImportantMessageMinimized', true);
        }
    });

    afPublishedDate = jq('.af-publishedDate');
    if (afPublishedDate && afPublishedDate.length > 0) {
        AF.isOldArticleSingleElem(afPublishedDate, true, 3);
    }

    jq('.af-event-calendar-categoryRow--filter .af-accordionText').on('click', function (e) {

        var target = jq(e.target),
            p = target.closest('p'),
            list = p.next('ul'),
            isExpanded = (p.attr('aria-expanded') === 'true');

        if (isExpanded) {
            p.attr('aria-expanded', false);
            list.slideUp();
            p.removeClass('af-open');
            target.text('Visa');
        } else {
            p.attr('aria-expanded', true);
            p.addClass('af-open');
            list.slideDown();
            target.text('Dölj');
        }
    });

    jq('.af-event-calendar-categoryRow--filter-tags a').on('click', function (e) {

        var target = jq(e.target),
            list = target.closest('ul'),
            tagValue = target.text(),
            portletURL = list.data('portleturl'),
            fromDate = jQuery('input[name="af-events-from-date"]').val(),
            toDate = jQuery('input[name="af-events-to-date"]').val(),

            choosenTags,
            tags = [];

        e.preventDefault();

        if (target.hasClass('active')) {
            target.removeClass('active');
        } else if (target.text() === 'Alla') {
            jq('.af-event-calendar-categoryRow--filter-tag .active').removeClass('active');
            target.addClass('active');
        } else {
            jq('.af-event-calendar-categoryRow--filter-tags').find('li').first().find('a').removeClass('active');
            target.addClass('active');
        }

        choosenTags = jq('.af-event-calendar-categoryRow--filter-tags').find('.active');

        jq.each(choosenTags, function (i, e) {
            tags.push(jq(e).text());
        });

        jq.ajax({
            url: portletURL,
            data: {
                tag: JSON.stringify(tags),
                from: fromDate,
                to: toDate
            },
            type: 'get',
            success: function (data) {
                jq('.af-event-calendar-results').html(data);
            }

        });
    });

    jq('.af-event-calendar-clearFilter button').on('click', function (e) {

        var portletURL = jq('.af-event-calendar-categoryRow--filter-tags').data('portleturl'),
            fromInput = jq('input[name="af-events-from-date"]'),
            toInput = jq('input[name="af-events-to-date"]'),
            tagList = jq('.af-event-calendar-categoryRow--filter-tags');

        fromInput.val('Välj datum');
        toInput.val('Välj datum');
        tagList.find('.active').removeClass('active');

        jq.ajax({
            url: portletURL,
            data: {
                tag: 'Alla'
            },
            type: 'get',
            success: function (data) {
                jq('.af-event-calendar-results').html(data);
            }
        });
    });

    jq('.af-loadMoreEvents .sv-decoration-generell-bla-knapp--intern a').on('click', function (e) {

        var target = jq(e.target),
            portletURL = jq('.af-event-calendar-categoryRow--filter-tags').data('portleturl'),
            startAtHit = target.data('startathit'),
            fromDate = jQuery('input[name="af-events-from-date"]').val(),
            toDate = jQuery('input[name="af-events-to-date"]').val();

        e.preventDefault();

        jq.ajax({
            url: portletURL,
            data: {
                startAtHit: startAtHit,
                from: fromDate,
                to: toDate
            },
            type: 'get',
            success: function (data) {
                var existingEvents = jq('.af-event-calendar-results').html();
                target.data('startathit', startAtHit + 6);
                jq('.af-event-calendar-results').html(existingEvents + data);

                if (data.length < 10) {
                    jq('.af-event-calendar .af-loadMoreEvents').hide();
                }
            }
        });
    });

    jq('.af-findSchool-row--filter .af-accordionText').on('click', function (e) {

        var target = jq(e.target),
            p = target.closest('p'),
            list = p.next('ul'),
            isExpanded = (p.attr('aria-expanded') === 'true');

        if (isExpanded) {
            p.attr('aria-expanded', false);
            list.slideUp();
            p.removeClass('af-open');
            target.text('Visa');
        } else {
            p.attr('aria-expanded', true);
            p.addClass('af-open');
            list.slideDown();
            target.text('Dölj');
        }
    });

    function updateFilterItems(aContainer, anItems, aResult) {

        var items = jq(aContainer).find(anItems),
            size = items.length;

        jq(aResult).text(size + ' träffar');
    }

    jq('.af-findSchool input[name="af-school-name"]').on('keyup', function (e) {

        var target = jq(e.target),
            inputText = target.val(),
            allSchools;

        if (inputText.length > 2) {

            allSchools = jq('.af-findSchool .af-findSchool-school');

            jq.each(allSchools, function (index, elem) {
                var theElem = jq(elem),
                    text = theElem.text();

                if (text.toLowerCase().indexOf(inputText.toLowerCase()) > -1) {
                    theElem.show();
                } else {
                    theElem.hide();
                }
            });
        } else {
            allSchools = jq('.af-findSchool .af-findSchool-school');

            jq.each(allSchools, function (index, elem) {
                var theElem = jq(elem);
                theElem.show();
            });
        }

        updateFilterItems('.af-findSchool-schools', '.af-findSchool-school:visible', '.af-findSchool-result .af-findSchool-result-width p.normal');
    });

    jq('.af-findSchool-row--filter-areas a').on('click', function (e) {

        var target = jq(e.target),
            list = target.closest('ul'),
            allButton = list.find('li').first().find('a'),
            inputField = jq('input[name="af-school-name"]'),
            text = target.text(),
            ajaxURL = list.data('portleturl'),

            areas,
            productions,
            forms,
            areaArr = [],
            productionArr = [],
            formArr = [];

        e.preventDefault();

        if (text === 'Alla') {
            list.find('.active').removeClass('active');
            target.addClass('active');
        } else {

            if (allButton.hasClass('active')) {
                allButton.removeClass('active');
            }

            if (target.hasClass('active')) {
                target.removeClass('active');
            } else {
                target.addClass('active');
            }
        }

        areas = jq('.af-findSchool-row--filter-areas .active');
        productions = jq('.af-findSchool-row--filter-productions .active');
        forms = jq('.af-findSchool-row--filter-forms .active');

        jq.each(areas, function (i, e) {
            areaArr.push(jq(e).text());
        });

        jq.each(productions, function (i, e) {
            productionArr.push(jq(e).text());
        });

        jq.each(forms, function (i, e) {
            formArr.push(jq(e).text());
        });

        jq.ajax({
            url: ajaxURL,
            data: {
                areas: JSON.stringify(areaArr),
                productions: JSON.stringify(productionArr),
                forms: JSON.stringify(formArr)
            },
            success: function (data) {
                jq('.af-findSchool-result').html(data);
                inputField.val('');
            }
        });
    });

    jq('.af-findSchool-row--filter-productions a').on('click', function (e) {

        var target = jq(e.target),
            list = target.closest('ul'),
            allButton = list.find('li').first().find('a'),
            inputField = jq('input[name="af-school-name"]'),
            text = target.text(),
            ajaxURL = list.data('portleturl'),

            areas,
            productions,
            forms,
            areaArr = [],
            productionArr = [],
            formArr = [];

        e.preventDefault();

        if (text === 'Alla') {
            list.find('.active').removeClass('active');
            target.addClass('active');
        } else {

            if (allButton.hasClass('active')) {
                allButton.removeClass('active');
            }

            if (target.hasClass('active')) {
                target.removeClass('active');
            } else {
                target.addClass('active');
            }
        }

        areas = jq('.af-findSchool-row--filter-areas .active');
        productions = jq('.af-findSchool-row--filter-productions .active');
        forms = jq('.af-findSchool-row--filter-forms .active');

        jq.each(areas, function (i, e) {
            areaArr.push(jq(e).text());
        });

        jq.each(productions, function (i, e) {
            productionArr.push(jq(e).text());
        });

        jq.each(forms, function (i, e) {
            formArr.push(jq(e).text());
        });

        jq.ajax({
            url: ajaxURL,
            data: {
                areas: JSON.stringify(areaArr),
                productions: JSON.stringify(productionArr),
                forms: JSON.stringify(formArr)
            },
            success: function (data) {
                jq('.af-findSchool-result').html(data);
                inputField.val('');
            }
        });
    });

    jq('.af-findSchool-row--filter-forms a').on('click', function (e) {

        var target = jq(e.target),
            list = target.closest('ul'),
            allButton = list.find('li').first().find('a'),
            inputField = jq('input[name="af-school-name"]'),
            text = target.text(),
            ajaxURL = list.data('portleturl'),

            areas,
            productions,
            forms,
            areaArr = [],
            productionArr = [],
            formArr = [];

        e.preventDefault();

        if (text === 'Alla') {
            list.find('.active').removeClass('active');
            target.addClass('active');
        } else {

            if (allButton.hasClass('active')) {
                allButton.removeClass('active');
            }

            if (target.hasClass('active')) {
                target.removeClass('active');
            } else {
                target.addClass('active');
            }
        }

        areas = jq('.af-findSchool-row--filter-areas .active');
        productions = jq('.af-findSchool-row--filter-productions .active');
        forms = jq('.af-findSchool-row--filter-forms .active');

        jq.each(areas, function (i, e) {
            areaArr.push(jq(e).text());
        });

        jq.each(productions, function (i, e) {
            productionArr.push(jq(e).text());
        });

        jq.each(forms, function (i, e) {
            formArr.push(jq(e).text());
        });

        jq.ajax({
            url: ajaxURL,
            data: {
                areas: JSON.stringify(areaArr),
                productions: JSON.stringify(productionArr),
                forms: JSON.stringify(formArr)
            },
            success: function (data) {
                jq('.af-findSchool-result').html(data);
                inputField.val('');
            }
        });
    });

    jq('.af-findSchool .af-clear-filter').on('click', function (e) {

        var ajaxURL = jq('.af-findSchool-row--filter-areas').data('portleturl'),
            areaList = jq('.af-findSchool-row--filter-areas'),
            productionList = jq('.af-findSchool-row--filter-productions'),
            formList = jq('.af-findSchool-row--filter-forms');

        jq.ajax({
            url: ajaxURL,
            data: {
                areas: JSON.stringify([]),
                productions: JSON.stringify([]),
                forms: JSON.stringify([])
            },
            success: function (data) {
                jq('.af-findSchool-result').html(data);
                jq('input[name="af-school-name"]').val('');
                areaList.find('.active').removeClass('active');
                productionList.find('.active').removeClass('active');
                formList.find('.active').removeClass('active');

                areaList.find('li').first().find('a').addClass('active');
                productionList.find('li').first().find('a').addClass('active');
                formList.find('li').first().find('a').addClass('active');
            }
        });
    });

    jq('.af-findSchool .af-showMap').on('click', function () {
        jq('.af-findSchool-map').toggle();
    });

    jq('.af-uppleva-events .af-accordionText').on('click', function (e) {

        var target = jq(e.target),
            container = target.closest('.sv-font-brodtext-fet'),
            content = jq('.af-uppleva-events-filter-categories'),
            text,
            isExpanded;

        text = container.find('.af-accordionText');
        isExpanded = (container.attr('aria-expanded') === 'true');

        if (isExpanded) {
            container.attr('aria-expanded', false);
            content.hide();
            container.removeClass('af-open');
            text.text('Visa');
        } else {
            container.attr('aria-expanded', true);
            container.addClass('af-open');
            content.show();
            text.text('Dölj');
        }
    });

    jq('.af-uppleva-events .af-uppleva-events-filter-categories a').on('click', function (e) {

        var target = jq(e.target),
            list = target.closest('ul'),
            tagValue = target.text(),
            portletURL = list.data('portleturl'),

            choosenTags,
            tags = [];

        e.preventDefault();

        if (target.hasClass('active')) {
            target.removeClass('active');
        } else if (target.text() === 'Alla') {
            jq('.af-uppleva-events-filter-category .active').removeClass('active');
            target.addClass('active');
        } else {
            jq('.af-uppleva-events-filter-categories').find('li').first().find('a').removeClass('active');
            target.addClass('active');
        }

        choosenTags = jq('.af-uppleva-events-filter-categories').find('.active');

        jq.each(choosenTags, function (i, e) {
            tags.push(jq(e).text());
        });

        jq.ajax({
            url: portletURL,
            data: {
                tags: JSON.stringify(tags)
            },
            type: 'get',
            success: function (data) {
                jq('.af-uppleva-events-items').html(data);
            }
        });
    });

    // Link whole puff at startpage Uppleva site
    jq.each(jq('.af-uppleva-site .af-pagewidth-1366px.af-puff .af-flexRow .sv-decoration-generell-gron-platta .sv-font-lankstig a'), function (i, e) {

        var thisElem = jq(e),
            thisHref = thisElem.prop('href'),
            parent = thisElem.closest('.sv-vertical.sv-layout.sv-template-layout');

        parent.on('click', function (e) {
            document.location.href = thisHref;
        });
    });

    jq('.af-event-calendar-dateRow--filter .form-element').on('click', function (e) {

        var target = jq(e.target),
            datepicker,
            nextInput,
            name;

        e.preventDefault();
        e.stopPropagation();

        if (!target.is('input')) {
            nextInput = target.closest('.form-element').find('input');
        } else {
            nextInput = target;
        }

        name = nextInput.prop('name');

        if (name === 'af-events-from-date') {
            datepicker = jq('input[name="af-events-from-date"]').data('datepicker');
        } else {
            datepicker = jq('input[name="af-events-to-date"]').data('datepicker');
        }

        datepicker.show();
    });

    jq('.sv-predefinedsearch-portlet .af-viewMoreEvents').on('click', function (e) {

        var target = jq(e.target),
            isOpen = (target.attr('aria-expanded') === 'true');

        if (isOpen) {
            target.attr('aria-expanded', false);
            target.text('Visa fler');
            target.removeClass('af-open');
        } else {
            target.attr('aria-expanded', true);
            target.text('Visa färre');
            target.addClass('af-open');
        }

        jq('.sv-predefinedsearch-portlet .af-viewMoreEvents--hidden').toggle();
    });

    jq('.af-findSchool .af-findSchool-result').on('click', '.af-findSchool-school-info-map', function (e) {

        var target = jq(e.target),
            targetURL = target.data('detailpagemap');

        e.preventDefault();
        e.stopPropagation();

        document.location.href = targetURL;
    });

    jq('.af-mobileMainMenu').on('click', '.af-doNotLink', function (e) {

        var target = jq(e.target),
            parent = target.closest('li'),
            openIcon = parent.find('> .af-menuIcon');

        e.preventDefault();

        if (openIcon) {
            openIcon.trigger('click');
        }
    });

    AF.changeStandardSVIcons();
    AF.hideElemsAfterLoad();
    AF.removeAttribute('.sv-searchform-portlet .af-textInputField', 'aria-expanded');
});