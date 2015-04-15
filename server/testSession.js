var Session = require('./session');
var logger = require('./logger');


var datosSession = {username: "pepe", ip: "1234.12.1.1",  client: "hola soy un cliente"};
var nuevaSession = new Session(datosSession);
logger.log(nuevaSession);
logger.log(JSON.stringify(nuevaSession));