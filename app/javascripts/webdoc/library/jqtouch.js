// /*
//     Based on jQTouch project <http://www.jqtouch.com> by David Kaneda <http://www.davidkaneda.com>
//     Documentation and issue tracking on Google Code <http://code.google.com/p/jqtouch/>
//     
//     Adapted by Zeno Crivelli to work on all modern browsers including FireFox (originally jQTouch has
//     been designed for Mobile WebKit only) and to work on a specified DIV (originally jQTouch operated
//     on the entire document <body>)
//     
//     jQTouch revision used: 109 ($Date: 2009-10-06 12:23:30 -0400 (Tue, 06 Oct 2009)
//     -- MIT License
// */
// 
// (function($) {
//     $.jQTouch = function(mainId, options) {
//         
//         // Set support values
//         $.support.touch = (typeof Touch == "object");
//         $.support.WebKitAnimationEvent = (typeof WebKitTransitionEvent == "object");
//         
//         // Initialize internal variables
//         var $body=$('#'+mainId),
//             mainContainerId = mainId,
//             $head=$('head'), 
//             hist=[], 
//             newPageCount=0, 
//             jQTSettings={}, 
//             hashCheck, 
//             currentPage, 
//             tapReady=true,
//             lastAnimationTime=0,
//             touchSelectors=[],
//             publicObj={},
//             extensions=$.jQTouch.prototype.extensions,
//             defaultAnimations=['slide','flip','slideup','dissolve','fade','back'], 
//             animations=[];
// 
//         // Get the party started
//         init(options);
// 
//         function init(options) {
//             
//             var defaults = {
//                 addGlossToIcon: true,
//                 backSelector: '.back, .cancel, .goback',
//                 cacheGetRequests: true,
//                 dissolveSelector: '.dissolve',
//                 fadeSelector: '.fade',
//                 fixedViewport: true,
//                 flipSelector: '.flip',
//                 formSelector: 'form',
//                 touchSelector: 'a, .touch',
//                 popSelector: '.pop',
//                 preloadImages: false,
//                 slideSelector: '#'+mainContainerId+' > .view > ul li a', //zeno
//                 slideupSelector: '.slideup',
//                 startupScreen: null,
//                 submitSelector: '.submit',
//                 useAnimations: true,
//                 useFastTouch: true // Experimental.
//             };
//             jQTSettings = $.extend({}, defaults, options);
//             
//             // Preload images
//             if (jQTSettings.preloadImages) {
//                 for (var i = jQTSettings.preloadImages.length - 1; i >= 0; i--){
//                     (new Image()).src = jQTSettings.preloadImages[i];
//                 };
//             }
// 
//             // Initialize on document load:
//             $(document).ready(function(){
// 
//                 // Add extensions
//                 for (var i in extensions)
//                 {
//                     var fn = extensions[i];
//                     if ($.isFunction(fn))
//                     {
//                         $.extend(publicObj, fn(publicObj));
//                     }
//                 }
//                 
//                 // Add animations
//                 for (var i in defaultAnimations)
//                 {
//                     var name = defaultAnimations[i];
//                     var selector = jQTSettings[name + 'Selector'];
//                     if (typeof(selector) == 'string') {
//                         addAnimation({name:name, selector:selector});
//                     }
//                 }
// 
//                 touchSelectors.push('input');
//                 touchSelectors.push(jQTSettings.touchSelector);
//                 touchSelectors.push(jQTSettings.backSelector);
//                 touchSelectors.push(jQTSettings.submitSelector);
//                 $(touchSelectors.join(', ')).css('-webkit-touch-callout', 'none');
//                 $(jQTSettings.backSelector).tap(liveTap);
//                 $(jQTSettings.submitSelector).tap(submitParentForm);
//                 
//                 // Create custom live events
//                 $body.submit(submitForm);
//                     
//                 if (jQTSettings.useFastTouch && $.support.touch) {
//                     $body.click(function(e){
//                         var $el = $(e.target);
//                         if ($el.attr('target') == '_blank' || $el.attr('rel') == 'external' || $el.is('input[type="checkbox"]')) {
//                             return true;
//                         } else {
//                             return false;
//                         }
//                     });
//                     
//                     // This additionally gets rid of form focusses
//                     $body.mousedown(function(e){
//                         var timeDiff = (new Date()).getTime() - lastAnimationTime;
//                         if (timeDiff < 200) {
//                             return false;
//                         }
//                     });
//                 }
// 
//                 // Make sure exactly one child of mainContainer ("jqt body") has "current" class
//                 // Update by zeno
//                 if ($('#'+mainContainerId+' > .current').length == 0) {
//                     currentPage = $('#'+mainContainerId+' > .view:first');
//                 } else {
//                     currentPage = $('#'+mainContainerId+' > .current:first');
//                     $('#'+mainContainerId+' > .current').removeClass('current');
//                 }
//                 
//                 // Go to the top of the "current" page
//                 $(currentPage).addClass('current');
//                 // location.hash = $(currentPage).attr('id'); //disabled by zeno
//                 addPageToHistory(currentPage);
//                 scrollTo(0, 0);
//                 // dumbLoopStart(); //disabled by zeno
//             });
//         }
//         
//         // PUBLIC FUNCTIONS
//         function goBack(to) {
//             // Init the param
//             if (hist.length > 1) {
//                 var numberOfPages = Math.min(parseInt(to || 1, 10), hist.length-1);
// 
//                 // Search through the history for an ID
//                 if( isNaN(numberOfPages) && typeof(to) === "string" && to != '#' ) {
//                     for( var i=1, length=hist.length; i < length; i++ ) {
//                         if( '#' + hist[i].id === to ) {
//                             numberOfPages = i;
//                             break;
//                         }
//                     }
//                 }
// 
//                 // If still nothing, assume one
//                 if( isNaN(numberOfPages) || numberOfPages < 1 ) {
//                     numberOfPages = 1;
//                 };
// 
//                 // Grab the current page for the "from" info
//                 var animation = hist[0].animation;
//                 var fromPage = hist[0].page;
// 
//                 // Remove all pages in front of the target page
//                 hist.splice(0, numberOfPages);
// 
//                 // Grab the target page
//                 var toPage = hist[0].page;
// 
//                 // Make the animations
//                 animatePages(fromPage, toPage, animation, true);
//                 
//                 return publicObj;
//             } else {
//                 console.error('No pages in history.');
//                 return false;
//             }
//         }
//         function goTo(toPage, animation) {
//             var fromPage = hist[0].page;
//             
//             if (typeof(toPage) === 'string') {
//                 toPage = $(toPage);
//             }
//             if (typeof(animation) === 'string') {
//                 for (var i = animations.length - 1; i >= 0; i--){
//                     if (animations[i].name === animation)
//                     {
//                         animation = animations[i];
//                         break;
//                     }
//                 }
//             }
// 
//             // test added by noe: if we are on the same page, do nothing
//             if (fromPage[0] != toPage[0]) {
//                 if (animatePages(fromPage, toPage, animation)) {
//                     addPageToHistory(toPage, animation);
//                     return publicObj;
//                 }
//                 else
//                 {
//                     console.error('Could not animate pages.');
//                     return false;
//                 }
//             }
//             else {
//                 return publicObj;
//             }
//         }
//         
//         // PRIVATE FUNCTIONS
//         function liveTap(e){
//             
//             // Grab the clicked element
//             var $el = $(e.target);
//             
//             if ($el.attr('nodeName')!=='A'){
//                 $el = $el.parent('a');
//             }
//             
//             var target = $el.attr('target'), 
//             hash = $el.attr('hash'), 
//             animation=null;
//             
//             if (tapReady == false || !$el.length) {
//                 // console.warn('Not able to tap element.');
//                 return false;
//             }
//             
//             if ($el.attr('target') == '_blank' || $el.attr('rel') == 'external')
//             {
//                 return true;
//             }
//             
//             // Figure out the animation to use
//             for (var i = animations.length - 1; i >= 0; i--){
//                 if ($el.is(animations[i].selector)) {
//                     animation = animations[i];
//                     break;
//                 }
//             };
//             
//             // User clicked a back button
//             if ($el.is(jQTSettings.backSelector)) {
//                 goBack(hash);
//             }
//             // Branch on internal or external href
//             else if (hash && hash!='#') {
//                 $el.addClass('active');
//                 goTo($(hash).data('referrer', $el), animation);
//             } else {
//                 $el.addClass('loading active');
//                 showPageByHref($el.attr('href'), {
//                     animation: animation,
//                     callback: function(){ 
//                         $el.removeClass('loading'); setTimeout($.fn.unselect, 250, $el);
//                     },
//                     $referrer: $el
//                 });
//             }
//             return false;
//         }
//         function addPageToHistory(page, animation) {
//             // Grab some info
//             var pageId = page.attr('id');
// 
//             // Prepend info to page history
//             hist.unshift({
//                 page: page, 
//                 animation: animation, 
//                 id: pageId
//             });
//         }
//         function animatePages(fromPage, toPage, animation, backwards) {
//             // Error check for target page
//             if(toPage.length === 0){
//                 $.fn.unselect();
//                 console.error('Target element is missing.');
//                 return false;
//             }
//             
//             // Collapse the keyboard
//             $(':focus').blur();
// 
//             // Make sure we are scrolled up to hide location bar
//             scrollTo(0, 0);
//             
//             // Define callback to run after animation completes
//             var callback = function(event){
//               
//                 if (animation)
//                 {
//                     toPage.removeClass('in reverse ' + animation.name);
//                     fromPage.removeClass('current out reverse ' + animation.name);
//                     fromPage.hide(); // zeno: necessary for slideup reverse animation withouth webkit transitions
//                     //$("#"+mainContainerId).css({'overflow-y':'visible'}); // zeno: rehestablish vertical scrollbar
//                 }
//                 else
//                 {
//                     fromPage.removeClass('current');
//                 }
//                 
//                 toPage.trigger('pageAnimationEnd', { direction: 'in' });
//                 fromPage.trigger('pageAnimationEnd', { direction: 'out' });
//                 
//                 // clearInterval(dumbLoop); //disabled by zeno
//                 currentPage = toPage;
//                 // location.hash = currentPage.attr('id'); //disabled by zeno
//                 // dumbLoopStart(); //disabled by zeno
//                 
//                 var $originallink = toPage.data('referrer');
//                 if ($originallink) {
//                     $originallink.unselect();
//                 }
//                 lastAnimationTime = (new Date()).getTime();
//                 tapReady = true;
//             };
//             
//             fromPage.trigger('pageAnimationStart', { direction: 'out' });
//             toPage.trigger('pageAnimationStart', { direction: 'in' });
// 
//             if ($.support.WebKitAnimationEvent && animation && jQTSettings.useAnimations) {
//                 toPage.one('webkitAnimationEnd', callback);
//                 tapReady = false;
//                 toPage.addClass(animation.name + ' in current ' + (backwards ? ' reverse' : ''));
//                 fromPage.addClass(animation.name + ' out' + (backwards ? ' reverse' : ''));
//             } else {
//                 // OLD:
//                 // toPage.addClass('current');
//                 // callback();
//                 
//                 // NEW by Zeno! (animations also in FireFox using jQuery!)
//                 var defaultDuration = 350;
// 
//                 switch(animation.name) {
//                   case "slide":
//                     tapReady = false;
//                     toPage.show();
//                     if (backwards) { //slide horiz reverse
//                       toPage.css({left:"-100%"});
//                       toPage.animate({left:"0"}, { duration:defaultDuration });
//                       fromPage.animate({left:"100%"}, { duration:defaultDuration, complete:callback });
//                     }
//                     else { //slide horiz
//                       toPage.css({left:"100%"});
//                       toPage.animate({left:"0"}, { duration:defaultDuration });
//                       fromPage.animate({left:"-100%"}, { duration:defaultDuration, complete:callback });
//                     }
//                     break;
//                   case "slideup":
//                     tapReady = false;
//                     toPage.show();
//                     //$("#"+mainContainerId).css({'overflow-y':'hidden'}); // zeno: disable vertical scrollbar during slideup animation 
//                     var maxTop = toPage.height()+'px'; //"100%"
//                     if (backwards) { //slide vertically reverse
//                       fromPage.animate({top:maxTop}, { duration:defaultDuration, complete:callback });
//                       // don't move toPage
//                     }
//                     else { //slide vertically
//                       toPage.css({top:maxTop});
//                       toPage.animate({top:"0"}, { duration:defaultDuration, complete:callback });
//                       // do not move fromPage
//                     }
//                     break;
//                   default:
//                     // do not animate, simply toggle the views
//                     toPage.addClass('current');
//                     callback();
//                 }
//             }
//             
//             return true;
//         }
//         // function dumbLoopStart() {
//         //     dumbLoop = setInterval(function(){
//         //         var curid = currentPage.attr('id');
//         //         if (location.hash == '') {
//         //             location.hash = '#' + curid;
//         //         } else if (location.hash != '#' + curid) {
//         //             try {
//         //                 goBack(location.hash);
//         //             } catch(e) {
//         //                 console.error('Unknown hash change.');
//         //             }
//         //         }
//         //     }, 100);
//         // }
//         function insertPages(nodes, animation) {
//             var targetPage = null;
//             $(nodes).each(function(index, node){
//                 var $node = $(this);
//                 if (!$node.attr('id')) {
//                     $node.attr('id', 'page-' + (++newPageCount));
//                 }
//                 $node.appendTo($body);
//                 if ($node.hasClass('current') || !targetPage ) {
//                     targetPage = $node;
//                 }
//             });
//             if (targetPage !== null) {
//                 goTo(targetPage, animation);
//                 return targetPage;
//             }
//             else
//             {
//                 return false;
//             }
//         }
//         function showPageByHref(href, options) {
//             var defaults = {
//                 data: null,
//                 method: 'GET',
//                 animation: null,
//                 callback: null,
//                 $referrer: null
//             };
//             
//             var settings = $.extend({}, defaults, options);
// 
//             if (href != '#')
//             {
//                 $.ajax({
//                     url: href,
//                     data: settings.data,
//                     type: settings.method,
//                     success: function (data, textStatus) {
//                         var firstPage = insertPages(data, settings.animation);
//                         if (firstPage)
//                         {
//                             if (settings.method == 'GET' && jQTSettings.cacheGetRequests && settings.$referrer)
//                             {
//                                 settings.$referrer.attr('href', '#' + firstPage.attr('id'));
//                             }
//                             if (settings.callback) {
//                                 settings.callback(true);
//                             }
//                         }
//                     },
//                     error: function (data) {
//                         if (settings.$referrer) settings.$referrer.unselect();
//                         if (settings.callback) {
//                             settings.callback(false);
//                         }
//                     }
//                 });
//             }
//             else if ($referrer)
//             {
//                 $referrer.unselect();
//             }
//         }
//         function submitForm(e, callback){
//             var $form = (typeof(e)==='string') ? $(e) : $(e.target);
//             if ($form.length && $form.is(jQTSettings.formSelector) && $form.attr('action')) {
//                 showPageByHref($form.attr('action'), {
//                     data: $form.serialize(),
//                     method: $form.attr('method') || "POST",
//                     animation: animations[0] || null,
//                     callback: callback
//                 });
//                 return false;
//             }
//             return true;
//         }
//         function submitParentForm(e){
//             var $form = $(this).closest('form');
//             if ($form.length)
//             {
//                 evt = jQuery.Event("submit");
//                 evt.preventDefault();
//                 $form.trigger(evt);
//                 return false;
//             }
//             return true;
//         }
//         function addAnimation(animation) {
//             if (typeof(animation.selector) == 'string' && typeof(animation.name) == 'string') {
//                 animations.push(animation);
//                 $(animation.selector).tap(liveTap);
//                 touchSelectors.push(animation.selector);
//             }
//         }
//         
//         // Public jQuery Fns
//         $.fn.unselect = function(obj) {
//             if (obj) {
//                 obj.removeClass('active');
//             } else {
//                 $('.active').removeClass('active');
//             }
//         };
//         $.fn.makeActive = function(){
//             return $(this).addClass('active');
//         };
//         $.fn.swipe = function(fn) {
//             if ($.isFunction(fn))
//             {
//                 return this.each(function(i, el){
//                     $(el).bind('swipe', fn);  
//                 });
//             }
//         };
//         $.fn.tap = function(fn){
//             if ($.isFunction(fn))
//             {
//                 var tapEvent = (jQTSettings.useFastTouch && $.support.touch) ? 'tap' : 'click';
//                 return $(this).live(tapEvent, fn);
//             } else {
//                 $(this).trigger('tap');
//             }
//         };
//         
//         publicObj = {
//             goBack: goBack,
//             goTo: goTo,
//             addAnimation: addAnimation,
//             submitForm: submitForm
//         };
//         
//         return publicObj;
//     };
//     
//     // Extensions directly manipulate the jQTouch object, before it's initialized.
//     $.jQTouch.prototype.extensions = [];
//     $.jQTouch.addExtension = function(extension){
//         $.jQTouch.prototype.extensions.push(extension);
//     };
// 
// })(jQuery);