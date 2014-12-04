var errorHandler = (function(){
	errorStack = [];
	return {
		error: function(msjError){
			errorStack.push(msjError);
			alert(msjError);
			logger.logError(msjError);
		},
		imprimirErrorStack: function(){
			for (var i = errorStack.length - 1; i >= 0; i--) {
				console.log("Err #"+i + ": " +errorStack[i]);
			};
		}
	}
})();
