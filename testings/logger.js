/*
var logger = {

	logInfo: function(string){
		console.log("[INFO]["+new Date()+"] : " + string);
	},
	log: this.logInfo,
	logError: function(string){
		console.log("[ERROR]["+new Date()+"] : "+string);
	},
	logHtml: function(string){		
		$("#log").prepend("<p>"+string+"</p>");
	}
}

module.exports = logger;
*/
//dateFormat = require('date.format.js');

(function(module){

	var getDateTime = function () {
		var d = new Date();
		//return dateFormat(d, " dd/mm/yyyy HH:MM:ss ");
		return dateFormat(d, "HH:MM:ss");
	}

	var logger = {


		logInfo: function(string){
			console.log("[INFO]["+getDateTime()+"] : " + string);
		},
		log: function(string) {	
			this.logInfo(string);
		},
		logError: function(string){
			console.log("[ERROR]["+getDateTime()+"] : "+string);
		},
		logHtml: function(string){		
			$("#log").prepend("<p>"+string+"</p>");
		}
	}

   module.exports = logger;

})(typeof module === 'undefined'? this['logger']={}: module);


	var getDateTime = function () {
		var d = new Date();
		//return dateFormat(d, " dd/mm/yyyy HH:MM:ss ");
		return dateFormat(d, "HH:MM:ss");
	}

	var logger = {


		logInfo: function(string){
			console.log("[INFO]["+getDateTime()+"] : " + string);
		},
		log: function(string) {
			this.logInfo(string);
		},
		logError: function(string){
			console.log("[ERROR]["+getDateTime()+"] : "+string);
		},
		logHtml: function(string){		
			$("#log").prepend("<p>"+string+"</p>");
		}
	}