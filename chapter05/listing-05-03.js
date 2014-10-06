var http = require('http'),
	work = require('./lib/timetrack'),
	sqlite = require('sqlite3');

var server = http.createServer(function(req, res) {
	switch(req.method) {
		case 'POST':
		switch(req.url) {
			case '/':
			work.add(db, req, res);
			break;

			case '/archive':
			work.archive(db, req, res);
			break;

			case 'delete':
			work.delete(db, req, res);
			break;
		}
		break;

		case 'GET':
		switch(req.url) {
			case '/':
			work.show(db, res);
			break;

			case '/archived':
			work.showArchived(db, res);
		}
		break;
	}
});

var db = new sqlite.Database('timetrack.sqlite', function() {
	db.run(
	"CREATE TABLE IF NOT EXISTS work (" + 
		"id INTEGER PRIMARY KEY, " + 
		"hours REAL DEFAULT 0, " + 
		"date TEXT, " + 
		"archived INTEGER DEFAULT 0, " + 
		"description TEXT)",
	function(err) {
		if (err) throw err;
			console.log('Server started...');
			server.listen(3000, '127.0.0.1');
		}
	);
});