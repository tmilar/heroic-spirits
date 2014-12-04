var serverWs = require('websocket').server.listen(8080);
var dateFormat = require('date.format.js');
var Session = require('session');
var errorHandler = require('errorHandler').getErrorHandler();
var logger = require('logger').getLogger();
var Jugador = require('jugador');

var jugadoresRepository = {

    jugadores: [],

    agregarJugador : function(client) {
        this.jugadores.push(client);

        return this.jugadores.length - 1;
    },

    primerJugador : function() {
        return this.jugadores[0];
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
        var conectados = []
        for (var i = 0; i < this.jugadores.length; i++) {
            if(this.jugadores[i].estaConectado()){
                conectados.push(this.jugadores[i]);
            }
        };

        return conectados;
    },

    desconectarJugador: function (jugador){
        for (var i = 0; i < this.jugadores.length; i++) {
             if(this.jugadores[i] == jugador){
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

    esperandoJugadores: true,    
    currentJugador: null,


    isEsperandoJugadores : function() {
        return this.esperandoJugadores;
    },

    agregarJugador : function(jugador) {

        jugadoresRepository.agregarJugador(jugador);

        if(jugadoresRepository.getCantidadJugadores() > 1){
            this.esperandoJugadores = false;
        }
    },

    quitarJugador : function(jugador) {
        jugadoresRepository.quitarJugador(jugador);

        if (this.jugadores.getCantidadJugadores() <= 0 && !this.isEsperandoJugadores()) {
            logger.log("No quedan jugadores, Reiniciando el juego...");
            this.esperandoJugadores = true;
            return 
        }
        
    },

    iniciarJuego: function(){
        if(this.esperandoJugadores){
            errorHandler.error("No se puede empezar el juego, apenas hay "+ jugadores.length + "jugadores! ");
            return;
        }

        this.broadcast(messageFactory.msjIniciar());

        var jugadores = jugadoresRepository.getJugadoresConectados();

        for (var i = 0; i < jugadores.length; i++) {
            var CARTAS_MANO_INICIAL = 7;
            jugadores[i].robarCartas(CARTAS_MANO_INICIAL);
        };


    },

    broadcast : function(mensaje) {
        logger.log("Broadcasting: "+mensaje ".-");

        for(var h = 0; h < this.jugadores.length; h++) {
            this.jugadores[h].send(mensaje);
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
    login: function(loginData){
        var jugador = new Jugador();
        var session = jugador.iniciarSesion(loginData);

        if(!session){ 
            errorHandler.error("No se pudo iniciar sesion de: "+loginData);
            loginData.client.send(messageFactory.msjLoginInvalido());
            return null;
        } 

        loginData.client.getWss().session = session;
        jugador.send(messageFactory.msjConexionAutorizada(session));
        return jugador;
    }

}
var messageFactory = {

    msjIniciarJuego: function(){
        return{
            JSON.stringify({
                    operacion: "iniciarJuego"
                });
        }
    },


    msjConexionAutorizada: function(){
        return(
            JSON.stringify({
                    operacion: "respuestaConexion",
                    datosSession: datosSession
                });
        }
    },

    msjLoginInvalido: function(datosSession){
        return{
            JSON.stringify({
                    operacion: "respuestaConexion",
                    datosSession: null,
                    mensaje: "No se pudo validar el login. Vuelva a intentarlo."
                });
        }
    },

    msjBajarCarta: function(autorizado){
        return{
            JSON.stringify({
                operacion: "bajarCarta",
                autorizado: autorizado
            })
        }
    },
    msjRobarCartas: function(cartas, cartasRestantesMazo){
        return{
            JSON.stringify({
                    operacion: "robarCartas",
                    cartas: cartas,
                    cartasRestantesMazo: cartasRestantesMazo
                });
        }
    },

    msjJuegoComenzado: function(){
        return{
            JSON.stringify({
                operacion: "respuestaConexion",
                datosSession: null, 
                mensaje: "El juego ya comenzo! No se puede ingresar."
            })
        }
    }

}

var messageHandler = (function(){

    return {
        procesar: function(msj){
            /*
                if (!juego.isEsperandoJugadores()) {
                    juego.recibirMensajeRespuesta(this, event);
                } else {
                    juego.recibirMensajeInicio(this, event);
                }*/

            switch(msj.operacion){
                case "iniciarJuego":
                    logger.log("El cliente "+ msj.session.username + " empezo la partida");


                    juego.iniciarJuego();
                    break;
                case "conectarJugador":
                    logger.log("El cliente "+ msj.datosLoginJugador.username + " se conecto!");
                    
                    var jugador = loginModule.login(msj.datosLoginJugador);
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

}();

serverWs.onconnection = function(client) {
    if (!juego.isEsperandoJugadores()) {

        client.send(messageFactory.msjJuegoComenzado());
        client.close();
    } else {
        logger.log("Se conecto un cliente: "+client);

    }

    client.onmessage = function(event) {
        console.log(event.data);

        logger.log("Mensaje recibido: " + event +", del cliente: "+this);
        event.data.client = client;
        messageHandler.procesar(event.data);
    };

    client.onerror = function(event) {
        console.log("Cliente desconectado id:" + this.getWss().session.toString());

        juego.quitarJugador(this.getWss().session);

    };

    client.onclose = function(event) {
        console.log("Cliente desconectado id:" + this.getWss().session.toString());
        juego.quitarJugador(this.getWss().session);

    };
};


