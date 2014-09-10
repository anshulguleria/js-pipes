//can escalate it to contain multiple targetfn

/**
 * adds targetfn call before fn
 */
var before = function(targetfn, fn) {
	return function() {
		targetfn.apply(this, arguments);
		return fn.apply(this, arguments);
	};
};

/**
 * adds targetfn call after the call to fn.
 * passes the return of fn to targetfn
 */
var after = function(fn, targetfn) {
	return function() {
		var result = fn.apply(this, arguments);
		targetfn.call(this, result);
		return result;
	};
};

/**
 * wraps the fn with targetfn
 */
var wrap = function(fn, targetfn) {
	return function() {
		targetfn.apply(this, [fn].concat(Array.prototype.slice.call(arguments)));
	};
};


/**
 * we might need to mix these 3 scenarios in our pipe
 */

//as an example caching module needs wrapper
//where as analytics needs AOP(before/after) only
