
var logger = require('./logger');
var errorHandler = require('./errorHandler');
var jugadoresRepository = require('./jugadoresRepository');
var messageFactory = require('./messageFactory');

//el juego ES la mesa donde se sientan los dos y se maneja todo el estado.
var juego = (function(){
 
    var currentJugador = null;
    var proximoJugador = null;

    var mesa = null;


    //private
    var mesaLlena = function() {
        return jugadoresRepository.getCantidadJugadoresConectados() > 1;
    }

    var agregarJugador = function(jugador) {

        jugadoresRepository.agregarJugador(jugador);

        var jugadoresConectados = jugadoresRepository.getCantidadJugadoresConectados();
        logger.log("Jugador "+jugador.getUsername()+ " agregado a la mesa. Total de conectados: "+jugadoresConectados + ". ")
        
        verificarMesaLlena();

    }

    //private
    var verificarMesaLlena = function(){
        if(mesaLlena()){
            logger.log("Se lleno la mesa!");
            broadcast(messageFactory.msjMesaLlena());
        }
    }

    var desconectarJugador = function(sessionJugador) {
        jugadoresRepository.desconectarJugador(sessionJugador);

        if (!mesaLlena()) {
            logger.log("No hay suficientes jugadores para llenar la mesa...");
            return ;
        }
        
    }

    //private
    var validarPuedeIniciarJuego = function(){
        if(!mesaLlena()){
            errorHandler.error("No se puede empezar el juego, la mesa no esta llena! ");
            return false;
        }
        return true;
    }

    var iniciarJuego = function(){

        if(!validarPuedeIniciarJuego()) return;

        var jugadoresConectados = jugadoresRepository.getJugadoresConectados();

        

        broadcast(messageFactory.msjIniciarJuego());

        for (var i = 0; i < jugadoresConectados.length; i++) {
            var CARTAS_MANO_INICIAL = 7;
            jugadoresConectados[i].robarCartas(CARTAS_MANO_INICIAL);
        };

        currentJugador = jugadoresRepository.getPrimerJugador();
        //...... ceder turno al jugador currentJugador ..............
    }

    //private
    var broadcast = function(mensaje) {
        logger.log("Broadcasting: "+mensaje +".-");

        var conectados = jugadoresRepository.getJugadoresConectados();

        for(var h = 0; h < conectados.length; h++) {
            conectados[h].send(mensaje);
        }
    }

    //TODO aca ya deberia asumir q el jugador es legal...
    var robarCartas = function (sessionJugador, cantidad) {
        var jugador = jugadoresRepository.getJugador(sessionJugador);

        if(!jugador){
            errorHandler.error("Jugador no identificado correctamente! No puede robar cartas.");
            return;
        }

        jugador.robarCartas(cantidad);
    }

    return {
        agregarJugador: agregarJugador,
        desconectarJugador: desconectarJugador,
        iniciarJuego: iniciarJuego,
        mesaLlena: mesaLlena

    }
})();

module.exports = juego;