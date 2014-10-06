var fs = require('fs'),
	path = require('path'),
	args = process.argv.splice(2),
	command = args.shift(),
	taskDescription = args.join(' '),
	file = path.join(process.cwd(), '/.tasks');

switch(command) {
	case 'list':
	listTasks(file);
	break;

	case 'add':
	addTask(file, taskDescription);
	break;

	default:
	console.log('Usage: ' + process.argv[0] + ' ' + process.argv[1] + ' list|add [taskDescription]');
}

function listTasks(file) {
	// Call getTasks, passing a function that prints our the tasks as a callback.
	getTasks(file, function(tasks) {
		for(var i in tasks) {
			console.log(tasks[i]);
		}
	});
}

function addTask(file, taskDescription) {
	// Call getTasks, passing a function as a callback that adds
	// the new task to the array and then stores the task to disk.
	getTasks(file, function(tasks) {
		tasks.push(taskDescription);
		fs.writeFile(file, JSON.stringify(tasks), 'utf8', function(err) {
			if(err) throw err;
			console.log(taskDescription + ' saved.');
		});
	});
}

/**
 * Used by listTasks and addTask to retrieve the current task file
 * from the filesystem. Takes a filename and a callback function.
 * If file exists, the tasks are retrieved from the file and passed
 * as an array to the callback function. If file does not exist,
 * an empty array is passed to the callback function.
 */
function getTasks(file, cb) {
	fs.exists(file, function(exists) {
		var tasks = [];
		if(exists) {
			fs.readFile(file, 'utf8', function(err, data) {
				if(err) throw err;
				data = data.toString();
				var tasks = JSON.parse(data);
				cb(tasks);
			});
		} else {
			cb([]);
		}
	});
}