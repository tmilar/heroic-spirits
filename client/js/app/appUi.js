
var appUi = {

	servidor: null,
	jugador: null,

	cartaSeleccionada: null, //Guardar temporalmente la ultima carta clickeada

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

	bajarCarta: function($cartaBajada){
		//TODO:  q el servidor valide que la carta este posta en la mano del jugador.
		var idCarta = $cartaBajada.attr("data-idcarta");
 		logger.log("Baje la carta: [id: "+idCarta+"]");

		//obtengo el target, el ul de cartas en la mesa
		var $cartasMesa =  $("ul", ".jugador .campoBatalla");
		var $liContainer = $("<li></li>");
		var $divContainerCarta = $("<div class='carta' data-idcarta="+idCarta+"></div>");
		var $imgCarta = $cartaBajada.children('img');

		$liContainer.append($divContainerCarta);
 		$cartasMesa.append($liContainer).fadeIn(function(){

			$imgCarta
				.animate({ width: "150px" })
				.animate({height: "200px"});
		});

		$divContainerCarta.append($imgCarta).fadeIn(function(){
        //
		//	//	var anchoContainer = $divContainerCarta.attr("width").toString();
		//	//	var altoContainer = $divContainerCarta.attr("height").toString();
		//	$imgCarta
		//		.animate({ width: "150px" })
		//		.animate({height: "200px"});
		//	//
		});

		$cartaBajada.parent("li").remove();
		$cartaBajada.remove();

 		this.servidor.send(messageFactory.bajarCarta(cartaSeleccionada));
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
};