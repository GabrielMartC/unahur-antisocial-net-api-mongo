const JOI = require('joi')

const schemaPost = JOI.object
    ({
        content: JOI.string().max(1000).required().messages({
            'string.base': '{#label} debe ser un texto',
            'string.empty': '{#label} no puede estar vacío',
            'string.max': '{#label} debe tener como máximo {#limit} caracteres',
        })

    }).unknown(false).messages({
        'object.unknown': 'El atributo {#label} no está permitido'
    })

module.exports = {schemaPost};