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

        $stage.css({
          '-webkit-transform': '',
          '-webkit-transition': '',
          'left': !isOpen ? 210 : ''
        })

        $stage.unbind('webkitTransitionEnd.coffin')

        if (isOpen) {
          $body
            .unbind('touchstart.coffin')
            .unbind('touchmove.coffin')
            .unbind('touchend.coffin')
        }

      }

      if (!isOpen) $body.addClass(open)

      $stage.bind('webkitTransitionEnd.coffin', transitionComplete)

      $stage.css({
        '-webkit-transform': translate3d(!isOpen),
        '-webkit-transition': '-webkit-transform .1s linear'
      })

      if (isOpen || touchstart == 'click') return

      setTimeout(function () {

        var xStart
        var yStart

        $body

          .bind('touchstart.coffin', function (e) {
            xStart = e.touches[0].screenX
            yStart = e.touches[0].screenY
          })

          .bind('touchmove.coffin', function (e) {
            var xMovement = Math.abs(e.touches[0].screenX - xStart)
            var yMovement = Math.abs(e.touches[0].screenY - yStart)
            if ((yMovement * 3) > xMovement) {
              e.preventDefault()
            }
          })

          .bind('touchend.coffin', function (e) {

            if (!window.scrollX) return

            var willScroll = (210 - window.scrollX) >= 0

            isOpen = true

            if (willScroll) $stage.one('webkitTransitionEnd', transitionComplete)

            $stage.css({
              '-webkit-transform': translate3d(),
              '-webkit-transition': '-webkit-transform .1s linear'
            })

            if (!willScroll) transitionComplete()

          })

      }, 0)

    }

  })

}(window.Zepto || window.jQuery)