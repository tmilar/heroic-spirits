var cartaInvocacionMiyamoto = {
	_id: null,
	nombre: "Miyamoto Musashi",
	tipo: "Espiritu Heroico" ,//
	subtipo: "Espadachin",
	stats: Stats(7,0,8),
	poderInvocacion: "Normal",
	habilidades: {
		//"rapidez, atravesar, furia"
		
	},
}

function Stats(ataque, defensa, vida){
	
	return {
		sinVida: function(){
			return vida <= 0;
		},
		set: function(statsSet){
			this.ataque = statsSet.ataque;
			this.defensa = statsSet.defensa;
			this.vida = statsSet.vida;
		},
		modificar: function(statsModificacion){
			this.ataque += statsModificacion.ataque;
			this.defensa += statsModificacion.defensa;
			this.vida += statsModificacion.vida;
		},
		ataque: ataque,
		defensa: defensa,
		vida: vida
	}

}