/*
Interface.js

Primarily written by Myles Borins
Touch stuffs influenced by MagicTouch by Boris Smus
found at https://github.com/borismus/MagicTouch

Interface.js is distributed under the terms the MIT or GPL2 Licenses. 
Choose the license that best suits your project. The text of the MIT and GPL 
licenses can be found in the root directory. 

*/

/*global document, setInterval, window, jQuery */

var touch = touch || {};

(function ($) {
    
    $(function(){
        touch.num2word = ['one', 'two', 'three', 'four', 'five'];
        
        touch.model = {
            one: {
                name: 'one',
                pressed: false,
                x: 0,
                y: 0
            },
            two: {
                name: 'two',
                pressed: false,
                x: 0,
                y: 0
            },
            three: {
                name: 'three',
                pressed: false,
                x: 0,
                y: 0
            },
            four: {
                name: 'four',
                pressed: false,
                x: 0,
                y: 0
            },
            five: {
                name: 'five',
                pressed: false,
                x: 0,
                y: 0
            }
        };

        touch.canvas = document.getElementById('canvas');
        touch.ctx = touch.canvas.getContext('2d');
        touch.timer = setInterval(touch.update, 15);
        touch.touches = [];
        touch.colors = ["rgba(0, 0, 200, 0.2)", "rgba(0, 200, 0, 0.2)", "rgba(200, 0, 0, 0.2)", "rgba(0, 200, 200, 0.2)", "rgba(200, 200, 0, 0.2)"];
        touch.count = 0;

        touch.canvas.addEventListener('touchend', function() {
            touch.ctx.clearRect(0, 0, w, h);
            touch.count = touch.count - 1;
            if (touch.count < 5){
                touch.model[touch.num2word[touch.count]].pressed = false;
            }
            if(touch.count === 0) {
                touch.touches = [];
            }
        });

        touch.canvas.addEventListener('touchmove', function(event) {
          event.preventDefault();
          touch.touches = event.touches;
        });

        touch.canvas.addEventListener('touchstart', function(event) {
          touch.touches = event.touches;
          if (touch.count < 5){
              touch.model[touch.num2word[touch.count]].pressed = true;
          }
          touch.count = touch.count + 1;
        });
    });
    
    var w = 0;
    var h = 0;

    var updateStarted = false;


    touch.update = function() {
        if (updateStarted) return;
        updateStarted = true;

        var nw = window.innerWidth;
        var nh = window.innerHeight;

        if ((w != nw) || (h != nh)) {
            w = nw;
            h = nh;
            touch.canvas.style.width = w+'px';
            touch.canvas.style.height = h+'px';
            touch.canvas.width = w;
            touch.canvas.height = h;
        }

        touch.ctx.clearRect(0, 0, w, h);

        var i, len = touch.touches.length;

        for (i=0; i<len; i++) {
            var t = touch.touches[i];
            var px = t.pageX;
            var py = t.pageY;

            touch.ctx.beginPath();
            touch.ctx.arc(px, py, 50, 0, 2*Math.PI, true);
            if (i < 5){
                touch.model[touch.num2word[i]].x = px;
                touch.model[touch.num2word[i]].y = py;
            }

            touch.ctx.fillStyle = touch.colors[i];
            touch.ctx.fill();

            touch.ctx.lineWidth = 2.0;
            touch.ctx.strokeStyle = "rgba(0, 0, 200, 0.8)";
            touch.ctx.stroke();
        }

        updateStarted = false;
    };
}(jQuery));