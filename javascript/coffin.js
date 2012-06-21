/*
 * Coffin.js V1.0.0
 * Copyright 2012, @fat
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

!function ($) {

  /*
   * html5 boilerplate scroll fix
   */

  var viewportmeta = document.querySelector && document.querySelector('meta[name="viewport"]')
  var ua = navigator.userAgent

  if (viewportmeta && /iPhone|iPad|iPod/.test(ua) && !/Opera Mini/.test(ua)) {
    viewportmeta.content = "width=device-width, minimum-scale=1.0, maximum-scale=1.0"
    document.addEventListener("gesturestart", function () {
      viewportmeta.content = "width=device-width, minimum-scale=0.25, maximum-scale=1.6"
    }, false)
  }

  /*
   * coffin toggle for mobile
   */

  $(function () {

    var open = 'coffin-open'
    var touch = {}
    var $body = $('body')
    var $stage = $('.stage')

    $body
      .delegate('.coffin-tab', 'click', function (e) {
        e.preventDefault()
      })
      .delegate('[data-slide="coffin"]', 'touchstart', function () {

        $body.toggleClass(open)

        $stage.one('webkitTransitionEnd', function () {
          $body.toggleClass('coffin-static')
        })

        if (!$body.hasClass(open)) return

        setTimeout(function () {

          $body.bind('touchend.coffin', function (e) {
            if (window.scrollX > 1) {
              $stage.one('webkitTransitionEnd', function () {
                $body.removeClass('coffin-static')
              })

              $body
                .removeClass(open)
                .unbind('touchend.coffin')
            }
          })

        }, 0)

      })

  })

}(window.Zepto || window.jQuery)