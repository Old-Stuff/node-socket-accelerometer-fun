/*global document, setInterval, console, window, jQuery */

var touch = touch || {};

(function ($) {
    
    $(function(){
        touch.canvas = document.getElementById('canvas');
        touch.ctx = touch.canvas.getContext('2d');
        touch.timer = setInterval(touch.update, 15);
        touch.touches = [];
        touch.colors = ["rgba(0, 0, 200, 0.2)", "rgba(0, 200, 0, 0.2)", "rgba(200, 0, 0, 0.2)", "rgba(0, 200, 200, 0.2)", "rgba(200, 200, 0, 0.2)"];
        touch.count = 0;

        touch.canvas.addEventListener('touchend', function() {
            touch.ctx.clearRect(0, 0, w, h);
            touch.count = touch.count - 1;
            if(touch.count === 0) {
                touch.touches = [];
            }
        });

        touch.canvas.addEventListener('touchmove', function(event) {
          event.preventDefault();
          touch.touches = event.touches;
        });

        touch.canvas.addEventListener('touchstart', function(event) {
          console.log('start');
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
            
            touch.ctx.fillStyle = touch.colors[i];
            touch.ctx.fill();

            touch.ctx.lineWidth = 2.0;
            touch.ctx.strokeStyle = "rgba(0, 0, 200, 0.8)";
            touch.ctx.stroke();
/*            console.log('drawn circle at ' + px +',' + py);*/
        }

        updateStarted = false;
    };
}(jQuery));