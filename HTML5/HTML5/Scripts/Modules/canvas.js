var $c = null;
var c = null;
var ctx = null;

var iterations = 0;

function drawCanvas() {
    var width = $(window).innerWidth();
    var height = $(window).innerHeight();

    ctx.canvas.width = width;
    ctx.canvas.height = height;

    var interval = width / iterations;

    var y_iterations = height / interval;

    ctx.clearRect(0, 0, width, height);
    // Create gradient
    var grd = ctx.createRadialGradient(width / 2, height / 2, (width + height) * 0.9, width / 2, height / 2, 0);
    grd.addColorStop(0, '#f00');
    grd.addColorStop(1, '#9ffcfc');

    // Fill with gradient
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height);

    ctx.beginPath();
    for (var i = 0; i <= iterations; i++) {
        var pos = i * interval;
        ctx.moveTo(pos, 0);
        ctx.lineTo(width - pos, height);
    }

    for (var i = 0; i <= y_iterations; i++) {
        var pos = i * interval;
        ctx.moveTo(0, pos);
        ctx.lineTo(width, height - pos);
    }
    ctx.closePath();
    ctx.lineWidth = 0.5;
    ctx.stroke();
}

$(document).ready(function () {
    $c = $('#myCanvas');
    c = $c[0];
    ctx = c.getContext('2d');

    $('#numLines').val(iterations);

    drawCanvas();

    $('.triggerChanges').on('input', function (e) {
        if (this.checkValidity()) {
            iterations = this.value;
            drawCanvas();
        }
    });

    $('#numLines').bind('mousewheel', function (e, delta) {
        var intVal = parseInt(this.value);
        var intDelta = parseInt(delta) * 5;
        var finalVal = intVal + intDelta;
        var maxLen = $(this).prop('maxlength');

        if (isNaN(finalVal) || finalVal < 0) {
            finalVal = 0;
        } else if (finalVal.toString().length > maxLen) {
            finalVal = Math.pow(10, maxLen) - 1;
        }

        $(this).val(finalVal);
        $(this).trigger('input');
    });
});


/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 * 
 * Requires: 1.2.2+
 */

(function ($) {

    var types = ['DOMMouseScroll', 'mousewheel'];

    if ($.event.fixHooks) {
        for (var i = types.length; i;) {
            $.event.fixHooks[types[--i]] = $.event.mouseHooks;
        }
    }

    $.event.special.mousewheel = {
        setup: function () {
            if (this.addEventListener) {
                for (var i = types.length; i;) {
                    this.addEventListener(types[--i], handler, false);
                }
            } else {
                this.onmousewheel = handler;
            }
        },

        teardown: function () {
            if (this.removeEventListener) {
                for (var i = types.length; i;) {
                    this.removeEventListener(types[--i], handler, false);
                }
            } else {
                this.onmousewheel = null;
            }
        }
    };

    $.fn.extend({
        mousewheel: function (fn) {
            return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
        },

        unmousewheel: function (fn) {
            return this.unbind("mousewheel", fn);
        }
    });


    function handler(event) {
        var orgEvent = event || window.event, args = [].slice.call(arguments, 1), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
        event = $.event.fix(orgEvent);
        event.type = "mousewheel";

        // Old school scrollwheel delta
        if (orgEvent.wheelDelta) { delta = orgEvent.wheelDelta / 120; }
        if (orgEvent.detail) { delta = -orgEvent.detail / 3; }

        // New school multidimensional scroll (touchpads) deltas
        deltaY = delta;

        // Gecko
        if (orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS) {
            deltaY = 0;
            deltaX = -1 * delta;
        }

        // Webkit
        if (orgEvent.wheelDeltaY !== undefined) { deltaY = orgEvent.wheelDeltaY / 120; }
        if (orgEvent.wheelDeltaX !== undefined) { deltaX = -1 * orgEvent.wheelDeltaX / 120; }

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

})(jQuery);