var mongoose = require('mongoose'),
	db = mongoose.connect('mongodb://localhost/tasks');

var Schema = mongoose.Schema;
var Tasks = new Schema({
	project: String,
	description: String
});

mongoose.model('Task', Tasks);

var Task = mongoose.model('Task');
var task = new Task();
task.project = 'Bikeshed';
task.description = 'Paint the bikeshed red.';
task.save(function(err) {
	if(err) throw err;
	console.log('Task saved');
});