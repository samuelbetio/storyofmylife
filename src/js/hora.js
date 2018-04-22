/* global Mobify */
/* jslint maxstatements: false */
/*
 Hora.js
 -------
 Assists with tracking user-behavior with custom Google Analytics events

 */
define([
        '$'
    ],
    function($) {
        var $window = $(window);
        var $doc = $(document);

        var Hora = {
            isDebug: false
        };

        var NON_INTERACTION = {'nonInteraction': 1};

        var _carousels = {};
        var _accordions = {};
        var _swiping = false;

        $.extend($, {
            isString: function(obj) {
                return Object.prototype.toString.call(obj) === '[object String]';
            }
        });

        Hora.__carousels = {
            clear: function() {
                _carousels = [];
            }
        };

        Hora.__accordions = {
            clear: function() {
                _accordions = [];
            }
        };

        /**
         * @description Validates whether an object contains all the required properties
         * @param name - a name for what the object represents
         * @param o - the object to test the properties of
         * @param expectedProperties - an Array containing a list of strings of the properties to check
         * @private - exposed on Hora for unit testing
         */
        Hora.__validateObjectSchema = function(name, o, expectedProperties) {
            for (var i = 0, l = expectedProperties.length; i < l; i++) {
                var expectedProperty = expectedProperties[i];

                if (!o.hasOwnProperty(expectedProperty)) {
                    throw 'The ' + name + ' object doesn\'t contain the ' + expectedProperty + ' property, which is required';
                }

                if (!o[expectedProperty]) {
                    throw 'The ' + name + ' object contains the ' + expectedProperty + ' property, but it\'s value is falsy';
                }
            }
        };

        /**
         * @description Converts the value of each property in the object into a string. Used when
         * sending ecommerce:addTransaction and ecommerce:addItem calls.
         * @param o
         * @returns {*}
         * @private - exposed on Hora for unit testing
         */
        Hora.__stringifyPropertyValues = function(o) {
            for (var prop in o) {
                if (o.hasOwnProperty(prop)) {
                    o[prop] = String(o[prop]);
                }
            }

            return o;
        };

        Hora.send = function() {
            var args = Array.prototype.slice.call(arguments);

            args.unshift('mobifyTracker.send', 'event');

            if (Hora.isDebug) {
                console.log('Parameters: %O', args);
            } else {
                Mobify.analytics.ua.apply(null, args);
            }
        };

        // Initializes Hora and sets up implicitly tracked events: Hora.orientationChange, Hora.scrollToBottom.
        Hora.init = function(isDebug) {
            Hora.isDebug = isDebug;

            // Bind events
            $window
                .on('touchmove', function() {
                    _swiping = true;
                })
                .on('touchend', function() {
                    window.setTimeout(function() {
                        _swiping = false;
                    }, 50);
                })
                .on('orientationchange', Hora.orientation.change)
                .on('load', function() {
                    var windowHeight = $window.height();

                    $window
                        .on('scroll', function() {
                            if ($window.scrollTop() + windowHeight === $doc.height()) {
                                Hora.scroll.bottom('Page');
                            }
                        });
                });

            (function patchAlerts() {
                var _alert = window.alert;

                window.alert = function(message) {
                    Hora.error.alert(message);

                    _alert(message);
                };
            })();
        };

        /**
         * Proxies the classic Google Analytics call so that we capture events fired by desktop
         * We then send them through Mobify's analytics call
         * Example: _gaq.push(["_trackEvent", "product selection", "select a size", a(this.options[this.selectedIndex]).text().trim()])
         */
        Hora.proxyClassicAnalytics = function() {
            if (!window._gaq || Hora.isDebug) {
                return;
            }

            var originalPush = window._gaq.push;

            window._gaq.push = function(data) {
                Hora.send('Desktop Event: ' + data[1], data[2], data[3], NON_INTERACTION);

                return originalPush(data);
            };
        };

        /**
         * Proxies the Universal Google Analytics call so that we capture events fired by desktop
         * We only allow the following events: require, provide, send, ec:setAction, ec:addProduct
         * Example: ga('ec:setAction','checkout', {'step': 3, 'option': 'visa credit' });
         */
        Hora.proxyUniversalAnalytics = function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
            if (Hora.isDebug) {
                return;
            }

            var _theirGA = window.ga; // If window.ga is set, lets default to that, otherwise it will be set later

            var _ourGA = function() {
                // If their analytics.js has loaded, we have _theirGA and should pass through events
                // Then after
                if (_theirGA) {
                    _theirGA.apply(null, arguments);
                } else {
                    (window.ga.q = window.ga.q || []).push(arguments);
                }

                // Check if the first argument is an allowed command
                if (!/^(require|provide|send|ec:setAction|ec:addProduct)$/mi.exec(action)) {
                    return;
                }

                // Don't send double events
                if (action === 'send' &&
                   (hitType === 'pageview' || hitType === 'event' && eventCategory === 'mobify')) {
                    return;
                }

                // Clone the array so that we don't modify the original arguments that are passed through to the desktop window.ga
                var args = Array.prototype.slice.call(arguments, 0);

                // Add our namespace and send the event back to a.js (which should make it back to this function and return above)
                args[0] = 'mobifyTracker.' + args[0];

                Mobify.analytics.ua.apply(null, args);
            };

            // Define ga() so that any calls to ga() proxy through our function
            window.ga = _ourGA;

            // Once their analytics.js has loaded, replace their ga() with ours
            // Passing a callback to `ga` will execute after analytics.js has loaded
            // See "Pushing Functions" here: https://developers.google.com/analytics/devguides/collection/analyticsjs/advanced
            window.ga(function() {
                _theirGA = window.ga;

                window.ga = _ourGA;
            });
        };

        // Hora.orientationChange
        // eg. Hora.orientationChange();
        Hora.orientation = {
            change: function() {
                var position = (window.innerHeight > window.innerWidth) ? 'Landscape to Portrait' : 'Portrait to Landscape';

                Hora.send('Orientation', 'Change', position, NON_INTERACTION);
            }
        };

        Hora.carousel = {
            // title = Home, PDP, Related Images
            // currentSlide = 1, 2, 3, 4, 5, 6
            // eg. Hora.carousel.slide('PDP', 1);
            slide: function(title, currentSlide) {
                var currentCarousel = _carousels[title];

                title = 'Carousel - ' + title;

                if (_swiping) {
                    // metric15 - First Item
                    //  1 - was the first item swiped
                    //  0 - was not the first item swiped
                    Hora.send(title, 'Swipe', 'Slide #' + currentSlide, currentSlide, {
                        'metric15': currentCarousel.swipes.length === 0 ? 1 : 0
                    });

                    currentCarousel.swipes.push(currentSlide);
                }
                else {
                    // metric15 - First Item
                    //  1 - was the first item moved
                    //  0 - was not the first item moved
                    Hora.send(title, 'Move', 'Slide #' + currentSlide, currentSlide, {
                        'metric15': currentCarousel.slides.length === 0 ? 1 : 0
                    });

                    currentCarousel.slides.push(currentSlide);
                }

                currentCarousel.viewed.push(currentSlide);

                // If the user has swiped as much as there swipes, maybe they've been to every slide?
                if (!currentCarousel.fullViewFired && currentCarousel.viewed.length >= currentCarousel.totalSlides) {
                    currentCarousel.fullView = true;

                    // Iterate the amount of slides,
                    // By default lets say they have seen all slides
                    // But if we find a slide we haven't visited, we bail
                    // Rather than firing the event
                    for (var i = 1, l = currentCarousel.totalSlides; i <= l; ++i) {
                        if (currentCarousel.viewed.indexOf(i) === -1) {
                            currentCarousel.fullView = false;
                            break;
                        }
                    }

                    if (currentCarousel.fullView) {
                        Hora.send(title, 'View All Slides', 'Total ' + currentCarousel.totalSlides, currentCarousel.totalSlides);

                        currentCarousel.fullViewFired = true;
                    }
                }
            },

            load: function(title, totalSlides) {
                // If the carousel hasn't been initialized, set it up
                if (!_carousels.hasOwnProperty(title)) {
                    _carousels[title] = {
                        fullView: false,
                        fullViewFired: false,
                        totalSlides: totalSlides,
                        slides: [],
                        swipes: [],
                        zooms: [],
                        icons: [],
                        viewed: [],
                        clicks: []
                    };
                }

                // Initially populate the carousel with the first slide
                _carousels[title].viewed.push(1);

                Hora.send('Carousel - ' + title, 'Load', 'Total ' + totalSlides, totalSlides, NON_INTERACTION);
            },

            zoom: function(title, currentSlide) {
                var currentCarousel = _carousels[title];

                title = 'Carousel - ' + title;

                // metric15 - First Item
                //  1 - was the first item zoomed
                //  0 - was not the first item zoomed
                Hora.send(title, 'Zoom', 'Slide #' + currentSlide, currentSlide, {
                    'metric15': currentCarousel.zooms.length === 0 ? 1 : 0
                });

                currentCarousel.zooms.push(currentSlide);
            },

            slideClick: function(title, currentSlide) {
                var currentCarousel = _carousels[title];

                title = 'Carousel - ' + title;

                // metric15 - First Item
                //  1 - was the first item clicked
                //  0 - was not the first item clicked
                Hora.send(title, 'Click',  'Slide #' + currentSlide, currentSlide, {
                    'metric15': currentCarousel.clicks.length === 0 ? 1 : 0
                });

                currentCarousel.clicks.push(currentSlide);
            },

            iconClick: function(title, currentSlide, direction) {
                var currentCarousel = _carousels[title];
                var directionTitle = (direction === -1) ? 'Previous' : 'Next';

                title = 'Carousel - ' + title;

                // metric15 - First Item
                //  1 - was the first item icon clicked
                //  0 - was not the first item icon clicked
                Hora.send(title, directionTitle + ' Icon', 'Slide #' + currentSlide, currentSlide, {
                    'metric15': currentCarousel.icons.length === 0 ? 1 : 0
                });

                currentCarousel.icons.push(currentSlide);
            }
        };

        Hora.navigation = {
            click: function(menuTitle, itemTitle) {
                Hora.send('Navigation - ' + menuTitle, 'Click', itemTitle);
            }
        };

        Hora.search = {
            toggle: function() {
                Hora.send('Search', 'Toggle');
            }
        };

        Hora.breadcrumb = {
            click: function() {
                Hora.send('Breadcrumb', 'Click');
            }
        };

        Hora.backToTop = {
            click: function() {
                Hora.send('Back To Top', 'Click');
            }
        };

        Hora.newsletter = {
            click: function() {
                Hora.send('Newsletter', 'Click');
            }
        };

        Hora.footer = {
            click: function() {
                Hora.send('Footer', 'Click');
            }
        };

        Hora.pagination = {
            click: function() {
                Hora.send('Pagination', 'Click');
            }
        };

        Hora.filter = {
            toggle: function(title) {
                Hora.send('Filter - ' + title, 'Toggle');
            },
            change: function(title, type, amount) {
                Hora.send('Filter - ' + title, 'Change: ' + type, amount);
            }
        };

        Hora.scroll = {
            up: function(title) {
                Hora.send('Scroll - ' + title, 'Up');
            },
            down: function(title) {
                Hora.send('Scroll - ' + title, 'Down');
            },
            top: function(title) {
                Hora.send('Scroll - ' + title, 'Top');
            },
            bottom: function(title) {
                Hora.send('Scroll - ' + title, 'Bottom');
            }
        };

        Hora.sizeGuide = {
            open: function(title) {
                Hora.send('Size Guide - ' + title, 'Open');
            }
        };

        Hora.emailFriend = {
            open: function(title) {
                Hora.send('Email Friend - ' + title, 'Open');
            }
        };

        Hora.emailMeBack = {
            open: function(title) {
                Hora.send('Email Me Back - ' + title, 'Open');
            }
        };

        Hora.color = {
            change: function(title) {
                Hora.send('Color - ' + title, 'Change');
            }
        };

        Hora.quantity = {
            change: function(title, amount) {
                Hora.send('Quantity - ' + title, 'Change', null, amount);
            }
        };

        Hora.size = {
            change: function(title, amount) {
                Hora.send('Size - ' + title, 'Change', null, amount);
            }
        };

        Hora.error = {
            generic: function(title, comment) {
                Hora.send('Error', title, comment);
            },
            alert: function(comment) {
                Hora.send('Error', 'Alert', comment);
            },
            unsuccessfulSubmission: function(comment) {
                Hora.send('Error', 'Unsuccessful Submission', comment);
            },
            unsuccessfulAddToCart: function(comment) {
                Hora.send('Error', 'Unsuccessful Add To Cart', comment);
            },
            unsuccessfulPlaceOrder: function(comment) {
                Hora.send('Error', 'Unsuccessful Place Order', comment);
            }
        };

        Hora.review = {
            read: function(title) {
                Hora.send('Review - ' + title, 'Read');
            }
        };

        Hora.sidebar = {
            open: function(title) {
                Hora.send('Sidebar - ' + title, 'Open');
            },
            close: function(title) {
                Hora.send('Sidebar - ' + title, 'Close');
            }
        };

        Hora.cart = {
            addItem: function() {
                var fullCarouselView = false;

                for (var title in _carousels) {
                    if (_carousels.hasOwnProperty(title)) {
                        var carousel = _carousels[title];

                        if (carousel.fullViewFired) {
                            fullCarouselView = true;
                        }
                    }
                }

                // metric15 - View All Carousel Slides
                //  1 - viewed all carousel slides
                //  0 - didn't view all carousel slides
                Hora.send('Cart', 'Add Item', 'None', 0, {
                    'metric15': fullCarouselView ? 1 : 0
                });
            },
            removeItem: function() {
                Hora.send('Cart', 'Remove Item', 'None', 0);
            }
        };

        Hora.minicart = {
            toggle: function() {
                Hora.send('Mini-Cart', 'Toggle');
            },

            enableEdit: function() {
                Hora.send('Mini-Cart', 'Enable Edit');
            },

            disableEdit: function() {
                Hora.send('Mini-Cart', 'Disable Edit');
            },

            changeQuantity: function(amount) {
                Hora.quantity.change('Mini-Cart', amount);
            }
        };

        Hora.checkout = {
            start: function(message) {
                Hora.send('Checkout', 'Start', message);
            }
        };

        Hora.accordion = {
            open: function(title, currentItem) {
                var currentAccordion = _accordions[title];

                title = 'Accordion - ' + title;

                // metric15 - First Item
                //  1 - was the first item opened
                //  0 - was not the first item opened
                Hora.send(title, 'Open', 'Item #' + currentItem, currentItem, {
                    'metric15': currentAccordion.opens.length === 0 ? 1 : 0
                });

                currentAccordion.opens.push(currentItem);

                // If there's more than one accordion item opened, and we've opened more than we've closed
                // Then this user doesn't mind having multiple opened
                // Send how many are currently opened and haven't been closed
                if (currentAccordion.opens.length > 1 && currentAccordion.opens.length > currentAccordion.closes.length) {
                    var total = currentAccordion.opens.length - currentAccordion.closes.length;

                    Hora.send(title, 'Open Multiple Items', 'Total ' + total, total);
                }

                // If the user has swiped as much as there swipes, maybe they've been to every slide?
                if (!currentAccordion.fullViewFired && currentAccordion.opens.length >= currentAccordion.totalItems) {
                    currentAccordion.fullView = true;

                    // Iterate the amount of slides,
                    // By default lets say they have seen all slides
                    // But if we find a slide we haven't visited, we bail
                    // Rather than firing the event
                    for (var i = 1, l = currentAccordion.totalItems; i <= l; ++i) {
                        if (currentAccordion.opens.indexOf(i) === -1) {
                            currentAccordion.fullView = false;
                            break;
                        }
                    }

                    if (currentAccordion.fullView) {
                        Hora.send(title, 'View All Items', 'Total ' + currentAccordion.totalItems, currentAccordion.totalItems);

                        currentAccordion.fullViewFired = true;
                    }
                }
            },

            close: function(title, currentItem) {
                var currentAccordion = _accordions[title];

                currentAccordion.closes.push(currentItem);
            },

            load: function(title, totalItems) {
                // If the accordion hasn't been initialized, set it up
                if (!_accordions.hasOwnProperty(title)) {
                    _accordions[title] = {
                        fullView: false,
                        fullViewFired: false,
                        totalItems: totalItems,
                        opens: [],
                        closes: []
                    };
                }

                Hora.send('Accordion - ' + title, 'Load', 'Total ' + totalItems, totalItems, NON_INTERACTION);
            }
        };

        Hora.viewDesktop = {
            click: function() {
                Hora.send('View Desktop', 'Click');
            }
        };

        /**
         * @description Provides a consistent way to fire transaction tracking in universal analytics
         * via the ecommerce plugin
         *
         * @param {string} transactionId
         * @param {string} affiliation
         * @param {object} transaction
         * @param {array} transactionItems
         *
         * @example
         *
         * Hora.transaction.send('1234', 'Acme Clothing'
         * {
         *    'revenue': '11.99',               // Grand Total.
         *    'shipping': '5',                  // Shipping.
         *    'tax': '1.29',                    // Tax.
         *    'currency': 'USD'                 // Currency.
         * },
         * [
         *   {
         *      'name': 'Fluffy Pink Bunnies',    // Product name. Required.
         *      'sku': 'DD23444',                 // SKU/code.
         *      'category': 'Party Toys',         // Category or variation.
         *      'price': '11.99',                 // Unit price.
         *      'quantity': '1'                   // Quantity.
         *     }
         * ]);
         *
         * For more in-depth documentation on Google Analytics Ecommerce Tracking, please see:
         * https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce
         *
         */
        Hora.transaction = {
            send: function(transactionId, affiliation, transaction, transactionItems) {
                var ECOMMERCE_PLUGIN = 'mobifyTracker.ecommerce';

                if (!transactionId || !$.isString(transactionId)) {
                    throw 'Hora.transaction.send requires a string containing the transaction ID, i.e. "1234"';
                }

                if (!affiliation || !$.isString(affiliation)) {
                    throw 'Hora.transaction.send requires a string containing the affiliation, usually the project name, i.e. "Acme Clothing"';
                }

                if (!transaction || !$.isPlainObject(transaction)) {
                    throw 'Hora.transaction.send requires an object literal containing the transaction details, i.e. {"revenue": "11.99","shipping": "5","tax": "1.29"}';
                }

                if (!transactionItems || !$.isArray(transactionItems)) {
                    throw 'Hora.transaction.send requires an Array containing the transaction item details';
                }

                transaction.id = transactionId;
                transaction.affiliation = affiliation;

                Hora.__stringifyPropertyValues(transaction);

                !Hora.isDebug && Mobify.analytics.ua(ECOMMERCE_PLUGIN + ':addTransaction', transaction);

                for (var i = 0, l = transactionItems.length; i < l; i++) {
                    var transactionItem = transactionItems[i];

                    // Universal Analytics requires that the transaction ID is sent for each item added.
                    // This should match the parent transaction ID submitted in the transaction parameter.
                    transactionItem.id = transactionId;

                    Hora.__validateObjectSchema('item', transactionItem, ['id', 'name', 'sku']);
                    Hora.__stringifyPropertyValues(transactionItem);

                    transactionItems[i] = transactionItem;

                    !Hora.isDebug && Mobify.analytics.ua(ECOMMERCE_PLUGIN + ':addItem', transactionItem);
                }

                if (Hora.isDebug) {
                    console.log('Transaction: %O', transaction);
                    console.log('Transaction items: %O', transactionItems);
                } else {
                    Mobify.analytics.ua(ECOMMERCE_PLUGIN + ':send');
                }
            }
        };

        return Hora;
    });
