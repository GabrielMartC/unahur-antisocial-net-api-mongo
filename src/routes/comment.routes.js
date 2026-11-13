const {Router} = require('express')
const router = Router()
const {controllerComment} = require('../controllers')
const {validarCommentById} =require('../middlewares/comment.middleware')
const {validarSchema} = require('../middlewares/generic.middleware')
const {schemaComment} = require('../schemas/comment.schema')

/**
 * @openapi
 * components:
 *   schemas:
 *     CommentDetail:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         user: { type: string }
 *         post: { type: string }
 *         content: { type: string }
 *         fechaCreacion: { type: string, format: date-time }
 *         isVisible: { type: boolean, description: Si el comentario está dentro del plazo de meses configurado }
 *     CommentInput:
 *       type: object
 *       required: [PostId, content]
 *       properties:
 *         PostId: { type: string, minLength: 24, maxLength: 24, description: Id de 24 caracteres hexadecimales }
 *         content: { type: string, maxLength: 150 }
 *         fechaCreacion: { type: string, format: date-time }
 */

/**
 * @openapi
 * /comment:
 *   get:
 *     tags: [Comment]
 *     summary: Lista todos los comentarios
 *     responses:
 *       200:
 *         description: Lista de comentarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/CommentDetail' }
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.get('/', controllerComment.getComments)

/**
 * @openapi
 * /comment/{id}:
 *   get:
 *     tags: [Comment]
 *     summary: Obtiene un comentario por id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Comentario encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CommentDetail' }
 *       404:
 *         description: Comentario no encontrado
 *       500:
 *         description: Error interno
 */
router.get('/:id',validarCommentById, controllerComment.getCommentByPk)

/**
 * @openapi
 * /comment/{id}:
 *   put:
 *     tags: [Comment]
 *     summary: Actualiza un comentario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CommentInput' }
 *     responses:
 *       200:
 *         description: Comentario actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CommentDetail' }
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Comentario no encontrado
 *       500:
 *         description: Error interno
 */
router.put('/:id', validarCommentById, validarSchema(schemaComment), controllerComment.updateComment)

/**
 * @openapi
 * /comment/{id}:
 *   delete:
 *     tags: [Comment]
 *     summary: Elimina un comentario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Comentario eliminado
 *       404:
 *         description: Comentario no encontrado
 *       500:
 *         description: Error interno
 */
router.delete('/:id', validarCommentById, controllerComment.deleteComment)

module.exports = router