//pruebita.js

var mesaLlenaObserver = (function mesaLlenaObserver(){
    //REQUIRE: jugadoresRepository ( la mesa donde estan jugando ), messageFactory

    var notificar = function (Event, juego) {
        if((Event !== "JUGADOR_AGREGADO") || !juego.mesaLlena())
            return;
 
        seLlenoLaMesa();
    }

    //private
    var seLlenoLaMesa = function(){ 
        logger.log("Se lleno la mesa!"); 
    }
 

    return {
        notificar: notificar,
    }
})();


var juego = (function Juego(){
 
    var observadores = [mesaLlenaObserver];

    var jugsTemp = [];
    var mesaLlena = function() {
        return  jugsTemp.length >1 ; 
    }


    var agregarJugador = function(jugador) {
 		jugsTemp.push(jugador);
 		console.log("agrego: "+jugador);
        notificar_evento("JUGADOR_AGREGADO");

        console.log("jugs: "+JSON.stringify(jugsTemp));
    }

    //Private
    var notificar_evento = function (Evento) {
    	this.saludar("hola");
    	saludar("hola2");
        var juego = this;
        juego.saludar("hola3");

        observadores.forEach(function(obs){
            obs.notificar(Evento, juego);
        });
    }

    return {
    	mesaLlena: mesaLlena,
    	saludar: function(palabra) { console.log("saludo: "+palabra)},
        agregarJugador: agregarJugador,
    }
})();

//Test
juego.agregarJugador("pepe");
juego.agregarJugador("luis");