
var currentSession = null;

var messageFactory = {

	msjIniciar: function(){
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
				case "iniciarJuego":
					logger.log("El servidor nos dio luz verde para empezar!");
					//gui.inicializar();

					break;
				case "respuestaConexion":
					if(!msj.session){
						errorHandler.error("El SV no autorizo la conexion. Motivo: '"+msj.mensaje+"'.");
						return;
					}
					currentSession = msj.session;
					logger.log("Sesion iniciada correctamente! "+ currentSession.toString());
					
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


errorHandler.error("errorcito");

var cache = (function(){

	var items = [];
	return{
		add: function(item){
			items.push(item);
		},
		addMany: function(items){
			for (var i = 0; i < items.length; i++) {
				items.push(items[i]);
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

		$("cartasRestantesMazo").text("Cartas \nmazo: "+cartasRestantesMazo);
	},

	inicializar: function  (cartasRestantesMazo) {
		$("cartasRestantesMazo").text("Cartas \nmazo: "+cartasRestantesMazo);
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
								 ip: "123.123.123.123.123",
								 password: $("#password").val()
								}
		var that = this;

		logger.log("Intentando conexion... "+datosLoginJugador);
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

		this.servidor.send(messageFactory.iniciarJuego());
	},

	cartaClick:function(datosCarta){
		//mostrar en pantalla datos de la carta seleccionada....
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

	var onClickCarta = function(){		


		$(".carta").removeClass("carta-seleccionada");
		$(this).addClass("carta-seleccionada");
		datosCarta = {//nroJugador: $(this).attr("data-nroJugador"),
					  _id: $(this).attr("data-idCarta"),
					}
		ui.cartaClick(datosCarta);
	}

	var onClickIniciar = function(){
		ui.iniciarJuego();
	}
	var onClickConectar= function(){
		logger.log("Agregado el evento de conexion al boton.");
		ui.conectarServidor();
	}

	logger.log("hola1");
	$(document).ready(function() {
		$("btnBajarCarta").click(this.onBajarCarta);
		logger.log("cargando eventos..!!!!!");
		//$("btnAtacar").click(onDeclararAtaque)
		$(".carta").click(this.onClickCarta);
		$("btnConectar").click(this.onClickConectar);
		$("btnIniciar").click(this.onClickIniciar);
		$("btnRobarCarta").click(this.onClickRobarCarta);
	});


}();