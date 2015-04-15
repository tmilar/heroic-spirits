
var logger = require('./logger');
var errorHandler = require('./errorHandler');
var jugadoresRepository = require('./jugadoresRepository');
var messageFactory = require('./messageFactory');



var mesaLlenaObserver = (function mesaLlenaObserver(){
    //REQUIRE: jugadoresRepository ( la mesa donde estan jugando ), 
            // messageFactory
    //REQUIRE : juego (AUNQUE DEBERIA PODER HACERSE DI para traer su estado tmb)
    var notificar = function (Event) {
        if((Event !== "JUGADOR_AGREGADO") || !juego.mesaLlena())
            return;

        seLlenoLaMesa();
    };

    //private
    var seLlenoLaMesa = function(){ 
        logger.log("Se lleno la mesa!");
        presentarOponentes();
        enviarMsjMesaLlena(); 
    };

    //private
    var presentarOponentes = function () {        
        var jugs = jugadoresRepository.getJugadoresConectados(); 
        jugs[0].setOponente(jugs[1]);
        jugs[1].setOponente(jugs[0]);
    };

    //private
    var enviarMsjMesaLlena = function () {
        var jugadoresMesa = jugadoresRepository.getJugadoresConectados();
        var jug1 = jugadoresMesa[0];
        var jug2 = jugadoresMesa[1];

        jug1.send(messageFactory.msjMesaLlena(jug2.datosPublicosJugador()));
        jug2.send(messageFactory.msjMesaLlena(jug1.datosPublicosJugador()));
    }
        

    return {
        notificar: notificar
    }
})();

//el juego ES la mesa donde se sientan los dos y se maneja todo el estado.
var juego = (function Juego(){
 
    var currentJugador = null;
    var proximoJugador = null;
    var nroTurno = 0;

    var mesa = null;

    var observadores = [mesaLlenaObserver];

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
        

        notificar_evento("JUGADOR_AGREGADO");
    }

    //Private
    var notificar_evento = function (Evento) { 
        observadores.forEach(function(obs){
            obs.notificar(Evento, juego);
        });
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

        var CARTAS_MANO_INICIAL = 7;

        var jugadoresConectados = jugadoresRepository.getJugadoresConectados();


        jugadoresConectados.forEach(function (jug) {
            jug.robarCartas(CARTAS_MANO_INICIAL);
        });
        /*for (var i = 0; i < jugadoresConectados.length; i++) {
            jugadoresConectados[i].robarCartas(CARTAS_MANO_INICIAL);
        };*/
    }

    var iniciarJuego = function(){

        if(!validarPuedeIniciarJuego()) return;
  
        informarInicioJuego();
        repartirManoInicial();

        primerTurno();
        //...... ceder turno al jugador currentJugador ..............
    }

    //private
    var informarInicioJuego = function(){
        broadcast(messageFactory.msjIniciarJuego());      
    }

    
    var proximoTurno = function () {

        var aux = currentJugador;
        currentJugador = proximoJugador;
        proximoJugador = aux;

        enviarMsjProximoTurno();
    }

    //private
    var primerTurno = function(){        
        currentJugador = jugadoresRepository.getPrimerJugador();
        proximoJugador = jugadoresRepository.getSegundoJugador();

        enviarMsjProximoTurno();
    }

    //private
    var enviarMsjProximoTurno = function () {
        nroTurno++;
        currentJugador.send(messageFactory.msjEmpezarTurno(nroTurno));
    }


    //TODO aca ya deberia asumir q el jugador es legal...
    //TODO2 este metodo no debe ser interfaz, el jugador no roba cartas cuando quiere!!
    var robarCartas = function (jugador, cantidad) {

        jugador.robarCartas(cantidad);
    }

    return {
        agregarJugador: agregarJugador,
        desconectarJugador: desconectarJugador,
        iniciarJuego: iniciarJuego,
        puedenEntrarJugadores: puedenEntrarJugadores,
        mesaLlena: mesaLlena,
        proximoTurno: proximoTurno
    }
})();

module.exports = juego;