# Project Structure explanation

## [- src][src]
Dentro de src está la aplicación completa.

### [----- bin][bin]
Requiere la app desde [server] y se inicia el servidor http.

### [----- server][server]
Crea y exporta la app de express, añadiendo los "middlewares", las "routes" y sus manejadores de errores.

### [----- config][config]
Se guarda la configuración básica del proyecto.
	
### [----- db][db]
Usando Sequelize se crea y exporta la conexión con la base de datos, que posee los "modelos" de los componentes.

### [----- utils][utils]
Directorio para guardar las "herramientas" que necesita la aplicación.

#### [----------------- errorManagment][errorsManagment]
Se define un módulo 'errorHandler', donde se envían todos los errores de la aplicación de manera centralizada.
Se definen las clases que se usan en la aplicación para "arrojar" errores personalizados con información extra.

#### [----------------- loggers][loggers]
Se crea el logger general. En este caso usé pino, falta la configuración y el destino de los logs.
También se define el logger para las request http.

#### [----------------- helpers][helpers]
Se guardan las clases con código útil que se usa en toda la aplicación. No contiene lógica del negocio.

##### [-------------------------------------------- apiHelper][apiHelper]
Funciones generales, algunas relacionadas a express.

##### [-------------------------------------------- validateHelper][validateHelper]
Funciones para ahorrar código en validaciones.

##### [-------------------------------------------- multerHelper][multerHelper]
Funciones para manejar la subida y almacenamiento de imágenes.

### [----- components][components]
Directorio para guardar todo lo que es la lógica de la aplicación.
La aplicación se estructura por componentes en vez de por "layers".

#### [----------------- component][component]
Directorio para guardar los layers del componente.

##### [-------------------------------------------- componentRoutes][componentRoutes]
Se definen los endpoints y se exportan a server. 
Por cada endpoint se define: 
    - route, 
    - middlewares, (como auth)
    - función del controlador del componente que se encarga de la lógica del endpoint

##### [-------------------------------------------- componentController][componentController]
Es el intermediario entre el service layer y los endpoint.
Separa la lógica del negocio de la 'web' layer.

##### [-------------------------------------------- componentService][componentService]
Contiene la lógica del negocio. 
Los datos recibidos se validan en esta capa.
Requiere y usa los datos desde db.
Los componentes se comunican entre sí en esta capa.

##### [-------------------------------------------- ComponentModel][ComponentModel]
Define el modelo de 'Sequelize' del componente y sus relaciones con lo demás modelos.
También define el schema de 'Joi' para las validaciones.


#

## [- public][public]
Directorio para guardar los archivos a exponer como "static".

#

## [- docs][docs]
Directorio para guardar archivos relacionados con la documentación.

#

## [- test][test]
Para los tests usé mohca + chai.
No están hechos de la mejor manera ni con las mejores prácticas.

#

[src]: https://github.com/gonzalo-m-ortiz/alkemy-nodejs-challenge-final/tree/master/src
[bin]: https://github.com/gonzalo-m-ortiz/alkemy-nodejs-challenge-final/tree/master/src/bin
[config]: https://github.com/gonzalo-m-ortiz/alkemy-nodejs-challenge-final/tree/master/src/config
[db]: https://github.com/gonzalo-m-ortiz/alkemy-nodejs-challenge-final/tree/master/src/db
[utils]: https://github.com/gonzalo-m-ortiz/alkemy-nodejs-challenge-final/tree/master/src/utils
[errorsManagment]: https://github.com/gonzalo-m-ortiz/alkemy-nodejs-challenge-final/tree/master/src/utils/errorsManagment
[loggers]: https://github.com/gonzalo-m-ortiz/alkemy-nodejs-challenge-final/tree/master/src/utils/loggers
[helpers]: https://github.com/gonzalo-m-ortiz/alkemy-nodejs-challenge-final/tree/master/src/utils/helpers
[apiHelper]: https://github.com/gonzalo-m-ortiz/alkemy-nodejs-challenge-final/tree/master/src/utils/helpers/apiHelper.js
[validateHelper]: https://github.com/gonzalo-m-ortiz/alkemy-nodejs-challenge-final/tree/master/src/utils/helpers/validateHelper.js
[multerHelper]: https://github.com/gonzalo-m-ortiz/alkemy-nodejs-challenge-final/tree/master/src/utils/helpers/multerHelper.js
[components]: https://github.com/gonzalo-m-ortiz/alkemy-nodejs-challenge-final/tree/master/src/components
[component]: https://github.com/gonzalo-m-ortiz/alkemy-nodejs-challenge-final/tree/master/src/components/movies
[componentRoutes]: https://github.com/gonzalo-m-ortiz/alkemy-nodejs-challenge-final/tree/master/src/components/movies/moviesRoutes.js
[componentController]: https://github.com/gonzalo-m-ortiz/alkemy-nodejs-challenge-final/tree/master/src/components/movies/moviesController.js
[componentService]: https://github.com/gonzalo-m-ortiz/alkemy-nodejs-challenge-final/tree/master/src/components/movies/moviesService.js
[ComponentModel]: https://github.com/gonzalo-m-ortiz/alkemy-nodejs-challenge-final/tree/master/src/components/movies/MovieModel.js
[public]: https://github.com/gonzalo-m-ortiz/alkemy-nodejs-challenge-final/tree/master/public
[docs]: https://github.com/gonzalo-m-ortiz/alkemy-nodejs-challenge-final/tree/master/docs
[test]: https://github.com/gonzalo-m-ortiz/alkemy-nodejs-challenge-final/tree/master/test
