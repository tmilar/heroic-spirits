//Setup del juego y asignar eventos a la GUI
var eventHandler = function(){

	var onBajarCarta = function(){
		ui.bajarCarta();
	}

	var onClickRobarCarta = function () {
		ui.robarCarta();
	}
	
	//var onDeclararAtaque = function(){
	//	ui.declararAtaque($(""))
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
		ui.seleccionarCarta(datosCarta);
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

		gui.inicializar();
	});
}();