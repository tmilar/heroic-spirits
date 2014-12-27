var carta_idGenerator = require('./identity')();

var Carta = function(id_generator){

	var id = id_generator.next();		 
	logger.log("Id generado: "+id);

	return {
		_id: id,
		valor: id * 5, ///poner algo significativo
		nombre: "carta#"+id,
		//img_src: "http://upload.wikimedia.org/wikipedia/commons/4/44/Question_mark_%28black_on_white%29.png",
		toString: function(){
			return "[id: "+this._id+", valor:"+this.valor+", nombre: "+this.nombre+"] ";
		}
	}

}

var generadorMazo = {

	generar: function(cantidadCartasMazo){
		var datosCartas = {}
		datosCartas.cartas = [];
		for (var i = 0; i < cantidadCartasMazo; i++) {
			datosCartas.cartas.push(Carta(carta_idGenerator));
		};

		return Mazo(datosCartas);
	}
}

var Mazo = function(dataMazoCartasJugador){

	var cartasIniciales = null;
	var inicializar = function(){
			//inicializar mazo con cartas de BD
		if(!dataMazoCartasJugador)
			cartasIniciales = [5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100];
		else
			cartasIniciales = dataMazoCartasJugador.cartas;

		this.cartas = cartasIniciales;
	};

	inicializar();

	return{

		cartas: cartasIniciales,

		inicializar: inicializar,

		robar: function(cantidad){
			var cartasRobadas= [];
			while((nextCarta = this.cartas.pop()) && cantidad > 0){

				cartasRobadas.push(nextCarta);
				cantidad--;
			}

			return cartasRobadas;
		},

		cantidadCartasRestantes: function() {
			return this.cartas.length;
		}
	}
}

//module.exports = Carta;
module.exports = Mazo;
module.exports.generar = generadorMazo.generar;
//module.exports = generadorMazo;

var logger = require('./logger');

var TEST_MAZO = {
	testCartas: function(){
		var carta1  = new Carta(carta_idGenerator);
		var carta2  = new Carta(carta_idGenerator);
		var carta3 = Carta(carta_idGenerator);
		var carta4 = Carta(carta_idGenerator);

		logger.log(carta1 + carta2+ carta3 + carta4);
	},
	testGenerarMazo: function(){
		var mazoGenerado = generadorMazo.generar(25);
		console.log(JSON.stringify(mazoGenerado));
	}
}	

TEST_MAZO.testCartas();
TEST_MAZO.testGenerarMazo();

