var fs = require('fs');
var http = require('http');
var ecstatic = require('ecstatic')(__dirname + '/public');

http.createServer(function(req, res) {
    if (req.url === '/stations') {
        return res.end(fs.readFileSync('one-station.json', 'utf-8'));
    }
    ecstatic(req, res);
}).listen(8080);
