;(function($) {
    'use strict';

    var $fxaFrame = $('#fxa');
    var fxaIframeSrc = $('#intro').data('fxa-iframe-src');
    var fxaFrameTarget = ($fxaFrame.length) ? $('#fxa')[0].contentWindow : null;
    var resizeTimer;
    var fxaHandshake = false;

    // remove trailing slash from iframe src (if present)
    fxaIframeSrc = (fxaIframeSrc[fxaIframeSrc.length - 1] === '/') ? fxaIframeSrc.substr(0, fxaIframeSrc.length - 1) : fxaIframeSrc;

    // set up communication with FxA iframe
    window.addEventListener('message', function (e) {
        var data;
        // make sure origin is as expected
        if (e.origin === fxaIframeSrc) {
            data = JSON.parse(e.data);

            switch (data.command) {
            // tell iframe we are expecting it
            case 'ping':
                fxaFrameTarget.postMessage(e.data, fxaIframeSrc);
                fxaHandshake = true;
                break;

            // resize container when iframe resizes for nicer UI
            case 'resize':
                clearTimeout(resizeTimer);
                // sometimes resizes come in bunches - only want to react to the last of a set
                resizeTimer = setTimeout(function() {
                    $fxaFrame.css('height', data.data.height + 'px').addClass('visible');
                }, 300);

                break;

            }
        }
    }, true);

    // load FxA iframe only after postMessage communication is configured
    $fxaFrame.attr('src', $fxaFrame.data('src'));

    // set a timeout to show FxA (error page, most likely) should the ping event
    // above fail for some reason
    setTimeout(function() {
        if (!fxaHandshake) {
            $fxaFrame.css('height', '400px').addClass('visible');
        }
    }, 2500);
})(window.jQuery);
