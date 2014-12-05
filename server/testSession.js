var Session = require('session');


var datosSession = {username: "pepe", ip: "1234.12.1.1",  client: "hola soy un cliente"}
var nuevaSession = new Session(datosSession);

require('logger').log(nuevaSession);
require('logger').log(JSON.stringify(nuevaSession));