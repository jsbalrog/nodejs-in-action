/*
 * Demonstrates using node to handle static file serving.
 */
var http = require('http'),
    parse = require('url').parse,
    join = require('path').join,
    fs = require('fs');

var root = __dirname;

var server = http.createServer(function (req, res) {
    var url = parse(req.url);
    var path = join(root, url.pathname);
    var stream = fs.createReadStream(path);
    // stream.on('data', function(chunk) {
        // res.write(chunk);
    // });
    // stream.on('end', function () {
        // res.end();
    // });
    // stream.pipe() is a higher-level mechanism for doing the
    // same thing 
    stream.pipe(res);
    // Register an 'error' event handler on the fs.ReadStream
    stream.on('error', function(err) {
        res.statusCode = 500;
        res.end('Internal Server Error');
    });
});

server.listen(3000);