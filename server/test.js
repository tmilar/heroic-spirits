//Pequenio script para correr pruebitas 

var Mazo1 = function(){

	var cartasIniciales = null;
	var inicializar = function(dataCartas){
			//inicializar mazo con cartas de BD
		cartasIniciales = [5,10,15,20,25];
		this.cartas = cartasIniciales;
	};

	inicializar();

	return{

		cartas: cartasIniciales,

		inicializar: inicializar,

		robar: function(cantidad){
			var cartasRobadas= [];
            var nextCarta;
			while((nextCarta = this.cartas.pop()) && cantidad > 0){

				cartasRobadas.push(nextCarta);
				cantidad--;
			}

			return cartasRobadas;
		}
	}
};


var Mazo = require('./mazo');

var Logger = require('./logger');

mazo = new Mazo();
Logger.log("Hola que tal!");
//mazo.inicializar();
console.log(mazo.robar(3));
console.log(mazo.robar(3));
console.log(mazo.robar(3));


mazo.inicializar();
console.log(mazo.robar(3));
console.log(mazo.robar(3));
