var asyncFunction = function(callback) {
	setTimeout(function() {
		callback();
	}, 0);
}

var color = 'blue';

(function(color) { // color becomes local to the scope of this anonymous function
	asyncFunction(function() {
		console.log('The color is ' + color);
	});
})(color);

// Interpreter evaluates this line before the callback function runs
color = 'green'; // The local version of color inside the scope of the anonymous function is unaffected.
