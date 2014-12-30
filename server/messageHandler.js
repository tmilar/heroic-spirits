var logger = require('./logger');
var juego = require('./juego');
var errorHandler = require('./errorHandler');
var loginModule = require('./loginModule');
var jugadoresRepository = require('./jugadoresRepository');

var messageHandler = (function(){

    //private
    var loginJugador = function (msj, client) {
        
        var jugadorLogueado = null; 

        try{
             jugadorLogueado = loginModule.login(msj.datosLoginJugador, client);
 

        }catch(e){
            logger.logError(e);
            if(e.name === "JugadorLoginError") {
                client.send(messageFactory.msjErrorLogin(e));
                throw e;
            }
        } finally {
            return jugadorLogueado;
        }
    }

    //private
    var identificarJugador = function (msj) { 
 
        var conectados = jugadoresRepository.getJugadoresConectados();
 
        var jugador = jugadoresRepository.getJugador(msj.session);
        if(!jugador)
            throw { 
                name: "JugadorNoIdentificadoError", 
                message: "No se pudo identificar al jugador: "+ msj.session.username+", que mando msj: "+msj
            }

        return jugador;
    }

    var identificarOLoggear = function(msj, client) {
        var jugador = null;

        if(msj.operacion==="conectarJugador")
            jugador = loginJugador(msj, client);


        if(!jugador) { 
            jugador = identificarJugador(msj);

        }

        return jugador;
    }


    var iniciarJuego = function (jugador) {
        logger.log("El jugador "+ jugador.getUsername() + " empezo la partida");
        juego.iniciarJuego();
    }

    var conectarJugador = function (jugadorLogueado) {
        juego.agregarJugador(jugadorLogueado);
  
    }


    var robarCartas = function (jugador, msj) {

        logger.log("El jugador "+ jugador.getUsername() + " quiere robar "+ msj.cantidad + " cartas.");

        juego.robarCartas(jugador, msj.cantidad);
    }

    var bajarCarta = function (jugador, msj) {

        var cartaInfo = Carta(msj.cartaId);
        logger.log("El jugador "+  jugador.getUsername() + " bajo carta "+ cartaInfo.nombre);
        juego.bajarCarta(jugador, cartaInfo);
    }

    var resolver = {
        iniciarJuego: iniciarJuego,
        conectarJugador: conectarJugador,
        robarCartas: robarCartas, 
        bajarCarta: bajarCarta
    }
    return {
        procesar: function (msj, client) {
            try{
                var jugador = identificarOLoggear(msj, client); 
                logger.log("Se logidentifico al jug: " + jugador.getUsername() +" op: "+msj.operacion);
                resolver[msj.operacion](jugador, msj); 
            }
            catch(e) {
                if(e.name === "ErrorIdentificacion" ) 
                    logger.logError(e);        
                else
                    throw e;
            }
        },
        /*
        procesar2: function(msj, client){

            switch(msj.operacion){
                case "iniciarJuego":
                    logger.log("El jugador "+ msj.session.username + " empezo la partida");
                    juego.iniciarJuego();
                    break;
                case "conectarJugador":
                    //logger.log("Jugador identificado como: "+ JSON.stringify(msj.datosLoginJugador) + " se conecto! ");
                    
                    var jugador = loginModule.login(msj.datosLoginJugador, client);
                    if(jugador)
                        juego.agregarJugador(jugador);
                    break;
                case "robarCartas":
                    var jugador = identificarJugador(sessionJugador);

                    logger.log("El jugador "+ jugador.getUsername() + " quiere robar "+ msj.cantidad + " cartas.");


                    if(!jugador){
                        errorHandler.error("Jugador no identificado correctamente! No puede robar cartas.");
                        return;
                    }
                    juego.robarCartas(jugador, msj.cantidad);
                    break;

                case "bajarCarta":
                    var cartaInfo = Carta(msj.cartaId);
                    logger.log("El jugador "+  msj.session.username + " bajo carta "+ cartaInfo.nombre);
                    juego.bajarCarta();
                default: 
                    errorHandler.error("Llego un msj equivocado: '"+msj.operacion+"'.");
            }
        }*/
    }

})();

module.exports = messageHandler;

/*
var operacionesAccionesMap = (function(){
    return {
        iniciarJuego: [
            LogAction(logger, "El cliente "+ msj.session.username + " empezo la partida"),
            IniciarJuego(juego)],
        conectarJugador: [
            ]

    }
})

var LogAction = function(logger, msgLog){
    return function log_posta(){ 
        logger.log("Hola "+msgLog);
    };
}


var IniciarJuego = function (juego) {
    return function iniciar_posta(){
        juego.iniciarJuego();
    }
}

var RobarCartas = function(juego, jugador, cantidad){
    return function robar_posta(){
        juego.robarCartas(jugador, cantidad);
    }
}

var LoginJugador = function (loginModule, jugador) {
    return function login_posta(){

    }
}
*/