var TruePromise = require('../lib/truepromise');


var myAsyncWork = function (completionCallback) {
	setTimeout(function () {
		console.log('work completed');
		completionCallback();
	}, 4000);
};

(function () {
	console.log('starting work');
	var myworkPromise = new TruePromise(function (resolve, reject) {
		myAsyncWork(function () {
			resolve('work completed');
			//reject('work completed');
		});
	});

	myworkPromise.then(function () {
		console.log('completion of work trapped');
	}, function () {
		console.log('failure trapped');
	});
})();
