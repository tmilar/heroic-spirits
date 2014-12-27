var Session = require('./session');
var Mazo = require('./mazo');
var messageFactory = require('./messageFactory');

var Jugador = function() {
	return {
		vidas: 30,
		mano: [],
		mazo: [], //obtener de BD
		session: null,

		getId: function(){
			return this.session.getId();
		},

		iniciarSesion: function(loginData, client){

			//..... TODO : pedirle a la BD y validar LoginData ........
			var loginValido = true;

			if(!loginValido){
				return null;
			}

			this.session = new Session(loginData, client);
			this.mazo = Mazo.generar(25);//new Mazo(); //obtener de BD.

			return this.session; 
		},

		send: function(msj){
			this.session.send(msj);
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
			return !this.session.isClosed(); // this.session != null;
		},

		desconectar: function(){
			this.session.cerrar();
			//this.session = null;
		},

		getUsername: function(){
			return this.session.getUsername();
		}
	}
}

module.exports = Jugador;