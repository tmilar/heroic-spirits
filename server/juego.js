
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


    var puedenEntrarJugadores = function () {
        return mesaLlena();
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
            presentarOponentes();
            enviarMsjMesaLlena();
        }
    }

    //private
    var presentarOponentes = function () {        
        var jugs = jugadoresRepository.getJugadoresConectados(); 

        jugs[0].oponente = jugs[1];
        jugs[1].oponente = jugs[0];
    }

    //private
    var enviarMsjMesaLlena = function () {
        var jugadoresMesa = jugadoresRepository.getJugadoresConectados();
        var jug1 = jugadoresMesa[0];
        var jug2 = jugadoresMesa[1];

        jug1.send(messageFactory.msjMesaLlena(jug2.datosPublicosJugador()));
        jug2.send(messageFactory.msjMesaLlena(jug1.datosPublicosJugador()));
    }
    

    var desconectarJugador = function(sessionJugador) {
        jugadoresRepository.desconectarJugador(sessionJugador);

    }

    //private
    var broadcast = function(mensaje) {
        logger.log("Broadcasting: "+mensaje +".-");

        var conectados = jugadoresRepository.getJugadoresConectados();

        for(var h = 0; h < conectados.length; h++) {
            conectados[h].send(mensaje);
        }
    }

    //***************   ****************   *******************   ***********   */
    /*  *********    METODOS INTERESANTES DEL JUEGO EMPIEZAN ACA    *********  */
    //***************   ****************   *******************   ***********   */


    //private
    var validarPuedeIniciarJuego = function(){
        if(!mesaLlena()){
            errorHandler.error("No se puede empezar el juego, la mesa no esta llena! ");
            return false;
        }
        return true;
    }

    //private
    var repartirManoInicial =  function(){

        var jugadoresConectados = jugadoresRepository.getJugadoresConectados();

        var CARTAS_MANO_INICIAL = 7;

        for (var i = 0; i < jugadoresConectados.length; i++) {
            jugadoresConectados[i].robarCartas(CARTAS_MANO_INICIAL);
        };
    }

    var iniciarJuego = function(){

        if(!validarPuedeIniciarJuego()) return;
  
        darInicioJuego();
        repartirManoInicial();

        primerTurno();
        //...... ceder turno al jugador currentJugador ..............
    }

    //private
    var darInicioJuego = function(){

        broadcast(messageFactory.msjIniciarJuego());      
    }

    //private
    var proximoTurno = function () {

        var aux = currentJugador;
        currentJugador = proximoJugador;
        proximoJugador = aux;

        //ENVIAR MSJ AL PROXIMO JUGADOR PARA Q EMPIECE.
    }

    //private
    var primerTurno = function(){        
        currentJugador = jugadoresRepository.getPrimerJugador();
        proximoJugador = jugadoresRepository.getSegundoJugador();
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
        puedenEntrarJugadores: puedenEntrarJugadores
    }
})();

module.exports = juego;