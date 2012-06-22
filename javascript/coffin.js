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

  $(function () {

    var open   = 'coffin-open'

    var $body  = $('body')
    var $stage = $('.stage')
    var touchstart = 'ontouchstart' in document.documentElement ? 'touchstart' : 'click'

    $body
      .delegate('.coffin-tab', 'click', function (e) { e.preventDefault() })
      .delegate('[data-coffin="click"]', 'click'   , toggleCoffin)
      .delegate('[data-coffin="touch"]', touchstart, toggleCoffin)

    function translate3d (open) {
      return 'translate3d(' + (open  ? '210px' : '-' + (210 - window.scrollX) + 'px') + ',0,0)'
    }

    function toggleCoffin() {

      var isOpen = $body.hasClass(open)

      function transitionComplete () {

        if (isOpen) $body.removeClass(open)

        setTimeout(function () {
          $stage.css({
            '-webkit-transform': '',
            '-webkit-transition': '',
            'left': !isOpen ? 210 : ''
          })
        }, 0)

      }

      if (!isOpen) $body.addClass(open)

      $stage.one('webkitTransitionEnd', transitionComplete)

      $stage.css({
        '-webkit-transform': translate3d(!isOpen),
        '-webkit-transition': '-webkit-transform .1s linear'
      })

      if (isOpen || touchstart == 'click') return

      setTimeout(function () {

        $body.bind('touchend.coffin', function (e) {

          if (!window.scrollX) return

          isOpen = true

          $stage.one('webkitTransitionEnd', transitionComplete)

          $stage.css({
            '-webkit-transform': translate3d(),
            '-webkit-transition': '-webkit-transform .1s linear'
          })

          $body.unbind('touchend.coffin')

        })

      }, 0)

    }

  })

}(window.Zepto || window.jQuery)