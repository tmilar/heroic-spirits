 

//helper para obtener el valor de un atributo de una clase que no necesariamente existe.
var getCSS = function (prop, fromClass) {

    console.log("clases  ingresdas:"+fromClass);
    
	//reviso si son varias clases
	var classes = fromClass.split(" ");
    console.log("split:"+JSON.stringify(classes));
    
    for (var i = 0; i < classes.length; i++) {
    	classes[i]= classes[i].slice(1);
    	console.log("clase numero "+i+ " es: " + classes[i]);
    };
	// var $inspector = $("<div>1</div>");//.css('display', 'none');	
 //    console.log("inspector:"+$inspector.toString());
    
    var $superInspector =$("<div>0</div>");//.css('display', 'none');
 
 	var $superDiv = $('<div class="'+classes[0]+'">,,'+0+",,</div>");

		var $div = $('<div class="'+classes[1]+'">,,,'+1+"</div>");
		$div.appendTo($superDiv);

    for (var i = 0; i < classes.length; i++) {

		 $superDiv = $div;
		var $div = $('<div class="'+classes[i]+'">,,,,,,'+i+"</div>");
		$div.appendTo($superDiv);

        // $superInspector.append($inspector.addClass(classes[i]));
        // $inspector =  $superInspector;
        // $superInspector = $("<div>-"+i+"</div>").text("i.. "+i);	
	}
 //    var ultimaClase= classes.length-1;
	// $inspector.addClass(classes[ultimaClase]);

	$("body").append($superDiv); // add to DOM, in order to read the CSS property
	try {
		return $superDiv.css(prop);
	} finally {
		// $superInspector.remove(); // and remove from DOM
	}
};

// now call it
$(document).ready(function  () {
	

	$("#btn").click(function(){

		console.log(getCSS('width', '.hola .chau'));
	})
})