const { Router } = require('express')
const router = Router()
const Tag = require('../models/tag')
const { controllerTag } = require('../controllers')
const {validarTagById} =require('../middlewares/tag.middleware')
const {validarSchema} = require('../middlewares/generic.middleware')
const {validarUnico} = require('../middlewares/generic.middleware')
const {schemaTag} = require('../schemas/tag.schema')


/**
 * @openapi
 * components:
 *   schemas:
 *     Tag:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         name: { type: string, minLength: 5, maxLength: 15 }
 *     TagInput:
 *       type: object
 *       required: [name]
 *       properties:
 *         name: { type: string, minLength: 5, maxLength: 15 }
 */

/**
 * @openapi
 * /tag:
 *   get:
 *     tags: [Tag]
 *     summary: Lista todos los tags
 *     responses:
 *       200:
 *         description: Lista de tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Tag' }
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.get('/', controllerTag.getTags)

/**
 * @openapi
 * /tag/{id}:
 *   get:
 *     tags: [Tag]
 *     summary: Obtiene un tag por id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Tag encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Tag' }
 *       404:
 *         description: Tag no encontrado
 *       500:
 *         description: Error interno
 */
router.get('/:id', validarTagById, controllerTag.getTagByPk)

/**
 * @openapi
 * /tag:
 *   post:
 *     tags: [Tag]
 *     summary: Crea un tag
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/TagInput' }
 *     responses:
 *       201:
 *         description: Tag creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Tag' }
 *       400:
 *         description: Datos inválidos (falla el schema)
 *       409:
 *         description: Ya existe un tag con ese nombre
 *       500:
 *         description: Error interno
 */
router.post('/', validarSchema(schemaTag), validarUnico(Tag, "name"), controllerTag.createTag)

/**
 * @openapi
 * /tag/{id}:
 *   put:
 *     tags: [Tag]
 *     summary: Actualiza un tag
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/TagInput' }
 *     responses:
 *       200:
 *         description: Tag actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Tag' }
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Tag no encontrado
 *       409:
 *         description: Ya existe un tag con ese nombre
 *       500:
 *         description: Error interno
 */
router.put('/:id',validarTagById, validarUnico(Tag, "name"), validarSchema(schemaTag), controllerTag.updateTag)

/**
 * @openapi
 * /tag/{id}:
 *   delete:
 *     tags: [Tag]
 *     summary: Elimina un tag y lo quita de los posts que lo usaban
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Tag eliminado
 *       404:
 *         description: Tag no encontrado
 *       500:
 *         description: Error interno
 */
router.delete('/:id', validarTagById, controllerTag.deleteTag)

module.exports = router