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
