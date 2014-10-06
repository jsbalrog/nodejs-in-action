/*
 * Demonstrates using node to handle static file serving.
 * With better error handling.
 */
var http = require('http'),
    parse = require('url').parse,
    join = require('path').join,
    fs = require('fs');

var root = __dirname;

var server = http.createServer(function (req, res) {
    var url = parse(req.url);
    var path = join(root, url.pathname);

    // fs.stat() returns either an object or an error
    fs.stat(path, function(err, stat) {
        if(err) {
            if('ENOENT' == err.code) {
                res.statusCode = 404;
                res.end('Not Found');
            } else {
                res.statusCode = 500;
                res.end('Internal Server Error');
            }
        } else {
            res.setHeader('Content-Length', stat.size);
            var stream = fs.createReadStream(path);
            // stream.on('data', function(chunk) {
                // res.write(chunk);
            // });
            // stream.on('end', function () {
                // res.end();
            // });
            stream.pipe(res);
            // Register an 'error' event handler on the fs.ReadStream
            stream.on('error', function(err) {
                res.statusCode = 500;
                res.end('Internal Server Error');
            });
        }
    });
});

server.listen(3000);