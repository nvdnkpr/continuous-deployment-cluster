var seaport = require('seaport');
var airport = require('airport');

var ports = seaport(process.env.COMMIT).connect('localhost', 6000);
var air = airport(ports);

air(function (remote, conn) {
    this.say = function (url, cb) {
        cb(url.slice(1) + ' ALL HUMANS');
    };
}).listen('say');
