/**
 * This is simple implementation of RSVP Promises as I know.
 * It dosen't support complex features like promise chaining, etc.
 * Basic functionalities like reject and resolve are supported.
 */


var TruePromise = function (initiator) {
	this._subscribers = [];
	this.state = 'preInitialize';
	setTimeout(function () {
		this._initiate(initiator);
	}.bind(this));
};

/**
 * public functions
 */

TruePromise.prototype.resolve = function (response) {
	if(this.state !== 'inProgress') {
		throw("Can't resolve already completed promise");
	}
	this.state = 'isResolved';
	this._notifySubscribers();
};

TruePromise.prototype.reject = function (reason) {
	if(this.state !== 'inProgress') {
		throw("Can't reject already completed promise");
	}
	this.state = 'isRejected';
	this._notifySubscribers();
};

TruePromise.prototype.then = function (successCallback, failureCallback) {
	var length = this._subscribe(successCallback, failureCallback);
	var subsFunction = this._subscribers[length -1];
	if(this.state === 'isRejected' || this.state === 'isResolved') {
		//i.e. promise had already been completed
		//call the subscribed function explicitly
		//as resolve won't be called later on.
		subsFunction();
	}
};

/**
 * private functions
 */
TruePromise.prototype._subscribe = function (successCallback, failureCallback) {
	//returns a function which checks `state` and calls appropriate
	//callbacks
	var fnToSubscribe = function () {
		if(this.state === 'inProgress') {
			//i.e. false call.
			//Subscribers should not have been triggered if promise is still in progress.
			throw('Promise not complete yet');
		} else if(this.state === 'isResolved' && typeof(successCallback) === 'function') {
			successCallback(this.response);
		} else  if(this.state === 'isRejected' && typeof(failureCallback) === 'function') {
			failureCallback(this.reason);
		} else {
			//throw error if some problem occours which is not expected
			throw('Invalid state of promise');
		}
	}.bind(this);
	this._subscribers.push(fnToSubscribe);
	return this._subscribers.length;
};

//notifies all the registered subscribers.
TruePromise.prototype._notifySubscribers = function () {
	if(this._subscribers.length) {
		this._subscribers.forEach(function(fn) {
			fn();
		}, this);
	};
};

//called from constructor to initiate the promise
TruePromise.prototype._initiate = function (initiator) {
	this.state = 'inProgress';
	//provide reject and resolve functions for
	//the use
	initiator(this.resolve.bind(this), this.reject.bind(this));
};


module.exports = TruePromise;
