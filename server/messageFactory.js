var messageFactory = {

    msjIniciarJuego: function(){
        return JSON.stringify({
                    operacion: "iniciarJuego" 
                });
    },


    msjConexionAutorizada: function(datosSession){
        return JSON.stringify({
                    operacion: "respuestaConexion",
                    session: datosSession
                });
    },

    msjLoginInvalido: function(){
        return JSON.stringify({
                    operacion: "respuestaConexion",
                    session: null,
                    mensaje: "No se pudo validar el login. Vuelva a intentarlo."
                });
    },

    msjBajarCarta: function(autorizado){
        return JSON.stringify({
                operacion: "bajarCarta",
                autorizado: autorizado
            });
    },
    msjRobarCartas: function(cartas, cartasRestantesMazo){
        return JSON.stringify({
                    operacion: "robarCartas",
                    cartas: cartas,
                    cartasRestantesMazo: cartasRestantesMazo
                });
    },

    msjJuegoComenzado: function(){
        return JSON.stringify({
                operacion: "respuestaConexion",
                session: null, 
                mensaje: "El juego ya comenzo! No pueden ingresar mas jugadores a la mesa."
            });
    },

    msjEmpezarTurno: function (nroTurno) {
        return JSON.stringify({
                operacion: "empezarTurno",
                nroTurno: nroTurno
        })
    },
    
    msjMesaLlena: function(oponente) {
        return JSON.stringify({
                operacion: "mesaLlena",
                oponente: oponente
        })
    },

    msjActualizarOponente: function(operacion, data, datosJugador) {
        return JSON.stringify({
                operacion: operacion,
                data: data,
                jugador: datosJugador
        })        
    }

}

module.exports = messageFactory;