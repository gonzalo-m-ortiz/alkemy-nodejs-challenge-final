# Alkemy Node.js Challenge


## Tabla de Contenidos
* [Descripción del Proyecto](#descProyecto)
    + [Propósito](#descProyecto-proposito)
    + [Resumen](#descProyecto-resumen)
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

Crear un servidor en Node utilizando como ejes principales Express y Sequelize. El servidor expondría varios "CRUDs" de algunas entidades. Las entidades pueden tener imágenes y están relacionadas entre sí. Las rutas se protegen con autenticación que se obtiene en los endpoints de "Registro" e "Inicio de Sesión".


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
[docAPIPostman]: https://documenter.getpostman.com/view/13920110/UVR4MpkG
[docProjStruc]: https://github.com/gonzalo-m-ortiz/alkemy-nodejs-challenge-final/tree/master/docs/projectStructure.md
[postmanCollection]: https://github.com/gonzalo-m-ortiz/alkemy-nodejs-challenge-final/tree/master/docs/postman_collection.json
