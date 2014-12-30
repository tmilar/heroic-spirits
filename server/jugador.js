var Session = require('./session');
var Mazo = require('./mazo');
var messageFactory = require('./messageFactory');

var Jugador = function Jugador() {

	var vidas = 30;
	var mano = [];
	var mazo = null; //obtener de BD
	var session = null;
	var oponente = null;

	var cartasMesa = null; //objeto Mesa..

	var getId = function(){
		return session.getId();
	}

	var datosPublicosJugador = function () {
		return {
			username: getUsername(),
			vidas: vidas,
			cantidadCartasMazo: mazo.cantidadCartasRestantes(),
			cantidadCartasMano: mano.length
		}
	}

	
	/* //Private var datosPrivadosJugador= function () {
			return {
				nombreMazo: mazo.nombre,
				mano: mano			
			}
		}
	*/
	var iniciarSesion = function(loginData, client){

		//..... TODO : pedirle a la BD y validar LoginData ........
		var loginValido = true;

		if(!loginValido){
			return null;
		}

		session = new Session(loginData, client);
		mazo = Mazo.generar(25);//new Mazo(); //obtener de BD.

		return session; 
	}

	var send = function(msj){
		session.send(msj);
	}

	var robarCartas = function(cantidadCartas){

		var cartas = mazo.robar(cantidadCartas);

		for (var i = 0; i < cartas.length; i++) {
			mano.push(cartas[i]);
		};

		send(messageFactory.msjRobarCartas(cartas, mazo.cantidadCartasRestantes()));
	}


	var bajarCarta = function (carta) {
		cartasMano.splice(cartasMano.indexOf(carta), 1);
		cartasJuego.push(carta);
	}

	var estaConectado = function () {
		return !session.isClosed(); // session != null;
	}

	var desconectar = function(){
		session.cerrar();
		//session = null;
	}

	var getUsername = function(){
		return session.getUsername();
	}

	return {
		getId: getId,
		datosPublicosJugador: datosPublicosJugador,
		iniciarSesion: iniciarSesion,
		send: send,
		robarCartas: robarCartas,
		bajarCarta: bajarCarta,
		estaConectado: estaConectado,
		desconectar: desconectar,
		getUsername: getUsername

	}

	/*
	return {
		getId: function(){
			return this.session.getId();
		},

		datosJugador: function () {
			return {
				username: session.getUsername(),
				vidas: 
				nombreMazo: mazo.nombre;
				cartasMazo: mazo.cantidadCartas();
				cartasMano: mano.length;

			}
		}

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
	} */
}

module.exports = Jugador;