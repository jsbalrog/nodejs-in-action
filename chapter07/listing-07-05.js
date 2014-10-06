var http = require('http');
var connect = require('connect');

// A middleware (this time as a function assignment)
var hello = function(req, res) {
	res.setHeader('Content-Type', 'text/plain');
	res.end('hello world');
};

// A middleware (this time as a function declaration
var logger = function(req, res, next) {
	console.log('%s %s', req.method, req.url);
	next();
};

// A middleware for authentication
var restrict = function(req, res, next) {
	var authorization = req.headers.authorization;
	console.log('req.headers: ' + req.headers);
	if(!authorization) return next(new Error('Unauthorized'));

	var parts = authorization.split(' '),
		scheme = parts[0],
		auth = new Buffer(parts[1], 'base64').toString().split(':'),
		user = auth[0],
		pass = auth[1];

	console.log('user: ' + user);
	console.log('pass: ' + pass);

	if('tobi' == user && 'ferret' == pass) {
		next();
	} else {
		next(new Error('Unauthorized'));
	}
};

// A middleware to present an admin panel
var admin = function(req, res, next) {
	switch(req.url) {
		case '/':
			res.end('try /users');
			break;
		case '/users':
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(['tobi', 'loki', 'jane']));
			break;
	}
};

var app = connect()
	.use(logger)
	// When a string is given as the first arg to .use(),
	// Connect will only invoke the middleware when the
	// prefix of 'req.url' matches
	.use('/admin', restrict)
	.use('/admin', admin)
	.use(hello);

http.createServer(app).listen(3000);