/*global jQuery, io, console, socket, window */

var iface = iface || {};

(function ($) {
    'use strict';
    // Set up the socket 
    iface.model = {
        tilt: {
            alpha : 0,
            beta: 0,
            gamma: 0
        }
    }
    
/*    iface.touchdiv = document.getElementById('touch');
    iface.touches = [];
    iface.touchdiv.addEventListener('touchmove', function(event){
        iface.touches = event.targetTouches;
    });*/
    
    iface.socket = io.connect('http://192.168.1.101:1337');
    
    iface.socket.on('poll', function(data){
        iface.socket.emit('alpha', iface.model.tilt.alpha);
        iface.socket.emit('beta', iface.model.tilt.beta);
        iface.socket.emit('gamma', iface.model.tilt.gamma);
    });
    
    iface.accel = window.addEventListener("deviceorientation", function(event) {
        // process event.alpha, event.beta and event.gamma
        iface.model.tilt.alpha = event.alpha;
        iface.model.tilt.beta = event.beta;
        iface.model.tilt.gamma = event.gamma;
    }, true);
}(jQuery));