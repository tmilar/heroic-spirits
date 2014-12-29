var logger = require('./logger');
var juego = require('./juego');
var errorHandler = require('./errorHandler');
var loginModule = require('./loginModule');

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

module.exports = messageHandler;