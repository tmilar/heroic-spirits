
var LogAction = function(msgLog){
    return function asd(){ console.log("Hola "+msgLog)  ;return "exito";};
}

console.log(LogAction.toString());
console.log(LogAction("prueba1").toString());
console.log(LogAction("prueba2")());

LogAction("prueba3")();

eval(LogAction("prueba4").toString())