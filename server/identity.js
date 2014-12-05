var Identity_generator = function(prefix){
	return {
		max_id: 0,
		next: function(){
			this.max_id++;
			var rv = "";
			if(prefix){
				rv = prefix +""+ this.max_id;
			}
			else{
				rv = ""+ this.max_id;
			}

			console.log(rv);
			return rv;

		}
	}
}

module.exports = Identity_generator;