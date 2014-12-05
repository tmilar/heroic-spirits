var serverWs = require('websocket').server.listen(8080);
var dateFormat = require('./date.format.js');
var Session = require('./session');
var errorHandler = require('./errorHandler');
var logger = require('./logger');
var messageFactory = require('./messageFactory');


var Mazo = require('./mazo');
var Jugador = require('./jugador');


var jugadoresRepository = {

    jugadores: [],

    agregarJugador : function(jugador) {

        if(this.existeJugadorRegistrado(jugador))
            return; 

        logger.log("[JugRepo] se agrego al jugador: "+jugador.getUsername());

        this.jugadores.push(jugador);
        return this.jugadores.length - 1;

    },

    existeJugadorRegistrado: function(jugador){
        return this.jugadores.indexOf(jugador) != -1;
    },

    getPrimerJugador : function() {
        return this.getJugadoresConectados()[0];
    },


    nextJugador : function(current) {
        for(var h = 0; h < this.jugadores.length - 1; h++) {
            if (this.jugadores[h] == current) {
                return this.jugadores[h + 1];
            }
        }

        return this.primerJugador();
    },

    getJugadores : function() {
        return jugadores;
    },

    getCantidadJugadores : function() {
        return this.jugadores.length;
    },

    quitarJugador : function(sessionJugador) {
         for(var h = 0; h < this.jugadores.length; h++) {
            if (this.jugadores[h].session._id == sessionJugador._id) {
                this.jugadores.splice(h,1);
                return;
            }
        }
        
    },

    getJugadoresConectados: function(){
        var conectados = [];
        for (var i = 0; i < this.jugadores.length; i++) {
           if(this.jugadores[i].estaConectado()){
                conectados.push(this.jugadores[i]);
            }

        };
        return conectados;
    },

    getCantidadJugadoresConectados: function () {
        return this.getJugadoresConectados().length;
    },

    desconectarJugador: function (sessionJugador){

        for (var i = 0; i < this.jugadores.length; i++) {
             if(this.jugadores[i].getId() == sessionJugador._id){
                this.jugadores[i].desconectar();
             }
         }; 

    },
    getJugador: function (sessionData) {
        var conectados = this.getJugadoresConectados();
        for (var i = 0; i < conectados.length; i++) {
            if(conectados[i].session._id === sessionData._id){
                return conectados[i];
            }
        };
        return null;
    },
}

var juego = {

    //esperandoJugadores: true,    
    //juegoEmpezado: false,
    currentJugador: null,


    mesaLlena : function() {
        return jugadoresRepository.getCantidadJugadoresConectados() > 1;
    },

    agregarJugador : function(jugador) {

        jugadoresRepository.agregarJugador(jugador);

        var jugadoresConectados = jugadoresRepository.getCantidadJugadoresConectados();
        logger.log("Jugador "+jugador.getUsername()+ " agregado a la mesa. Total de conectados: "+jugadoresConectados + ". ")
        
        if(this.mesaLlena()){
            logger.log("Se lleno la mesa! Hay "+jugadoresConectados + " conectados." );
            //this.esperandoJugadores = false;
            this.broadcast(messageFactory.msjMesaLlena());
        }

    },

    desconectarJugador : function(sessionJugador) {
        jugadoresRepository.desconectarJugador(sessionJugador);

        if (!this.mesaLlena()) {
            logger.log("No hay suficientes jugadores para llenar la mesa...");
            return ;
        }
        
    },

    iniciarJuego: function(){

        var jugadoresConectados = jugadoresRepository.getJugadoresConectados();

        if(!this.mesaLlena()){
            errorHandler.error("No se puede empezar el juego, apenas hay "+ jugadoresConectados.length + "jugadores conectados! ");
            return;
        }

        this.broadcast(messageFactory.msjIniciarJuego());

        for (var i = 0; i < jugadoresConectados.length; i++) {
            var CARTAS_MANO_INICIAL = 7;
            jugadoresConectados[i].robarCartas(CARTAS_MANO_INICIAL);
        };

        this.currentJugador = jugadoresRepository.getPrimerJugador();
        //...... ceder turno al jugador currentJugador ..............
    },

    broadcast : function(mensaje) {
        logger.log("Broadcasting: "+mensaje +".-");

        var conectados = jugadoresRepository.getJugadoresConectados();

        for(var h = 0; h < conectados.length; h++) {
            conectados[h].send(mensaje);
        }
    },

    robarCartas: function (sessionJugador, cantidad) {
        var jugador = jugadoresRepository.getJugador(sessionJugador);

        if(!jugador){
            errorHandler.error("Jugador no identificado correctamente! No puede robar cartas.");
            return;
        }

        jugador.robarCartas(cantidad);
    }
}

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

}




var messageHandler = (function(){

    return {
        procesar: function(msj, client){

            switch(msj.operacion){
                case "iniciarJuego":
                    logger.log("El cliente "+ msj.session.username + " empezo la partida");
                    juego.iniciarJuego();
                    break;
                case "conectarJugador":
                    //logger.log("Jugador identificado como: "+ JSON.stringify(msj.datosLoginJugador) + " se conecto! ");
                    
                    var jugador = loginModule.login(msj.datosLoginJugador, client);
                    if(jugador)
                        juego.agregarJugador(jugador);
                    break;
                case "robarCartas":
                    logger.log("El cliente "+ msj.session.username + " quiere robar "+ msj.cantidad + " cartas.");

                    juego.robarCartas(msj.session, msj.cantidad);
                    break;
                default: 
                    errorHandler.error("Llego un msj equivocado: '"+msj.operacion+"'.");
            }
        }
    }

})();

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
        logger.log("Se desconecto un cliente por un error, sesion: " + this.getWss().session.toString());

        juego.desconectarJugador(this.getWss().session);

    };

    client.onclose = function(event) {
        logger.log("Un cliente cerro la conexion, sesion: " + this.getWss().session.toString());
        juego.desconectarJugador(this.getWss().session);

    };
};

logger.log("Iniciado servidor. Esperando conexiones...");