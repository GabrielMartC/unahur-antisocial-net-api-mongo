const Post_Images =require('../models/postImages')
const Post =require('../models/post')
const {validarById}= require('./generic.middleware')

const validarPost_ImagesById = validarById(Post_Images)
const validarPostById = validarById(Post)

module.exports ={validarPost_ImagesById , validarPostById}