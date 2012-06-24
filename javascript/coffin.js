/*
 * Coffin.js V1.0.0
 * Copyright 2012, @fat
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

!function ($) {

  /*
   * coffin toggle for mobile
   */

  var xStart;
  var xMovement = 0;
  var xEnd = 0;
  var fraction = 1/3;
  var isOpen = false;
  var pagewrap = document.querySelector('.page-wrap');
  var page = document.querySelector('.page');
  var isTouch = 'ontouchstart' in document.documentElement;
  var clickSelector = '[data-coffin=click]';
  var touchSelector = '[data-coffin=touch]';
  var windowSize = document.body.offsetWidth;

  page.style.width = windowSize + 'px';

  if (isTouch) clickSelector += ', ' + touchSelector;

  function translate3d (i) {
      pagewrap.style.webkitTransform = 'translate3d(' + i + 'px,0,0)';
      pagewrap.style.width = (windowSize - i) + 'px';
  }

  function closest (element, selector) {
    while (element && !element.webkitMatchesSelector(selector)) {
        element = element.parentNode;
        if (!element.webkitMatchesSelector) return false;
    }
    return element;
  }

  function touchEnd () {
      if (windowSize > 767) return;

      var transitionEnd = function () {
          pagewrap.style.webkitTransition = '';
          pagewrap.removeEventListener('webkitTransitionEnd', transitionEnd);
      };

      if (isOpen) {
          xEnd = xMovement <= (270 - (fraction * 270)) ? 0 : 270;
      } else {
          xEnd = xMovement <= fraction * 270 ? 0 : 270;
      }

      isOpen = xEnd === 270;
      pagewrap.style.webkitTransition = '-webkit-transform .1s linear, width .1s linear';
      translate3d(xEnd);

      pagewrap.addEventListener('webkitTransitionEnd', transitionEnd);
  }

  function closeCoffin () {
      xMovement = 0;
      touchEnd();
  }

  window.addEventListener('resize', function (e) {
      if ((windowSize = document.body.offsetWidth) > 767) {
          pagewrap.style.webkitTransform = '';
          page.style.width = windowSize + 'px';
      }
  });

  window.addEventListener('touchstart', function (e) {
      if (windowSize > 767) return;
      xMovement = isOpen ? 270 : 0;
      xStart = e.touches[0].screenX;
  });

  window.addEventListener('touchmove', function (e) {
      if (windowSize > 767) return;
      xMovement = e.touches[0].screenX - xStart + xEnd;
      if (xMovement <= 270 && xMovement >= 0) {
          translate3d(xMovement);
      }
  });

  window.addEventListener('touchend', touchEnd);

  window.addEventListener('click', function (e) {
      closest(e.target, clickSelector) && closeCoffin();
  });

  if (isTouch) {
    window.addEventListener('touchstart', function (e) {
        closest(e.target, touchSelector) && closeCoffin();
    });
  }

}();