var mesa = (function(){
	jugadores: [],
	cartasEnMesa: [],

	getJugador1:function  () {
		return jugadores[0];
	}
	getJugador2: function () {
		return jugadores[1];
	}

	agregarJugador: function () {
		if(jugadores.length > 1){
			errorHandler.error("La mesa esta llena, no se puede agregar mas jugadores!");
			return;
		}
		jugadores.push()
	}


	return {
		getJugador1: getJugador1,
		getJugador2: getJugador2,
	}
})();

