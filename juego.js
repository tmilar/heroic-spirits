
var currentSession = null;

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



var messageHandler = (function(){

	return {
		procesar: function(msj){
			if(!msj.operacion){
				errorHandler.error("Hubo un error, llego un msj extraño: \n"+msj);
			}

			switch(msj.operacion){
				case "robarCartas":
					logger.log("El servidor nos dejo robar "+msj.cartas.length+" cartas");
					
					gui.robarCartas(msj.cartas, msj.cartasRestantesMazo);

					break;
				case "mesaLlena":
					logger.log("Se lleno la mesa, el juego ya puede ser empezado.");
					gui.habilitarBotonInicio();
					break;

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
					currentSession = msj.session;
					logger.log("Sesion iniciada correctamente! "+ "[Username: " +currentSession.username +", session_id: "+currentSession._id+"].");
					break;

				case "bajarCarta":
					if(!msj.autorizado){
						errorHandler.error("El sv no me dejo bajar la carta.");
						return;
					}

					gui.bajarCarta(cartaSeleccionada);
					break;
				default: 
					errorHandler.error("Llego un msj equivocado: '"+msj.operacion+"'.");
			}
		}
	}
})();


var cache = (function(){

	var items = [];
	return{
		add: function(item){
			items.push(item);
		},
		addMany: function(items_add){
			for (var i = 0; i < items_add.length; i++) {
				items.push(items_add[i]);
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

var gui = {

	borrarCartaSeleccionada: function(carta){
		$(".carta").find("[data-idCarta='" + carta._id + "']");
	},

	agregarCartaManoJugador: function(carta){
		var imgSrc = 'http://upload.wikimedia.org/wikipedia/commons/4/44/Question_mark_%28black_on_white%29.png';

		//TODO var imgSrc = carta.imgSrc;
		$('#manoJugador ul').append(
		    $('<li>').append(
		    	$('<div>').attr({"data-idCarta": carta._id}).append(
		        	$('<img>').attr('src',imgSrc)
				        	.addClass("carta"))));
	},

	agregarCartaMesaJugador: function(carta){		
		var imgSrc = 'http://4.bp.blogspot.com/-9pweicITRx8/TabnxKINofI/AAAAAAAAB-c/ljIgZf_LwGU/s1600/signo+de+exclamacion.png';

		$('#mesaJugador ul').append(
		    $('<li>').append(
		    	$('<div>').attr("data-idCarta", carta._id).append(
		        	$('<img>').attr('src',imgSrc).addClass("carta"))));
	},

	bajarCarta: function(carta){
		this.borrarCartaSeleccionada(carta);
		this.agregarCartaMesaJugador(carta);
	},

	robarCartas: function (cartas, cartasRestantesMazo) {
		cache.addMany(cartas);

		for (var i = cartas.length - 1; i >= 0; i--) {
			this.agregarCartaManoJugador(cartas[i]);
		};

		$("#cartasRestantesMazo").text("Cartas \nmazo: "+cartasRestantesMazo);
	},

	inicializar: function  (cartasRestantesMazo) {
		$("#cartasRestantesMazo").text("Cartas \nmazo: "+cartasRestantesMazo);
	},
	
	habilitarBotonInicio: function(){
		$("#btnIniciar").removeAttr("disabled");
	}
 }
var ui = {

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
			$("#log").prepend("<p>Conexion perdida!</p>");
		};

	},

	bajarCarta: function(){
		//TODO:  q el servidor valide que la carta este posta en la mano del jugador.
		if(!cartaSeleccionada || cartaSeleccionada.closest())
		if(cartaSeleccionada != null) {
			this.servidor.send(messageFactory.bajarCarta(cartaSeleccionada));
		}else{
			errorHandler.error("No selecciono ninguna carta!");
		} 
	},

	seleccionarCarta: function(datosCarta){
		this.cartaSeleccionada = cache.getItemById(datosCarta._id);
	},

	iniciarJuego: function(){

		this.servidor.send(messageFactory.msjIniciarJuego());
	},

	cartaClick:function(datosCarta){
		//mostrar en pantalla datos de la carta seleccionada....
	},

	desconectarServidor: function(){
		logger.log("Conexion con el servidor cerrada.");
		this.servidor.close();
	}
}



//Setup del juego y asignar eventos a la GUI
var eventHandler = function(){

	var onBajarCarta = function(){
		ui.bajarCarta();
	}

	var onClickRobarCarta = function () {
		ui.robarCarta();
	}
	/*
	var onDeclararAtaque = function(){
		ui.declararAtaque($(""))
	}*/

	var onClickCarta = function(event){		
		logger.log("hice clic en una carta" + JSON.stringify(event.data));

		$(".carta").removeClass("carta-seleccionada");
		$(this).addClass("carta-seleccionada");
		datosCarta = {//nroJugador: $(this).attr("data-nroJugador"),
					  _id: $(this).attr("data-idCarta"),
					}
		ui.cartaClick(datosCarta);
	}

	var onClickIniciar = function(){
		$(this).attr("disabled", "disabled");
		ui.iniciarJuego();
	}
	var onClickConectar= function(){
		logger.log("Hice clic en el boton conectar.");
		ui.conectarServidor();
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
	});


}();