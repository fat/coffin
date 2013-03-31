/*
 * Coffin.js V1.0.0
 * Copyright 2012, @fat
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

!function () {

    // touchend listener
    var touchEnd;

    // start of X scroll pos
    var xStart;

    // start of Y scroll pos
    var yStart;

    // direction of scroll
    var direction;

    // movement offset
    var xMovement = 0;

    // end scroll position
    var xEnd = 0;

    // percent ofscroll offset to trigger close/open action
    var fraction = 3/10;

    // window size cache
    var windowSize = window.innerWidth;

    // is coffin open
    var isOpen = false;

    // page element
    var page = document.querySelector('.page');

    // coffin element
    var coffin = document.querySelector('.coffin');

    // test element
    var skeletor = document.createElement('skeletor')

    // is this a touch device
    var isTouch = 'ontouchstart' in skeletor;

    // transition end event names
    var transitionEndEventNames = {
       'WebkitTransition' : ['webkitTransitionEnd', 'webkitTransform', '-webkit-transform'],
       'MozTransition'    : ['transitionend', 'transform', 'transform'],
       'transition'       : ['transitionend', 'transform', 'transform']
    }

    // the transitionend event name
    var transitionEndEventName;

    // the transition property
    var transitionProperty;

    // transform property in js
    var transformProperty;

    // transform property in css
    var transformCSSProperty;

    // define the property and event name
    for (name in transitionEndEventNames) {
        if (skeletor.style[name] !== undefined) {
            transitionProperty = name
            transitionEndEventName = transitionEndEventNames[name][0]
            transformProperty = transitionEndEventNames[name][1]
            transformCSSProperty = transitionEndEventNames[name][2]
            break
        }
    }

    // function for 3d transforms
    function translate3d (i) {
        page.style[transformProperty] = 'translate3d(' + i + 'px,0,0)';
    }

    // clearTransform
    function clearTransform () {
        page.style[transformProperty] = '';
    }

    // simple helper to toggle coffin
    function toggleCoffin () {
        direction = 'horizontal'
        isOpen ? closeCoffin() : openCoffin()
    }   

    // simple helper to force coffin open
    function openCoffin () {
        xMovement = Infinity;
        touchEnd();
    }

    // simple helper to force coffin close
    function closeCoffin () {
        xMovement = -Infinity;
        touchEnd();
    }

    // try a native matchesSelector on a selector with an element
    function matchesSelector(element, selector) {
        var matcher = element.matchesSelector || element.mozMatchesSelector || element.webkitMatchesSelector || element.oMatchesSelector
        return matcher && matcher.call(element, selector);
    }

    // detect the closest element based on a selector. For simple delegation.
    function closest (element, selector) {
      while (element && !matchesSelector(element, selector)) {
          element = element.parentNode;
      }
      return element;
    }

    // handle touch start event
    window.addEventListener('touchstart', function (e) {

        // reset direction property
        direction = '';

        // reset xMovement to left/right position
        xMovement = isOpen ? 270 : 0;

        // set touch start position for x axis
        xStart = e.touches[0].screenX;

        // set touch start position for y axis
        yStart = e.touches[0].screenY;

    });

    // handle touchmove event
    window.addEventListener('touchmove', function (e) {

        // don't allow scrolling the page up and down when nav open
        if (direction == 'vertical' && isOpen) e.preventDefault();

        // if direction is vertical then exit
        if (direction == 'vertical') return;

        // calculate offsets to see if scroll direciton is vertical or horizontal
        var xOffset = Math.abs(e.touches[0].screenX - xStart);
        var yOffset = Math.abs(e.touches[0].screenY - yStart);

        // set direction based on offsets
        if (yOffset > xOffset) return direction = 'vertical';

        // the first time a horizontal move, set the pulling class
        if (direction != 'horizontal') coffin.classList.add('coffin-pulling');

        // if not vertical, than horizontal :P
        direction = 'horizontal';

        // prevent scrolls if horizontal
        e.preventDefault();

        // calcuate movement based on last scroll pos
        xMovement = e.touches[0].screenX - xStart + xEnd;

        // if xmovement is within valid range, scroll page
        if (xMovement <= 270 && xMovement >= 0) {
            translate3d(xMovement);
        }

    });

    // listen for touchend event
    window.addEventListener('touchend', (touchEnd = function (e) {

        // if direction isn't horizontal than exit (w maybe toggle)
        if (direction != 'horizontal') return;

        var transitionEnd = function () {

            // reset transform
            if (!isOpen) clearTransform();

            page.style[transitionProperty] = '';

            page.removeEventListener(transitionEndEventName, transitionEnd);

            // remove the pulling
            coffin.classList.remove('coffin-pulling');

            // toggle the coffin open class
            coffin.classList[isOpen ? 'add' : 'remove']('coffin-open');

        };

        // calculate which side to transition to
        xEnd = xMovement <= (isOpen ? (270 - (fraction * 270)) : fraction * 270) ? 0 : 270;

        // check if transitioned open
        isOpen = xEnd === 270;

        // set transition property for animation
        page.style[transitionProperty] = transformCSSProperty + ' .1s linear';

        // tranform element along x axis
        translate3d(xEnd);

        // listen for transition complete
        page.addEventListener(transitionEndEventName, transitionEnd);

        // if exit is at edge, force transitionEnd because transition won't be fired anyways
        if (xMovement == 270) transitionEnd();

    }));

    window.addEventListener('click', function (e) {
        if (!direction && closest(e.target, '[data-coffin=toggle]')) toggleCoffin()
        return direction = '';  
    })
            
}();