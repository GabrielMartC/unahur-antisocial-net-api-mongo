const Comment = require('../models/comment')
const {validarById}= require('./generic.middleware')

const validarCommentById = validarById(Comment)

module.exports ={validarCommentById}