const User =require('../models/user')
const {validarById}= require('./generic.middleware')

const validarUserById = validarById(User)

module.exports ={validarUserById}