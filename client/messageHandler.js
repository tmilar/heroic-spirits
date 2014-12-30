
var messageHandler = (function(){

	return {
		procesar: function(msj){
			if(!msj.operacion){
				errorHandler.error("Hubo un error, llego un msj extraño: \n"+msj);
				return;
			}

			gui.procesarMsj(msj);

			switch(msj.operacion){

				//TODO Delegar a la gui
				case "robarCartas":
					if(msj.cartasJugador){
						logger.log("Nuevas cartas: "+JSON.stringify(msj.cartas));

						logger.log("El servidor nos dejo robar "+msj.cartas.length+" cartas");
						gui.robarCartas(msj.cartas, msj.cartasRestantesMazo, "jugador");
					}else{
						logger.log("Nuevas cartas oponente: "+JSON.stringify(msj.cartas));
						logger.log("El oponente robo" +msj.cartas.length+" cartas");
						gui.robarCartas(msj.cartas, msj.cartasRestantesMazo, "oponente");
					}

					break;
				//case "mesaLlena":
				//	logger.log("Se lleno la mesa, el juego ya puede ser empezado.");
				//	gui.habilitarBotonInicio();
				//	break;

				case "iniciarJuego":
					logger.log("Empezo el juego!");
					//gui.inicializar();

					break;
				case "respuestaConexion":
					if(!msj.session){
						errorHandler.error("El SV no autorizo la conexion. Motivo: '"+msj.mensaje+"'.");
						ui.desconectarServidor();
						return;
					}
					gui.mostrarUsername(msj.session.username);
					currentSession = msj.session;
					logger.log("Sesion iniciada correctamente! "+ "[Username: " +currentSession.username +", session_id: "+currentSession._id+"].");
					break;

				//TODO Delegar a la gui
				case "bajarCarta":
					if(!msj.autorizado){
						errorHandler.error("El sv no me dejo bajar la carta.");
						return;
					}

					gui.bajarCarta(cartaSeleccionada);
					break;

			}
		}
	}
})();