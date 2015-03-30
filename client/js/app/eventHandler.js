//Setup del juego y asignar eventos a la GUI


var eventHandler = function(){

	var onBajarCarta = function(cartaEl){
		appUi.bajarCarta(cartaEl);
	};

	var onClickCarta = function(event){		
		var cartaSeleccionada = $(this);
		logger.log("hice clic en una carta data-idcarta: " +  cartaSeleccionada.attr("data-idcarta") + ".");
		/*

		$(".carta").removeClass("carta-seleccionada"); 
		$(this).addClass("carta-seleccionada");*/
		
		datosCarta = {//nroJugador: $(this).attr("data-nroJugador"),
					  _id: cartaSeleccionada.attr("data-idcarta")
					};
		appUi.seleccionarCarta(datosCarta);
		var $elementoAnimado = $(this);
		$elementoAnimado.hide();
		$elementoAnimado.show("pulsate", {}, 50);
	};

	var onClickIniciar = function(){
		$(this).attr("disabled", "disabled");
		appUi.iniciarJuego();
	};
	var onClickConectar= function(){
		logger.log("Hice clic en el boton conectar.");
		appUi.conectarServidor();
	};

	
	var agrandarCarta = function () {

		$(this).toggleClass("carta", 500);
	};
	var achicarCarta = function () {
		$(this).toggleClass("carta", 500);
	};


	$(document).ready(function() {

		$(document).on("click",".carta", onClickCarta);
		$("#btnConectar").click(onClickConectar);
		$("#btnIniciar").click(onClickIniciar);

		logger.log("Eventos cargados.");
        //
		//$('[data-idcarta="9"]').hover(
		//	agrandarCarta,
		//	achicarCarta
		//);

/*
		$('.campoBatalla .carta').hover(function() {
			//$("*").not(this).css("z-index", -1);
			//$(this).children( ).css("z-index", 3000);
			//$(this).css("position","absolute");
			$(this).css("z-index", 3000);
			//$(this).parents().css("z-index", 1);
			//$(this).siblings().css("z-index",2000);

			//$(this).stop(true,true).animate({ height: "400", width: "300", left: "-=55", top: "-=55" }, "fast");
			$(this).stop(true,true).animate({ height: "400", width: "300" }, "fast");
		}, function() {
			//$("*").not(this).css("z-index", -1);
			//$(this).children( ).css("z-index", 3000);
			$(this).css("z-index", -1);
			//$(this).parents().css("z-index", 1);
			//$(this).siblings().css("z-index",2000);
			//$(this).stop( true,true).animate({ height: "200", width: "150", left: "+=55", top: "+=55" }, "fast");
			$(this).stop(true,true).animate({ height: "200", width: "150" }, "fast");

		});
*/



		$(function() {

			//ROBAR CARTA
			$(".jugador .mazo").draggable({
				revert:"invalid",
				helper: "clone"
			});


			//BAJAR CARTA
			$(".jugador .campoBatalla .zonaCartas").droppable({
				accept: ".jugador .mano .carta",
				activeClass: "droppableCartas",
				drop: function(event, ui){
					var cartaEl = ui.draggable;
					onBajarCarta(cartaEl);
				}

			});

			$( ".jugador .mano .carta" ).draggable({
		     //connectToSortable: ".jugador .campoBatalla .zonaCartas",
		     	revert: "invalid",
				containment: "document"
            });

            //VERSION SORTABLES
		 	//$(".jugador .campoBatalla .zonaCartas .list-inline").sortable({
				//receive: function (event, ui) {
				//	var cartaEl = ui.item;
            //
            //
				//	var idCarta = cartaEl.find(".carta").attr("data-idcarta");
				//	logger.log("Baje la carta: [id: "+idCarta+"]");
				//}
				////connectWith: ".jugador .mano .carta",
				////activeClass: "droppableCartas",
				////drop: function(event, ui){
				////	var cartaEl = ui.draggable;
				////	onBajarCarta(cartaEl);
				////}
            //});
            //
            //
            //$( ".jugador .mano .zonaCartas .list-inline" ).sortable({
				//connectWith: ".jugador .campoBatalla .zonaCartas .list-inline"
            //});
			/*
			// CORRECCION PARA QUE NO SE CORRA LA LISTA AL SORTEAR (todavia no funca...)
			$(".zonaCartas .list-inline").on( "sortstart", function( event, ui ) {
				logger.log("empezo la joda2.");
				$(this).addClass("correccionSortable");
			} );


			$(".zonaCartas .list-inline").on("sortstop", function( event, ui ) {
				logger.log("termino la joda2.");
				ui.sender.removeClass("correccionSortable");
			} );*/

			$( "ul, li" ).disableSelection();
		});

		//gui.inicializar();
	});
}();