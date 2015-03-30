// EstadoGui INTERFAZ:
// 	- EstadoGui.inicializar(); para volver al estado inicial (desconectado)
// 	- EstadoGui.procesarMsj(): para procesar un mensaje recibido

// PROBLEMA: es un objeto global, cualquiera puede accederlo (no se como hacer para q solo la gui lo conozca)
var estadoGuiHandler = (function(){
	
	//Todos procesan primero en el estadoBase
	var EstadoBase = {
		procesarMsj: function (msj) {
			if(msj.operacion=="inicializar"){
				proximoEstado(Conectado);
			}
			if(msj.operacion=="errorConexion"){
				proximoEstado(ProblemaConexion);
			}
			if(msj.oponente){
				gui.actualizarDatosOponente(msj.oponente);
			}
		}
	}

	var Desconectado = {
		entrar: function(){
			gui.habilitarBotonConexion(true);
			//gui.informar("desconexion");
			gui.mostrarInputsConexion(true);
			//gui.mostrarJuego(false);
			logger.log("NO estoy conectado al servidor.");
		},
		procesarMsj: function(msj){
			EstadoBase.procesarMsj(msj);
			if(msj.operacion=="respuestaConexion"&& msj.session){
				proximoEstado(Conectado);
			}
		},
		salir: function(){
			gui.habilitarBotonConexion(false);
			gui.mostrarInputsConexion(false);
			logger.log("Sali del estado de desconexion...");
		}
	}

	var Conectado = {
		entrar: function(){

			logger.log("Me conecte al servidor! Esperando a que se llene la mesa...");
			gui.mostrarBotonInicio(true);
		},		
		procesarMsj: function(msj){
			EstadoBase.procesarMsj(msj);
			if(msj.operacion =="mesaLlena"){
				proximoEstado(MesaLlena, msj);
			}
		},
		salir: function() {
			// por ahora nada...
		}
	}

	var MesaLlena = {
		entrar: function(){//msj){
			gui.habilitarBotonInicio(true);
			logger.log("Se lleno la mesa! Ya es posible empezar el juego."); 
			//gui.actualizarDatosOponente(msj.oponente);
			gui.mostrarDatosOponente(true);
		},
		procesarMsj: function (msj) {
			EstadoBase.procesarMsj(msj);

			if(msj.operacion == "iniciarJuego"){
				if(msj.teTocaJugar){
					proximoEstado(TurnoJugador);
				}else{
					proximoEstado(TurnoOponente);
				}
			}
		},
		salir: function(){
			//el SV me permite salir con un mensaje
			gui.habilitarBotonInicio(false);
			gui.mostrarBotonInicio(false);
			gui.mostrarJuego(true); //TODO mover esto a algun estado que maneje la entrada y salida del juego.
		}
	}

	var TurnoJugador = {
		entrar: function(){
			logger.log("Comienza tu turno.");
			gui.habilitarJugadas(true);
		},
		procesarMsj: function (msj) {
			EstadoBase.procesarMsj(msj);
			if(msj.operacion == "proximoTurno"){
				proximoEstado(TurnoOponente);
			}
		},
		//terminarTurno: function () {
		//	proximoEstado(TurnoOponente);
		//},
		salir: function(){
			gui.habilitarJugadas(false);
			logger.log("Turno finalizado.");
		}
	}

	var TurnoOponente = {
		entrar: function () {
			logger.log("Comienza el turno del oponente.");
		},
		procesarMsj: function  (msj) {
			EstadoBase.procesarMsj(msj);
			if(msj.operacion=="proximoTurno"){
				proximoEstado(TurnoJugador);
			}
		},
		salir: function() {
			logger.log("El oponente finalizo su turno.");
		}
	}

	var ProblemaConexion ={
		entrar: function  () {
			EstadoAnterior = EstadoActual; //Guardo el estado anterior
		},
		procesarMsj: function (msj) {
			if(msj.operacion== "errorConexion" && msj.desconectado=="oponente"){
				logger.log("Error de conexion del oponente: "+ msj.mensaje);
				gui.mostrarEsperaOponente(true);
			}
			if (msj.operacion=="problemaConexionResuelto"){
				logger.log("Se resolvio el problema: "+msj.mensaje);
				proximoEstado(EstadoAnterior);
			}
		},
		salir: function() {
			//por ahora nada...	
		}
	}


	var EstadoActual = null;
	var EstadoAnterior = null;

	var proximoEstado = function(nuevoEstado, msj){
		EstadoActual.salir(msj);
		EstadoAnterior = EstadoActual;
		EstadoActual = nuevoEstado;
		EstadoActual.entrar(msj);
	}


	var procesarMsj = function (msj) {
		if(!EstadoActual){
			errorHandler.error("No se configuro ningun estado en la GUI! Debe inicializarse primero.");
			return;
		}
		EstadoActual.procesarMsj(msj);
	}


	var inicializar = function () {
		EstadoActual = Desconectado;
		EstadoActual.entrar();
	}

	/*)
	var terminarTurno = function () {
		if(EstadoActual === TurnoJugador)
			EstadoActual.terminarTurno();
		else
			logger.log("No es tu turno, no podes terminarlo!");
	}
	//inicializar();
	*/
	return {	
		inicializar: inicializar,
		procesarMsj: procesarMsj,
		//terminarTurno: terminarTurno,
	}

})();