//TODO require session.js

var Mazo = function(){

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

var Jugador = function(session) {
	return {
		vidas: 30,
		mano: [],
		mazo: [], //obtener de BD
		session: null,

		getId: function(){
			return session._id;
		}

		iniciarSesion: function(loginData){
			//TODO pedirle a la BD y validar LoginData

			this.session = new Session(loginData);

			this.mazo = new Mazo("info del mazo"); //obtener de BD.
		},

		send: function(msj){
			clientWs.send(JSON.stringify(msj));
		},
		
		robarCarta: function(){
			var cartas = mazo.robar(1);
			this.mano.push(cartas[0]);
			this.send(messageFactory.msjRobarCartas(cartas));
		},

		robarCartas: function(cantidadCartas){

			var cartas = this.mazo.robar(cantidadCartas);

			for (var i = 0; i < cartas.length; i++) {
				this.mano.push(cartas[i]);
			};

			this.send(messageFactory.msjRobarCartas(cartas, this.mazo.cantidadCartasRestantes()));
		},


		bajarCarta: function (carta) {
			this.cartasMano.splice(this.cartasMano.indexOf(carta), 1);
			this.cartasJuego.push(carta);
		},

		estaConectado: function () {
			return session != null;
		},

		desconectar: function(){
			session.cerrar();
			session = null;
		}
	}
}

module.exports = Jugador;