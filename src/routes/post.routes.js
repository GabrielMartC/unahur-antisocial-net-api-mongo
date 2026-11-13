const { Router } = require('express')
const router = Router()

const { controllerPost } = require('../controllers')
const {validarPostById, validarTagNoAsociado} =require("../middlewares/post.middleware")
const {validarSchema} = require('../middlewares/generic.middleware')
const {schemaPostImage} = require('../schemas/postImage.schema')
const {schemaPost} = require('../schemas/post.schema')
const {schemaAsociarTag} = require('../schemas/tagAsociar.schema')
const {validarUnico} = require('../middlewares/generic.middleware')
const {validarTagExistenteEnBody} = require('../middlewares/tag.middleware')
const Tag  = require('../models/tag')

/**
 * @openapi
 * components:
 *   schemas:
 *     PostImage:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         url: { type: string }
 *     PostDetail:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         autor: { type: string }
 *         content: { type: string, maxLength: 1000 }
 *         images:
 *           type: array
 *           items: { $ref: '#/components/schemas/PostImage' }
 *         tags:
 *           type: array
 *           items: { type: string }
 *         comments:
 *           type: array
 *           items: { $ref: '#/components/schemas/CommentVisible' }
 *     CommentVisible:
 *       type: object
 *       properties:
 *         content: { type: string }
 *         fechaCreacion: { type: string, format: date-time }
 *     PostInput:
 *       type: object
 *       required: [content]
 *       properties:
 *         content: { type: string, maxLength: 1000 }
 *     ImageInput:
 *       type: object
 *       required: [url]
 *       properties:
 *         url: { type: string }
 *     TagAssociateInput:
 *       type: object
 *       required: [idTag]
 *       properties:
 *         idTag: { type: string }
 */

/**
 * @openapi
 * /post:
 *   get:
 *     tags: [Post]
 *     summary: Lista todos los posts con sus comentarios visibles
 *     responses:
 *       200:
 *         description: Lista de posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/PostDetail' }
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.get('/', controllerPost.getPosts)

/**
 * @openapi
 * /post/{id}:
 *   get:
 *     tags: [Post]
 *     summary: Obtiene un post por id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Post encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PostDetail' }
 *       404:
 *         description: Post no encontrado
 *       500:
 *         description: Error interno
 */
router.get('/:id',validarPostById, controllerPost.getPostByPk)

/**
 * @openapi
 * /post/{id}/images:
 *   get:
 *     tags: [Post]
 *     summary: Lista las imágenes de un post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Imágenes del post
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/PostImage' }
 *       404:
 *         description: Post no encontrado
 *       500:
 *         description: Error interno
 */
router.get('/:id/images',validarPostById, controllerPost.getImagesByPostId) //Obtener todas las imágenes asociadas a una publicación

/**
 * @openapi
 * /post/{id}/comment:
 *   get:
 *     tags: [Post]
 *     summary: Lista los comentarios visibles de un post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Comentarios del post
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/CommentVisible' }
 *       404:
 *         description: Post no encontrado
 *       500:
 *         description: Error interno
 */
router.get('/:id/comment',validarPostById, controllerPost.getCommentsByPostId) //Obtener los comentarios visibles de una publicación en particular

/**
 * @openapi
 * /post/{id}/tag:
 *   get:
 *     tags: [Post]
 *     summary: Lista los tags asociados a un post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Tags del post
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Tag' }
 *       404:
 *         description: Post no encontrado
 *       500:
 *         description: Error interno
 */
router.get('/:id/tag',validarPostById, controllerPost.getTagsByPostId) //Obtener todas las etiquetas asociadas a una publicación

/**
 * @openapi
 * /post/{id}/images:
 *   post:
 *     tags: [Post]
 *     summary: Agrega una imagen a un post mediante su URL
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ImageInput' }
 *     responses:
 *       201:
 *         description: Imagen agregada, devuelve todas las imágenes del post
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/PostImage' }
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Post no encontrado
 *       500:
 *         description: Error interno
 */
router.post('/:id/images',validarPostById, validarSchema(schemaPostImage), controllerPost.addImageToPost) //Agregar una imagen a una publicación mediante su URL

/**
 * @openapi
 * /post/{id}/tag:
 *   post:
 *     tags: [Post]
 *     summary: Asocia un tag existente a un post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/TagAssociateInput' }
 *     responses:
 *       201:
 *         description: Tag asociado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje: { type: string }
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Post o tag no encontrados
 *       409:
 *         description: El tag ya está asociado al post
 *       500:
 *         description: Error interno
 */
router.post('/:id/tag',validarPostById, validarSchema(schemaAsociarTag), validarTagExistenteEnBody, validarTagNoAsociado, controllerPost.addTagToPost) //agregar un tag a un post

/**
 * @openapi
 * /post/{id}:
 *   put:
 *     tags: [Post]
 *     summary: Actualiza el contenido de un post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/PostInput' }
 *     responses:
 *       200:
 *         description: Post actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PostDetail' }
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Post no encontrado
 *       500:
 *         description: Error interno
 */
router.put('/:id',validarPostById, validarSchema(schemaPost), validarUnico(Tag, "name"),controllerPost.updatePost)

/**
 * @openapi
 * /post/{id}:
 *   delete:
 *     tags: [Post]
 *     summary: Elimina un post y sus comentarios
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Post eliminado
 *       404:
 *         description: Post no encontrado
 *       500:
 *         description: Error interno
 */
router.delete('/:id',validarPostById, controllerPost.deletePost)

/**
 * @openapi
 * /post/{id}/images/{imgId}:
 *   delete:
 *     tags: [Post]
 *     summary: Quita una imagen de un post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: imgId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Imagen eliminada
 *       404:
 *         description: Post o imagen no encontrados
 *       500:
 *         description: Error interno
 */
router.delete('/:id/images/:imgId',validarPostById, controllerPost.deleteImageToPost) //Quitar una imagen de una publicación en particular

/**
 * @openapi
 * /post/{id}/tag/{tagId}:
 *   delete:
 *     tags: [Post]
 *     summary: Desasocia un tag de un post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Tag desasociado
 *       404:
 *         description: Post o tag no encontrados
 *       500:
 *         description: Error interno
 */
router.delete('/:id/tag/:tagId', validarPostById, controllerPost.dissociateTagToPost) //Desasociar una etiqueta de una publicación


module.exports = router