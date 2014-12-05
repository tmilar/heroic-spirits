var cid_generator = require('./cid_generator');



var Session = function (datosLogin, client) {
	this.username = datosLogin.username;
	this.ip = datosLogin.ip;
	this._id = cid_generator.next();
	this.client = client;

	this.state = "OPENED";

	this.toString = function () {
		return "[User: "+ this.getUsername() +", session_id: " +this.getId()+"]";
	};

	this.getId = function(){
		return this._id;
	};

	this.isClosed= function(){
		return this.state == "CLOSED";
	};

	this.getUsername = function () {
		return this.username;
	};

	this.cerrar = function(){
		this.state = "CLOSED";
		this.client.close();
	};

	this.send = function(msj){
		this.client.send(msj);	
	}


}
/*
(function(exports){

   var Session = Export_Session;

   exports = Session;

})(typeof exports === 'undefined'? this['session']={}: exports);*/


module.exports = Session;
