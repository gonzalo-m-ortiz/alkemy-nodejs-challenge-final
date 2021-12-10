# Alkemy Node.js Challenge


## Tabla de Contenidos
* [Descripción del Proyecto](#descProyecto)
    + [Propósito](#descProyecto-proposito)
    + [Resumen](#descProyecto-resumen)
    + [Repositorio Anterior](#descProyecto-repo)
* [Documentación API](#docAPI)
* [Documentación Project Structure](#docPJ)
* [Instalación](#inst)
    1.  [Instalar Dependencias](#inst-1)
    1.  [Crear .env](#inst-2)
    1.  [Configurar Base de Datos](#inst-3)
    1.  [Ejecutar](#inst-4)
    1.  [Ejecutar Tests](#inst-5)
* [Uso](#uso)


## Descripción del Proyecto <a name="descProyecto"></a>



#### Propósito <a name="descProyecto-proposito"></a>

El propósito del proyecto es desarrollar una RESTful API que cumpla los [requisitos][challengeDocumentLink].


#### Resumen <a name="descProyecto-resumen"></a>

Para hacer un resumen, sería crear un servidor que en Node utilizando como ejes principales Express y Sequelize. El servidor expondría una API con CRUD completos de algunas entidades. Estas entidades tienen imágenes asociadas y están relacionadas entre sí. Sus rutas se protegen con autenticación que se obtiene en los endpoint de Registro e Inicio de Sesión.


#### Repositorio Anterior <a name="descProyecto-repo"></a>

Aclaro que la aplicación se desarrolló en otro repositorio. El propósito de crear este es ordenar mejor los commits según los requisitos, para que resulte más sencillo evaluar el proyecto. Hubo algunos cosas que hice por primera vez, como manejar imágenes, que provocaron hacer modificaciones sobre el código ya hecho. 
Dejo el [repositorio anterior][repositorioOriginal] por si se quiere ver el orden original del código.




## Documentación API <a name="docAPI"></a>

[Documentación aquí][docAPIPostman]




## Documentación Project Structure <a name="docPJ"></a>

[Documentación aquí][docProjStruc]




## Instalación <a name="inst"></a>

Después de descargar el repositorio:

#### 1.  Instalar Dependencias <a name="inst-1"></a>

```bash
npm install
```

#### 2.  Crear .env <a name="inst-2"></a>

* Crear archivo ".env" en el directorio base
* Copiarle la información del archivo ".envExample"



#### 3.  Configurar Base de Datos <a name="inst-3"></a>

* Crear Base de Datos Manualmente (PostgreSQL, MySQL, SQL Server, MariaDB)
* En el caso de PostgreSQL, modificar `DATABASE_URL` en ".env"
* Para otra base de datos, instalar dependencias y modificar "src/config" y "src/db" según corresponda.


#### 4.  Ejecutar <a name="inst-4"></a>

Iniciar servidor
```bash
npm start
```
Iniciar servidor con logger lindo en consola
```bash
npm run dev
```


#### 5.  Ejecutar Tests <a name="inst-5"></a>

(Con el servidor iniciado)
```bash
npm test
```


## Uso <a name="uso"></a>

[Postman Collection][postmanCollection]

[Documentación API][docAPIPostman]




[challengeDocumentLink]: https://github.com/gonzalo-m-ortiz/alkemy-nodejs-challenge-final/tree/master/docs/Challenge_Backend_Node.pdf
[repositorioOriginal]: https://github.com/gonzalo-m-ortiz/alkemy-nodejs-challenge
[docAPIPostman]: https://documenter.getpostman.com/view/13920110/UVR4MpkG
[docProjStruc]: https://github.com/gonzalo-m-ortiz/alkemy-nodejs-challenge-final/tree/master/docs/projectStructure.md
[postmanCollection]: https://github.com/gonzalo-m-ortiz/alkemy-nodejs-challenge-final/tree/master/docs/postman_collection.json
