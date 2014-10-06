// Example of file upload handling by node.
var http = require('http');
var formidable = require('formidable');

var server = http.createServer(function(req, res) {
	switch(req.method) {
		case 'GET':
			show(req, res);
			break;
		case 'POST':
			upload(req, res);
			break;
	}
}).listen(3000);

function show (req, res) {
	var html = ''
		+ '<form method="post" action"/" enctype="multipart/form-data">'
		+ '<p><input type="text" name="name" /></p>'
		+ '<p><input type="file" name="file" /></p>'
		+ '<p><input type="submit" value="Upload" /></p>'
		+ '</form>';
	res.setHeader('Content-Type', 'text/html');
	res.setHeader('Content-Length', Buffer.byteLength(html));
	res.end(html);
}

function upload (req, res) {
	// respond with 400 "bad request" when the request does not appear
	// to be the appropriate type of content.
	if(!isFormData(req)) {
		res.statusCode = 400;
		res.end('Bad Request: expecting multipart/form-data');
		return;
	}

	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		console.log(fields);
		console.log(files);
		res.end('upload complete!');
	});

	form.on('progress', function(bytesReceived, bytesExpected) {
		var percent = Math.floor(bytesReceived / bytesExpected * 100);
		console.log(percent);
	});
}

function isFormData (req) {
	var type = req.headers['content-type'] || '';
	return 0 == type.indexOf('multipart/form-data');
}