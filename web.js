var seaport = require('seaport');
var airport = require('airport');

var ports = seaport(process.env.COMMIT).connect('localhost', 6000);
var air = airport(ports);
var up = air.connect('say');

var http = require('http');

var server = http.createServer(function (req, res) {
    if (req.url === '/') res.end('beep boop\r\n');
    else up(function (remote) {
        remote.say(req.url, function (msg) {
            res.end(msg);
        });
    });
});

ports.service('http', function (port, ready) {
    server.listen(port, ready);
});
