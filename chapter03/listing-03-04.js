function doSomething () {
	return true;
}

function asyncFunction (err, success) {
	if(doSomething()) {
		success();
	} else {
		err();
	}
}

asyncFunction(
	function () { console.log('I handle failure.'); },
	function () { console.log('I handle success.'); }
);