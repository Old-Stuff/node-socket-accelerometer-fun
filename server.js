/*global require , __dirname, setInterval, _, clearInterval, Encoder, os */

var app = require('express').createServer(),
    io = require('socket.io').listen(app),
    osc = require('node-osc'),
    client = new osc.Client('0.0.0.0', 3333),
    _ = require('underscore');

app.listen(1337);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

app.get('/*.(js|css|jpg)', function(req, res){
  res.sendfile("./public"+req.url);
});

io.sockets.on('connection', function (socket) {
    
    var interval = setInterval(function(){
        socket.emit('poll', {send: 'it'});
    }, 100);
    
    socket.on('alpha', function (data) {
        client.send("/alpha", data);
    });
    socket.on('beta', function (data) {
        client.send("/beta", data);
    });
    socket.on('gamma', function (data) {
        client.send("/gamma", data);
    });
    socket.on('touch', function (data) {
        _.each(data, function(finger) {
            if (finger.pressed){
                client.send("/" + finger.name + "/position", finger.x, finger.y);
            }
        });
    });
    socket.on('touchOn', function (data) {
        client.send("/" + data + "/state", 1);
    });
    socket.on('touchOff', function (data) {
        client.send("/" + data + "/state", 0);
    });
    socket.on('disconnect', function(){
        clearInterval(interval);
    });
});