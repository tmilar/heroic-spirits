
var logger = require('./logger');

var jugadoresRepository = (function() {

    return {
        jugadores: [],

        agregarJugador : function(jugador) {

            if(this.existeJugadorRegistrado(jugador)) {
                //logger.logError({name: "JugadorRegistrado", message: "El jugador "+jugador.getUsername()+" ya estaba registrado."});
                return; 
            }            
            logger.log("[JugRepo] Se registro al jugador: "+jugador.getUsername()+ ".");

            this.jugadores.push(jugador);
            return this.jugadores.length - 1;

        },

        existeJugadorRegistrado: function(jugador){
            return this.jugadores.indexOf(jugador) != -1;
        },

        getPrimerJugador : function() {
            return this.getJugadoresConectados()[0];
        },

        getSegundoJugador: function(){
            return this.getJugadoresConectados()[1];
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

            }
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
             }

        },
        getJugador: function (sessionData) {
 
            var conectados = this.getJugadoresConectados();
            for (var i = 0; i < conectados.length; i++) { 
                if(conectados[i].getId() === sessionData._id){
                    return conectados[i];
                }
            }
            return null;
        }
    }
})();


module.exports = jugadoresRepository;  