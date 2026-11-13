const { Router } = require('express')
const router = Router()
const User = require('../models/user')
const { controllerUser } = require('../controllers')
const { validarUserById } = require('../middlewares/user.middleware')
const { validarSchema } = require('../middlewares/generic.middleware')
const { validarUnico } = require('../middlewares/generic.middleware')
const { schemaUser } = require('../schemas/user.schema')
const { schemaPost } = require('../schemas/post.schema')
const { schemaComment } = require('../schemas/comment.schema')


/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         nickName: { type: string, minLength: 3, maxLength: 16 }
 *     UserInput:
 *       type: object
 *       required: [nickName]
 *       properties:
 *         nickName: { type: string, minLength: 3, maxLength: 16 }
 *     Post:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         autor: { type: string }
 *         content: { type: string }
 *     Comment:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         user: { type: string }
 *         post: { type: string }
 *         content: { type: string }
 *     Error:
 *       type: object
 *       properties:
 *         message: { type: string }
 */

/**
 * @openapi
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Lista todos los usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/User' }
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.get('/', controllerUser.getUser)

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Obtiene un usuario por id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno
 */
router.get('/:id', validarUserById, controllerUser.getUserByPk)

/**
 * @openapi
 * /users/{id}/post:
 *   get:
 *     tags: [Users]
 *     summary: Lista las publicaciones de un usuario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Publicaciones del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Post' }
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno
 */
router.get('/:id/post', validarUserById, controllerUser.getPostsByUserId) // Obtener todas las publicaciones de un usuario en particular.

/**
 * @openapi
 * /users/{id}/comment:
 *   get:
 *     tags: [Users]
 *     summary: Lista los comentarios hechos por un usuario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Comentarios del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Comment' }
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno
 */
router.get('/:id/comment', validarUserById, controllerUser.getCommentsByUserId) // Obtener todos los comentarios realizados por un usuario en particular

/**
 * @openapi
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Crea un usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UserInput' }
 *     responses:
 *       201:
 *         description: Usuario creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *       400:
 *         description: Datos inválidos (falla el schema)
 *       409:
 *         description: El nickName ya está registrado
 *       500:
 *         description: Error interno
 */
router.post('/', validarSchema(schemaUser), validarUnico(User, "nickName"), controllerUser.createUser)

/**
 * @openapi
 * /users/{id}/post:
 *   post:
 *     tags: [Users]
 *     summary: El usuario crea una publicación
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content: { type: string }
 *     responses:
 *       201:
 *         description: Publicación creada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Post' }
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno
 */
router.post('/:id/post', validarUserById, validarSchema(schemaPost), controllerUser.createPostByUserId) //Usuario crea una publicacion

/**
 * @openapi
 * /users/{id}/comment:
 *   post:
 *     tags: [Users]
 *     summary: El usuario comenta en una publicación
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [PostId, content]
 *             properties:
 *               PostId: { type: string, description: Id de la publicación a comentar }
 *               content: { type: string }
 *     responses:
 *       201:
 *         description: Comentario creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Comment' }
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Usuario o publicación no encontrados
 *       500:
 *         description: Error interno
 */
router.post('/:id/comment', validarUserById, validarSchema(schemaComment), controllerUser.createCommentByUserId) //Usuario crea un comentario, en un post

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Actualiza un usuario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UserInput' }
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Usuario no encontrado
 *       409:
 *         description: El nickName ya está registrado
 *       500:
 *         description: Error interno
 */
router.put('/:id', validarUserById, validarSchema(schemaUser), validarUnico(User, "nickName"), controllerUser.updateUser)

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Elimina un usuario y, en cascada, sus publicaciones y comentarios
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno
 */
router.delete('/:id', validarUserById, controllerUser.deleteUser)

module.exports = router