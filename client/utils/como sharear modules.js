
//Exportar un modulo que sirva tanto al Servidor como al Cliente

(function(module){

	
	var Export_Item = //....codigo aqui.....

   module.exports = Export_Item;

})(typeof module === 'undefined'? this['export-item']={}: module);
