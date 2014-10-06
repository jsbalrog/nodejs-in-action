var http = require('http'),
	connect = require('connect');

// A middleware (this time as a function assignment)
var hello = function(req, res) {
	res.setHeader('Content-Type', 'text/plain');
	res.end('hello world');
};

// A middleware (this time as a function declaration
function logger(req, res, next) {
	console.log('%s %s', req.method, req.url);
	next();
}

var app = connect();
// Wire up the middleware to the app
app.use(logger);
app.use(hello);
http.createServer(app).listen(3000);
