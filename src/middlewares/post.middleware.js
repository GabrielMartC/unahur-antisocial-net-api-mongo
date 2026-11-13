const Post =require('../models/post')
const User =require('../models/user')

const {validarById}= require('./generic.middleware')
const validarPostById = validarById(Post)
const validarUserPostById = validarById(User)

const validarTagNoAsociado = (req, res, next) => {

    const yaAsociado = req.post.tags.some(
        id => id.toString() === req.tag._id.toString()
    );

    if (yaAsociado) {
        return res.status(409).json({
            message: 'El tag ya está asociado a este post'
        });
    }

    next();
};

module.exports ={validarPostById,validarUserPostById, validarTagNoAsociado}