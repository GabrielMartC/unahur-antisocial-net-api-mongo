const Tag =require('../models/tag')
const {validarById}= require('./generic.middleware')

const validarTagById = validarById(Tag)

const validarTagExistenteEnBody = async (req, res, next) => {
    try {
        const tag = await Tag.findById(req.body.idTag);

        if (!tag) {
            return res.status(404).json({
                message: 'Tag no encontrado'
            });
        }

        req.tag = tag;

        next();

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno'
        });
    }
};

module.exports ={validarTagById, validarTagExistenteEnBody}