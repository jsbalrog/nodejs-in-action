var http = require('http'),
		url = require('url'),
		items = [],
		server = http.createServer(function(req, res) {
			switch(req.method) {
				case 'POST':
					var item = '';
					req.setEncoding('utf8');
					req.on('data', function(chunk) {
						item += chunk;
					});
					req.on('end', function() {
						items.push(item);
						res.end('OK\n');
					});
				break;
				case 'GET':
					// items.forEach(function(item, i) {
					// 	res.write(i + ') ' + item + '\n');
					// });
					var body = items.map(function(item, i) {
						return i + ') ' + item;
					}).join('\n');
					res.setHeader('Content-Length', Buffer.byteLength(body));
					res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
					res.end(body);
				break;
				case 'DELETE':
					var path = url.parse(req.url).pathname;
					var i = parseInt(path.slice(1), 10);
					if(isNaN(i)) {
						res.statusCode = 400;
						res.end('Invalid item id');
					} else if(!items[i]) {
						res.statusCode = 404;
						res.end('Item not found');
					} else {
						items.splice(i, 1); // delete the requested item
						res.end('OK\n');
					}
				break;
			}
		});
server.listen('3000', '127.0.0.1');