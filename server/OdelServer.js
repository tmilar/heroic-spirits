var serverWs = require('websocket').server.listen(8080);
var dateFormat = require('./date.format.js');
var Session = require('./session');
var errorHandler = require('./errorHandler');
var logger = require('./logger');
var messageFactory = require('./messageFactory');
var messageHandler = require('./messageHandler');

var Mazo = require('./mazo');
var Jugador = require('./jugador');


var jugadoresRepository = require('./jugadoresRepository');
var loginModule = require('./loginModule');
var juego = require('./juego');







serverWs.onconnection = function(client) {

    if (juego.mesaLlena()) {

        logger.log("Se conecto un cliente pero la mesa ya esta llena. Conexion rechazada.");
        client.send(messageFactory.msjJuegoComenzado());
        client.close();
    } 
    else {
        logger.log("Se conecto un cliente. Esperando identificacion. ");
        //juego.registrarConexion(client);
    }

    client.onmessage = function(event) {

        var mysocket = this.getWss()._socket;
        var client_ip = mysocket.remoteAddress + ":"+mysocket.remotePort;
        //logger.log("CLIENTE WSS : " + JSON.stringify(mysocket._socket.address() ));
        //logger.log("CLIENTE WSS : " +mysocket._socket.remoteAddress  );
        //logger.log("CLIENTE WSS : " +mysocket._socket.remotePort  );


        logger.log("Mensaje recibido: " + event.data +", del cliente: "+JSON.stringify(mysocket.address()));
        
        messageHandler.procesar(JSON.parse(event.data), this);
    };

    client.onerror = function(event) {
        var sessionCliente;
        if( sessionCliente = this.getWss().session) {
            logger.log("Se desconecto un cliente por un error, sesion: " + sessionCliente.toString());
            juego.desconectarJugador(sessionCliente);
        }
        else
            logger.log("Se desconecto por error, un cliente no identificado.");

    };

    client.onclose = function(event) {
        var sessionCliente;
        if( sessionCliente = this.getWss().session) {
            logger.log("Un cliente cerro la conexion, sesion: " + sessionCliente.toString());
            juego.desconectarJugador(sessionCliente);
        }
        else
            logger.log("Un cliente no identificado cerro la conexion.");
    };
};

logger.log("Iniciado servidor. Esperando conexiones...");