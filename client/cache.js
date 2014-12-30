var cache = (function(){

	var items = [];
	return{
		add: function(item){
			items.push(item);
			logger.log("Agregue a la cache: "+JSON.stringify(item));
		},
		addMany: function(items_add){
			logger.log("Agregando a la cache: "+JSON.stringify(items_add));

			for (var i = 0; i < items_add.length; i++) {
				this.add(items_add[i]); 
			};
		},
		getItemById: function(item_id){
			for (var i = 0; i < items.length; i++) {
				if(items[i]._id === item_id){
					return items[i];
				}
			};
			return undefined;
		},
		getItems: function () {
			return items;
		},
		deleteItemById: function(item_id){
			for (var i = 0; i < items.length; i++) {
				if(items[i]._id === item_id){
					return items.splice(i, 1);
				}
			};
		}

	}
})();