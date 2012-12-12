/*global jQuery, io, window  */

var ifjs = ifjs || {};

(function () {
    'use strict';
    ifjs.model = {
        tilt: {
            alpha: 0,
            beta: 0,
            gamma: 0
        }
    };
    
    ifjs.socket = io.connect('http:/basestation.local:1337');
    
    ifjs.sendTilt = function() {
        ifjs.socket.emit('alpha', ifjs.model.tilt.alpha);
        ifjs.socket.emit('beta', ifjs.model.tilt.beta);
        ifjs.socket.emit('gamma', ifjs.model.tilt.gamma);
    };
    

    ifjs.accel = window.addEventListener("deviceorientation", function(event) {
        // Update model with events
        ifjs.model.tilt.alpha = event.alpha;
        ifjs.model.tilt.beta = event.beta;
        ifjs.model.tilt.gamma = event.gamma;
    }, true);
}(jQuery));