# Unahur Anti-Social

![Imagen](./assets/ANTI-SOCIALNET.jpeg)

El proyecto tiene como objetivo desarrollar el backend de UnaHur Anti-Social Net, mediante una API REST que permita gestionar usuarios, publicaciones, imágenes, comentarios y etiquetas, garantizando la integridad de los datos. 

## Diagrama Modelo Documental

![Imagen](./assets/img_modelo_documental.png)


### Relaciones principales
| Entidad/vinculo | Decision/ubicacion | ¿Embebida o referencial? | Razon principal |
| --- | --- | --- | --- |
| **User – Post** | Ref en Post.author | Referencial | un usuario puede crear muchas publicaciones; cada publicación tiene un usuario autor. 
| **User – Comment** | Ref en Comment.user | Referencial | un usuario puede crear muchos comentarios; cada comentario tiene un usuario autor.
|**Post – Comment** | Ref en Comment.post | Referencial | una publicación puede recibir muchos comentarios; cada comentario corresponde a una publicación.
|**Post – Post_Images** | Subdocumentos en Post.images | Embebida | una publicación puede tener varias imágenes; cada imagen pertenece a una publicación.
|**Post – Tag** | Array de refs en Post.tags | Referencial | muchos tags pueden estar en muchos post


## Alcance funcional
El MVP contempla las siguiente funcionalidades:

- Usuarios: registrar usuarios identificados por un nickName único.

- Publicaciones: un usuario registrado puede crear una publicación con una descripción obligatoria y una fecha asociada. Una publicación puede tener cero, una o varias imágenes.

- Imágenes: en el alcance base se almacena la URL de cada imagen. Las imágenes pueden agregarse o quitarse después de crear la publicación.

- Comentarios: un usuario puede crear comentarios asociados a una publicación. Cada comentario debe identificar tanto a su autor como a la publicación a la que pertenece.

- Etiquetas: las publicaciones pueden tener etiquetas. Una misma etiqueta puede reutilizarse en varias publicaciones.

- Antigüedad de los comentarios: al consultar una publicación, no deben mostrarse los comentarios que superen la antigüedad máxima configurada en meses.

La visibilidad de un comentario por antiguedad se **calcula al consultar los datos**.
No debe guardarse como una columna persistida en la base de datos: la consigna pide representarla mediante un atributo virtual de Sequelize. La cantidad de meses debe obtenerse de una variable de entorno, sin necesidad de modificar el código para cambiarla.

## Modelos (models)

| Entidad | Responsabilidad | Datos y reglas principales |
|---|---|---|
| `user` | Representa a un usuario registrado. | `nickName` es único y no puede repetirse. |
| `post` | Representa una publicación realizada por un `user`, en una fecha determinada, con `postImages` embebidas y un array de ids de `tag`. | Tiene una descripción obligatoria y pertenece a un `User` autor. |
| `postImages` | Representa una imagen embebida a un `post`. | En el MVP alcanza con guardar la URL de la imagen. |
| `comment` | Representa un comentario realizado por un usuario sobre una publicación en una fecha determinada. | Pertenece al `User` autor y al `Post` comentado. Su visibilidad temporal se calcula, no se persiste. |
| `tag` | Representa una etiqueta que se puede asignar a publicaciones. | Una etiqueta puede estar asociada a muchas publicaciones y una publicación puede tener varias etiquetas. |

## Tecnologias

- Node.js
- Express
- Joi
- Mongoose
- Swagger UI (documentación interactiva de la API)

## Requisitos Previos
Antes de iniciar, instalar:

