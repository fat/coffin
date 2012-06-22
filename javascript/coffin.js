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
    var touch  = {}
    var $body  = $('body')
    var $stage = $('.stage')
    var touchstart = 'ontouchstart' in document.documentElement ? 'touchstart' : 'click'

    $body
      .delegate('.coffin-tab', 'click', function (e) { e.preventDefault() })
      .delegate('[data-coffin="click"]', 'click'   , toggleCoffin)
      .delegate('[data-coffin="touch"]', touchstart, toggleCoffin)

    function toggleCoffin() {

        $body.toggleClass(open)

        $stage.one('webkitTransitionEnd', function () {
          $body.toggleClass('coffin-static')
        })

        if (!$body.hasClass(open) || touchstart == 'click') return

        setTimeout(function () {

          $body.bind('touchend.coffin', function (e) {
            if (!window.scrollX) return

            $stage.one('webkitTransitionEnd', function () {
              $body.removeClass('coffin-static')
            })

            $body
              .removeClass(open)
              .unbind('touchend.coffin')
          })

        }, 0)

      }

  })

}(window.Zepto || window.jQuery)