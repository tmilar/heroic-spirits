
logger = require('./logger');

var errorHandler = (function(){
	errorStack = [];
	return {
		error: function(msjError){

			var errObj = {name: "BusinessError", message: msjError};
			errorStack.push(errObj);
			logger.logError(errObj);
		},
		imprimirErrorStack: function(){
			for (var i = errorStack.length - 1; i >= 0; i--) {
				console.log("Err #"+i + ": " +errorStack[i]);
			}
		}
	}
})();

module.exports = errorHandler;


/*
(function(module){

	var errorHandler = (function(){
		errorStack = [];
		return {
			error: function(msjError){
				errorStack.push(msjError);
				//alert(msjError);
				logger.logError(msjError);
			},
			imprimirErrorStack: function(){
				for (var i = errorStack.length - 1; i >= 0; i--) {
					console.log("Err #"+i + ": " +errorStack[i]);
				};
			}
		}
	})();

	module.exports = errorHandler;


})(typeof module === 'undefined'? this['logger']={}: module);
*/