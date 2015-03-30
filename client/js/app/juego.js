
var currentSession = null;

var IMG_CARTA_FONDO = "http://4.bp.blogspot.com/_yJpgVtS93ho/TE7sRpxpueI/AAAAAAAAAZk/P9F0VNvtL5Y/s1600/card_back_arreglat.png";
var IMG_CARTA_MANO = "http://upload.wikimedia.org/wikipedia/commons/4/44/Question_mark_%28black_on_white%29.png";
var IMG_CARTA_MESA_J1 = "http://4.bp.blogspot.com/-9pweicITRx8/TabnxKINofI/AAAAAAAAB-c/ljIgZf_LwGU/s1600/signo+de+exclamacion.png";
var IMG_CARTA_MESA_J2 = "http://us.cdn4.123rf.com/168nwm/niyazz/niyazz1310/niyazz131000021/22620410-simbolo-de-exclamacion-en-el-fuego-sobre-fondo-negro.jpg";

/*
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

}*/


/*
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
						appUi.desconectarServidor();
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
*/
/*
var cache = (function(){

	var items = [];
	return{
		add: function(item){
			items.push(item);
			logger.log("Agregue a la cache: "+JSON.stringify(item));
		},
		addMany: function(items_add){
			logger.log("Agregando a la cache: "+JSON.stringify(items_add));

			for (var i = 0; i < items_add.length; i++) {
				this.add(items_add[i]); 
			};
		},
		getItemById: function(item_id){
			for (var i = 0; i < items.length; i++) {
				if(items[i]._id === item_id){
					return items[i];
				}
			};
			return undefined;
		},
		getItems: function () {
			return items;
		},
		deleteItemById: function(item_id){
			for (var i = 0; i < items.length; i++) {
				if(items[i]._id === item_id){
					return items.splice(i, 1);
				}
			};
		}

	}
})();
*/

