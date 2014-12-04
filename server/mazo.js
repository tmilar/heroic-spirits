var Export_Mazo = function(){

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
			while((nextCarta = this.cartas.pop()) && cantidad > 0){

				cartasRobadas.push(nextCarta);
				cantidad--;
			}

			return cartasRobadas;
		}
	}
}

(function(exports){

	var Export_Mazo = function(){

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
				while((nextCarta = this.cartas.pop()) && cantidad > 0){

					cartasRobadas.push(nextCarta);
					cantidad--;
				}

				return cartasRobadas;
			}
		}
	}
	
   exports = Export_Mazo;

})(typeof exports === 'undefined'? this['mazo']={}: exports);
