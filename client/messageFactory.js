
var messageFactory = {

	msjIniciarJuego: function(){
		return JSON.stringify({
					operacion: "iniciarJuego",
					session: currentSession
				});
		
	},

	msjConectar: function(datosLoginJugador){
		return JSON.stringify({
				operacion: "conectarJugador",
				datosLoginJugador: datosLoginJugador
			});
	},
	msjRobarCartas: function(cantidad){
		return JSON.stringify({
					operacion: "robarCartas",
					cantidad: cantidad,
					session: currentSession
				});
	}

}