/*
var gui = {

	procesarMsj: function (msj) {
		estadoGuiHandler.procesarMsj(msj);
	},

	borrarCartaSeleccionada: function(carta){
		$(".carta").find("[data-idCarta='" + carta._id + "']").remove();
		//errorHandler.error("intento borrar carta id: "+carta._id+", pero aun no implemente el borrado!");
	},

	agregarCartaManoJugador: function(carta){
		var imgSrc = IMG_CARTA_MANO;

		//TODO var imgSrc = carta.imgSrc;
		$('#manoJugador ul').append(
		    $('<li>').append(
		    	$('<div>').attr({"data-idCarta": carta._id}).addClass("contenedor-carta").append(
		        	$('<img>').attr('src',imgSrc).addClass("carta")
				        	)));
	},

	agregarCartaManoOponente: function(carta){		
		var imgSrc = IMG_CARTA_FONDO;

		//TODO var imgSrc = carta.imgSrc;
		$('#manoJugador ul').append(
		    $('<li>').append(
		    	$('<div>').attr({"data-idCarta": carta._id}).addClass("contenedor-carta").append(
		        	$('<img>').attr('src',imgSrc).addClass("carta")
				        	)));

	},
	agregarCartaMesaJugador: function(carta){		
		var imgSrc = IMG_CARTA_MESA_J1;

		$('#mesaJugador ul').append(
		    $('<li>').append(
		    	$('<div>').attr("data-idCarta", carta._id).addClass("contenedor-carta").append(
		        	$('<img>').attr('src',imgSrc).addClass("carta")
		        			)));
	},

	agregarCartaMesaOponente: function (carta) {
		var imgSrc = IMG_CARTA_MESA_J2;

		$('#mesaOponente ul').append(
		    $('<li>').append(
		    	$('<div>').attr("data-idCarta", carta._id).addClass("contenedor-carta").append(
		        	$('<img>').attr('src',imgSrc).addClass("carta")
		        		)));
	},

	bajarCarta: function(carta){
		this.borrarCartaSeleccionada(carta);
		this.agregarCartaMesaJugador(carta);
	},

	bajarCartaOponente: function (carta){
		this.borrarCartaSeleccionada(carta);		
		this.agregarCartaMesaOponente(carta);
	},

	robarCartas: function (cartas, cartasRestantesMazo, jugador) {

		//TODO BORRAR ESTO porque es solo para el JUGADOR

		cache.addMany(cartas);
		
		if(jugador == "jugador"){
			cache.addMany(cartas);

			for (var i = cartas.length - 1; i >= 0; i--) {
				this.agregarCartaManoJugador(cartas[i]);
			};
			$("#cartasRestantesMazo").text("Cartas \nmazo: "+cartasRestantesMazo);
		}

		if(jugador == "oponente"){			
			for (var i = cartas.length - 1; i >= 0; i--) {
				this.agregarCartaManoOponente(cartas[i]);
			};
			$("#cartasRestantesMazoOponente").text("Cartas \nmazo: "+cartasRestantesMazo);
		}
	},

	inicializar: function  () {
		estadoGuiHandler.inicializar();
	},

	habilitarBotonInicio: function(habilitado){
		if(habilitado){
			$("#btnIniciar").removeAttr("disabled");
		}else{			
			$("#btnIniciar").attr("disabled", "disabled");
		}
	},

	mostrarBotonInicio: function (mostrar) {	
		if(mostrar)
			$("#btnIniciar").show();
		else
			$("#btnIniciar").hide();
	},

	habilitarJugadas: function(habilitado){
		if(habilitado){
			logger.log("Se habilitaron las jugadas! Baje cartas arrastrando o active efectos seleccionandolas.");
		}else{
			logger.log("Jugadas deshabilitadas.");
		}
	},

	mostrarInputsConexion: function(mostrar){
		if(mostrar){
			$(".conexion").show();
		}else{
			$(".conexion").hide();
		}
	},

	habilitarBotonConexion: function (habilitado) {
		if(habilitado){
			$("#btnConectar").removeAttr("disabled");
		}else{			
			$("#btnConectar").attr("disabled", "disabled");
		}	
	},

	mostrarUsername: function (username) {
		$("#datosJugador").removeAttr("hidden");
		$("#username1").text(username);
	},

	mostrarJuego: function (mostrar)  {
		if(mostrar)
			$("#juego").show();
		else	
			$("#juego").hide();
	}
	
 }

*/
/*
var appUi = {

	servidor: null,
	jugador: null,

	cartaSeleccionada: null,

	robarCarta: function (cantidad) {
		this.servidor.send(messageFactory.msjRobarCartas(cantidad));
	},

	conectarServidor: function(){		
		var ipServidor =  $("#serverAddress").val();
		var puerto = $("#serverPort").val();

		var datosLoginJugador = {username: $("#username").val(),
								 password: $("#password").val()
								}
		var that = this;

		logger.log("Intentando conexion... "+ JSON.stringify(datosLoginJugador));
		this.servidor = new WebSocket('ws://' + ipServidor + ':' + puerto);

		this.servidor.onopen = function(event) {
			$("#btnConectar").attr("disabled","disabled");
			logger.log("Me comunique con el servidor!");

			this.send(messageFactory.msjConectar(datosLoginJugador));
		};

		this.servidor.onmessage = function(event) {
			logger.log("Me llego el msj: "+ event.data);
			var msj = JSON.parse(event.data);

			messageHandler.procesar(msj);

		};

		this.servidor.onclose = function(event) {

			$("#btnConectar").removeAttr("disabled");
			logger.log("Conexion perdida!");
		};

	},

	bajarCarta: function(){
		//TODO:  q el servidor valide que la carta este posta en la mano del jugador.
		//if(!cartaSeleccionada || cartaSeleccionada.closest())
			if(cartaSeleccionada != null) {
				this.servidor.send(messageFactory.bajarCarta(cartaSeleccionada));
			}else{
				errorHandler.error("No selecciono ninguna carta!");
			} 
	},

	seleccionarCarta: function(datosCarta){
		this.cartaSeleccionada = cache.getItemById(datosCarta._id);
		logger.log("(Id: "+datosCarta._id +") Info carta seleccionada: "+ JSON.stringify(this.cartaSeleccionada));
	},

	iniciarJuego: function(){

		this.servidor.send(messageFactory.msjIniciarJuego());
	},

	desconectarServidor: function(){
		logger.log("Conexion con el servidor cerrada.");
		this.servidor.close();
	}
}
*/

/*

//Setup del juego y asignar eventos a la GUI
var eventHandler = function(){

	var onBajarCarta = function(){
		appUi.bajarCarta();
	}

	var onClickRobarCarta = function () {
		appUi.robarCarta();
	}
	
	//var onDeclararAtaque = function(){
	//	appUi.declararAtaque($(""))
	//}

	var onClickCarta = function(event){		
		var cartaSeleccionada = $(this).closest(".contenedor-carta");
		logger.log("hice clic en una carta id: " +  cartaSeleccionada.attr("data-idcarta") + ".");

		$(".carta").removeClass("carta-seleccionada");
		//$(this).addClass("carta-seleccionada");
		$(this).addClass("carta-seleccionada");
		
		datosCarta = {//nroJugador: $(this).attr("data-nroJugador"),
					  _id: cartaSeleccionada.attr("data-idcarta"),
					}
		appUi.seleccionarCarta(datosCarta);
	}

	var onClickIniciar = function(){
		$(this).attr("disabled", "disabled");
		appUi.iniciarJuego();
	}
	var onClickConectar= function(){
		logger.log("Hice clic en el boton conectar.");
		appUi.conectarServidor();
	}

	$(document).ready(function() {

		$("#btnBajarCarta").click(onBajarCarta);
		//$("btnAtacar").click(onDeclararAtaque)
		//$(".carta").click(onClickCarta);
		$(document).on("click",".carta", onClickCarta);
		$("#btnConectar").click(onClickConectar);


		$("#btnIniciar").click(onClickIniciar);
		$("#btnRobarCarta").click(onClickRobarCarta);
		logger.log("Eventos cargados.");

		gui.inicializar();
	});
}();
*/