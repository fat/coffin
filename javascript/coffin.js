/*
 * Coffin.js V1.0.0
 * Copyright 2012, @fat
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

!function () {

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
    var fraction = 1/5;

    // is coffin open
    var isOpen = false;

    // page element
    var page = document.querySelector('.page');

    // is this a touch device
    var isTouch = 'ontouchstart' in document.documentElement;

    // declaritive selectors
    var clickSelector = '[data-coffin=click]';
    var touchSelector = '[data-coffin=touch]';

    // window size cache
    var windowSize = document.body.offsetWidth;

    // if isTouch, map declaritive touch listeners to click events
    if (isTouch) clickSelector += ', ' + touchSelector;

    // function for 3d transforms
    function translate3d (i) {
        page.style.webkitTransform = 'translate3d(' + i + 'px,0,0)';
    }

    // simple helper to force coffin close
    function closeCoffin () {
        if (windowSize > 767) return;
        xMovement = 0;
        touchEnd();
    }

    // detect the closest element based on a selctor. For simple delegation.
    function closest (element, selector) {
      while (element && !element.webkitMatchesSelector(selector)) {
          element = element.parentNode;
          if (!element.webkitMatchesSelector) return;
      }
      return element;
    }

    // handle touch end
    function touchEnd () {

        // if window isn't mobile, than exit
        if (windowSize > 767) return;

        // remove transition and handler on transitionEnd
        var transitionEnd = function () {
            page.style.webkitTransition = '';
            page.removeEventListener('webkitTransitionEnd', transitionEnd);
        };

        // calculate which side to transition to
        xEnd = xMovement <= (isOpen ? (270 - (fraction * 270)) : fraction * 270) ? 0 : 270;

        // check if transitioned open
        isOpen = xEnd === 270;

        // set transition property for animation
        page.style.webkitTransition = '-webkit-transform .1s linear';

        // tranform element along x axis
        translate3d(xEnd);

        // listen for transition complete
        page.addEventListener('webkitTransitionEnd', transitionEnd);

    }

    // handle resize event
    window.addEventListener('resize', function (e) {

        // if window is resized greater than mobile, then remove any transforms
        if ((windowSize = document.body.offsetWidth) > 767) page.style.webkitTransform = '';

    });


    // handle touch start event
    window.addEventListener('touchstart', function (e) {

        // if window isn't mobile, than exit
        if (windowSize > 767) return;

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

        // if window isn't mobile, than exit
        if (windowSize > 767 || direction == 'vertical') return;

        // calculate offsets to see if scroll direciton is vertical or horizontal
        var xOffset = Math.abs(e.touches[0].screenX - xStart);
        var yOffset = Math.abs(e.touches[0].screenY - yStart);

        // set direction based on offsets
        if (yOffset > xOffset) return direction = 'vertical';

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
    window.addEventListener('touchend', touchEnd);

    // listen to click events on declartive markup
    window.addEventListener('click', function (e) {
        closest(e.target, clickSelector) && closeCoffin();
    });

    // if not touch exit early
    if (!isTouch) return;

    // listen to touch start events on declartive markup
    window.addEventListener('touchstart', function (e) {
        closest(e.target, touchSelector) && closeCoffin();
    });

}();