
var Jugador = require('./jugador');
var errorHandler = require('./errorHandler');
var messageFactory = require('./messageFactory');
var logger = require('./logger');

var loginModule = {

    //valida Login contra BD
    login: function(loginData, client){
        var jugador = new Jugador();
        var session = jugador.iniciarSesion(loginData, client);

        if(!session){ 
            errorHandler.error("No se pudo iniciar sesion de: "+ JSON.stringify(loginData));
            client.send(messageFactory.msjLoginInvalido());
            return null;
        } 
        //loginData.client.getWss().session = session;
        //logger.log("ANTES registrabamos la session asi y el resultado era: "+ loginData.client.getWss().session + ".. \n");
        
        client.getWss().session = session;
        logger.log("Jugador "+client.getWss().session.username+" bienvenido, sesion iniciada correctamente!");

        jugador.send(messageFactory.msjConexionAutorizada(session));
        return jugador;
    }

};

module.exports = loginModule;