- [Node.js](https://nodejs.org/en/download) 
- [Git](https://git-scm.com/) 
- [Docker](https://www.docker.com/products/docker-desktop/)
- [Postman](https://www.postman.com/)

## Instalación y ejecución del proyecto

1. Clonar el repositorio:

   ```bash
   git clone https://gitea.unahur.edu.ar/Estrategia-de-persistencia-C2-2026/trabajo-practico-2-estrategicos-de-la-persistencia.git
   ```

2. Ingresar al directorio del proyecto:

   ```bash
   cd trabajo-practico-2-estrategicos-de-la-persistencia
   ```

3. Configurar las variables de entorno creando un archivo `.env`, siguiendo los valores indicados en `.env.example`.

4. Iniciar Docker Desktop y ejecutar el siguiente comando desde la raíz del proyecto para inicializar los contenedores definidos en `docker-compose.yml`:

   ```bash
   docker compose up -d
   ```

5. Instalar las dependencias del proyecto:

   ```bash
   npm install
   ```

6. Iniciar el servidor mediante el script definido en `package.json`:

   ```bash
   npm run dev
   ```
<br>

Una vez iniciado, el servidor estará disponible en:

```text
http://localhost:3000
```

La interfaz de administración de MongoDB (Mongo Express) estará disponible en:

```text
http://localhost:8081
```

## Ejecutar colección de pruebas de endpoints en Postman

1. Abrir Postman.
2. Seleccionar **Import**.
3. Importar el archivo `UnaHur_AntiSocial_Net.postman_collection.json`, ubicado en la carpeta `postman/` del proyecto.
4. Verificar que la variable `baseUrl` esté configurada como `http://localhost:3000`.
5. Seleccionar la colección y presionar **Run** para ejecutar las pruebas.

**Nota:** El servidor Express y MongoDB deben estar funcionando antes de ejecutar las pruebas. Algunas solicitudes crean, modifican y eliminan datos de prueba.

## Configuración de la conexión a MongoDB
   ```javascript
   const MONGO_URL =
   process.env.MONGO_URL ||
   "mongodb://admin:admin1234@localhost:27017/unahur_anti_social?authSource=admin";

   const connectToDatabase = async () => {
      try {
         mongoose.set("strictQuery", false);
         await mongoose.connect(MONGO_URL);
         console.log("Conexión a mongo con éxito");
      } catch (err) {
         console.error("Error al conectarse a mongo", err);
      }
   };

   module.exports = connectToDatabase;
   ```
## Endpoints

El proyecto cuenta con documentación interactiva de sus endpoints mediante Swagger, que permite consultar las rutas disponibles, sus métodos HTTP, parámetros, cuerpos de solicitud y respuestas.

La documentación se encuentra disponible en:

```text
http://localhost:3000/api-docs
```

### 1. USUARIOS (User)

| Verbo | Recurso | Status code | Descripción |
|---|---|---|---|
| GET | `/users` | 200 | Obtener todos los usuarios. |
| GET | `/users/:id` | 200, 400, 404, 500 | Obtener un usuario en particular. |
| GET | `/users/:id/post` | 200, 400, 404, 500 | Obtener todas las publicaciones de un usuario. |
| GET | `/users/:id/comments` | 200, 400, 404, 500 | Obtener todos los comentarios de un usuario. |
| POST | `/users` | 201, 400, 409, 500 | Crear un usuario. |
| POST | `/users/:id/post` | 201, 400, 404, 500 | Crear una publicación realizada por un usuario. |
| POST | `/users/:id/comment` | 201, 400, 404, 500 | Crear un comentario realizado por un usuario. |
| PUT | `/users/:id` | 200, 400, 404, 409, 500 | Modificar los datos de un usuario en particular. |
| DELETE | `/users/:id` | 200, 400, 404, 500 | Eliminar un usuario en particular. |

### 2. PUBLICACIONES (Post)

| Verbo | Recurso | Status code | Descripción |
|---|---|---|---|
| GET | `/post` | 200, 500 | Obtener todas las publicaciones. |
| GET | `/post/:id` | 200, 400, 404, 500 | Obtener una publicación en particular. |
| GET | `/post/:id/images` | 200, 400, 404, 500 | Obtener todas las imágenes asociadas a una publicación. |
| GET | `/post/:id/comment` | 200, 400, 404, 500 | Obtener los comentarios visibles de una publicación en particular. |
| GET | `/post/:id/tag` | 200, 400, 404, 500 | Obtener todas las etiquetas asociadas a una publicación. |
| POST | `/post/:id/images` | 201, 400, 404, 500 | Agregar una imagen a una publicación mediante su URL. |
| POST | `/post/:id/tags/:tagId` | 201, 400, 404, 409, 500 | Asociar una etiqueta existente a una publicación. |
| PUT | `/post/:id` | 200, 400, 404, 409, 500 | Modificar los datos de una publicación. |
| DELETE | `/post/:id` | 200, 400, 404, 500 | Eliminar una publicación en particular. |
| DELETE | `/post/:id/images/:imgId` | 200, 400, 404, 500 | Quitar una imagen de una publicación en particular. |
| DELETE | `/post/:id/tag/:tagId` | 200, 400, 404, 500 | Desasociar una etiqueta de una publicación. |

### 4. COMENTARIOS (Comment)

| Verbo | Recurso | Status code | Descripción |
|---|---|---|---|
| GET | `/comment` | 200 | Obtener todos los comentarios. |
| GET | `/comment/:id` | 200, 400, 404, 500 | Obtener un comentario en especifico. |
| PUT | `/comment/:id` | 200, 400, 404, 500 | Modificar los datos de un comentario en particular. |
| DELETE | `/comment/:id` | 200, 400, 404, 500 | Eliminar un comentario en particular. |

### 5. ETIQUETAS (Tag)

| Verbo | Recurso | Status code | Descripción |
|---|---|---|---|
| GET | `/tag` | 200, 500 | Obtener todas las etiquetas. |
| GET | `/tag/:id` | 200, 400, 404, 500 | Obtener una etiqueta en particular. |
| POST | `/tag` | 201, 400, 409, 500 | Crear una etiqueta. |
| PUT | `/tag/:id` | 200, 400, 404, 409, 500 | Modificar los datos de una etiqueta en particular. |
| DELETE | `/tag/:id` | 200, 400, 404, 500 | Eliminar una etiqueta en particular. |


## ¿Por qué se propone cada relación? ##

### **User → Post · 1:N · Referencial** ###
La cantidad de publicaciones de un usuario puede crecer continuamente. Guardar todos los IDs de posts dentro de User
produciría un array cada vez más grande. Mantener la referencia en cada Post evita inflar User y permite consultar las
publicaciones de un autor directamente.

### **User → Comment · 1:N · Referencial** ###
Un usuario puede escribir muchos comentarios y el sistema necesita poder consultarlos por autor. Mantenerlos en una
colección independiente permite obtenerlos sin recorrer las publicaciones ni guardar un array de comentarios dentro de
User.

### **Post → Comment · 1:N · Referencial** ###
Un post puede acumular muchos comentarios y el requisito exige filtrarlos por antigüedad. Una colección independiente
permite filtrar por fecha, ordenar y paginar los resultados sin cargar un array potencialmente ilimitado dentro de Post.

### **Post → Post_Images · 1:N · Embebida** ###
Las imágenes pertenecen a un post concreto y normalmente se muestran junto con él. Embebidas se recuperan en la
misma lectura y se eliminan junto con el Post, sin operaciones adicionales. Al eliminar el post, las imágenes se eliminan
junto a el, evitando eliminación en cascada en este caso.

### **Post ↔ Tag · N:M · Referencial** ###
Una publicación puede tener varias etiquetas y una misma etiqueta puede utilizarse en muchos posts. Un array de
referencias en Post representa esa relación sin duplicar los datos de Tag. Como la asociación no tiene atributos propios
en el alcance actual, no hace falta una colección intermedia.


## Decisiones para Post_Images y Comment

### ¿Las imágenes conviene embeberlas o guardarlas en otra colección?

> Decidimos embeberlas en Post como un array de subdocumentos.

- **Dependencia**: una imagen pertenece a una publicación concreta y no parece necesitar una vida independiente.
- **Lectura conjunta**: al mostrar un post normalmente también se muestran sus imágenes.
- **Borrado simple**: al borrar Post, sus imágenes embebidas desaparecen en la misma operación.
- **Gestión directa**: se pueden agregar, reordenar o quitar imágenes actualizando el documento Post.
**Qué se guarda en MongoDB**: Se guarda una URL. El archivo puede alojarse en un servicio externo. Eliminar el
subdocumento no elimina automáticamente el archivo externo.

### ¿Y los comentarios, considerando que pueden ser muchos y se filtran por fecha? ##

> Decidimos mantener Comment en una colección independiente, con una referencia obligatoria a Post y otra a User.

- Un post popular podría acumular miles de comentarios; embebidos, el array crecería sin un límite previsible.
- La colección independiente permite consultar solo los comentarios de un post y aplicar ordenamiento y paginación.
- También permite consultar los comentarios escritos por un usuario.

**Filtro por antigüedad**: definir un período configurable de X meses y calcular una fecha de corte.
Al consultar los comentarios visibles de un post, devolver solo los que sean posterior a ese límite. Los más antiguos dejan de mostrarse,
pero no necesariamente se borran del historial.

## Relación Post–Tag y políticas de borrado

### ¿Cómo representar Post–Tag (N:M)?
Guardar en Post un array de ObjectId que referencie documentos Tag. Así, cada Post puede tener varias etiquetas y un
mismo Tag puede estar asociado a distintos Posts. No se duplica el nombre ni el resto de los datos de la etiqueta.

- Evitar repetir una etiqueta dentro del mismo post.
- Antes de asociar, verificar que existan tanto Post como Tag: la referencia no garantiza esa existencia.

### ¿Qué pasa al borrar un Post?
El post esta relacionado con:

- User (referencia de User en Post)
- Post_image (embebidos en Post)
- Tag (array de referencias en Post)
- Comment (referencia de Post en Comment)

### ¿Qué pasa al borrar un User?
El usuario esta relacionado con:

- Post (referencia de User en Post)
- Comment (referencia de User en Comment)

Por lo cual al borrar un usuario:
- Para sus post, por medio de eliminación en cascada se eliminara de Post aquellos posteos que estaban asociados
a ese usuario.
- Para sus comentarios, por medio de eliminación en cascada se eliminara de Comment aquellos comentarios que
estaban asociados a ese usuario.

## Estructura del proyecto

```text

├── assets/              # Imagenes del README
├── postman/             # Colección de pruebas de endpoints
├── swagger/             # Configuración de Swagger y documentación de la API
├── src/
│   ├── config/          # Configuración de entorno y base de datos
│        └── db.js            # Conexión a MongoDB
│   ├── models/          # Modelos y esquemas de Mongoose
│   ├── routes/          # Definición de rutas
│   ├── controllers/     # Recepción y respuesta de solicitudes HTTP
│   ├── middlewares/     # Validación Joi y manejo de errores
|   ├── schemas/         # Validación de esquemas
│   └── index.js         # Configuración de Express
├── .env.example         # Plantilla para crear una variable de entorno
├── docker-compose.yml   # Configuración de contenedores MongoDB y Mongo Express mediante Docker Compose
├── package.json
├── package-lock.json
└── README.md

```