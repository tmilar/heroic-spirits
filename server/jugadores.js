var jugadoresRepository = require("./jugadoresRepository");


var jugadores = (function(){
	var jugadores_mesa = [];

	var currentJugador = null;
	var proximoJugador = null;


    var agregarJugador = function(jugador) {

        jugadoresRepository.agregarJugador(jugador);

        var jugadoresConectados = jugadoresRepository.getCantidadJugadoresConectados();
        logger.log("Jugador "+jugador.getUsername()+ " agregado a la mesa. Total de conectados: "+jugadoresConectados + ". ")
        
        if(this.mesaLlena()){
            logger.log("Se lleno la mesa! Hay "+jugadoresConectados + " conectados." );
            //this.esperandoJugadores = false;
            this.broadcast(messageFactory.msjMesaLlena());
        }

    },

    var desconectarJugador = function(sessionJugador) {
        jugadoresRepository.desconectarJugador(sessionJugador);

        if (!this.mesaLlena()) {
            logger.log("No hay suficientes jugadores para llenar la mesa...");
            return ;
        }
        
    },

	return {
        agregarJugador: agregarJugador,
        desconectarJugador: desconectarJugador,
        iniciarJuego: iniciarJuego

	}
})();

module.exports = jugadores;