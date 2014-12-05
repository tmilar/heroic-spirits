Heroic Spirits TCGO
===================

**Empezando primera iteracion.

Empezando cliente-servidor con algunos mensajes y algunos eventos. Problema: Dificultad para hacer andar la importacion de archivos.js, no se esta pudiendo entrar al logger.js desde el ui (juego.js)


<INSTRUCCIONES DE USO>
----------------------

CÓMO HACER PARA LEVANTAR EL SERVIDOR
------------------------------------

1) Instalar node.js en la PC (http://nodejs.org/)
2) Abrir consola de comandos
3) Pararse en el directorio donde se encuentre la carpeta .../heroic-spirits/server/
(para navegar en la consola usar el comando: DIR "directorio", ej: DIR "C:/Proyectos/heroic-spirits/server/")
4) Correr el servidor con el comando: node server.js

CÓMO ABRIR UN CLIENTE Y CONECTARSE
----------------------------------

1) Abrir en el navegador index.html
2) Verificar que la IP:puerto ingresada sea la del servidor (127.0.0.1, o la IP remota si no esta en nuestra PC)
3) Click en conectar.
4) Abrir más instancias del index.html en otras pestañas, conectarse.
5) Cuando hayan 2 conectados, que alguno haga click en INICIAR para empezar el juego.

Nota: observar los mensajes que va tirando el servidor en la consola de comandos, asi como los mensajes que va tirando el browser en su consola (para verlos, tocar F12 en Chrome -> Consola; o tambien se puede abrir con boton derecho-> inspeccionar elemento -> consola)