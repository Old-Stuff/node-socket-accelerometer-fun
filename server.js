/*global require , __dirname, setInterval, _, clearInterval, Encoder, os */

var app = require('express').createServer(),
    io = require('socket.io').listen(app),
    osc = require('node-osc'),
    client = new osc.Client('0.0.0.0', 3333),
    mdns = require('mdns');
    _ = require('underscore'),
    Encoder = require('qr').Encoder,
    os = require('os'),
    exec = require('child_process').exec;

app.listen(1337);

var encoder = new Encoder,
    ifaces = os.networkInterfaces(),
    ip = '',
    chil;

for (var dev in ifaces) {
  var alias=0;
  ifaces[dev].forEach(function(details){
    if (details.family=='IPv4') {
        if (dev == "en1")
        {
            ip = details.address;
        }
    }
  });
}

if (ip != ""){
    encoder.encode("http://" + ip + ":1337", 'currentIP.png',{
        dot_size: 12
    });
    child = exec('openimage.sh',
      function (error, stdout, stderr) {
        //console.log('stdout:', stdout);
        //console.log('stderr:', stderr);
        //if (error !== null) {
        //  console.log('exec error:', error);
        //}
    });
}

// advertise a http server on port 1337
var ad = mdns.createAdvertisement(mdns.tcp('http'), 1337);
ad.start();

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
