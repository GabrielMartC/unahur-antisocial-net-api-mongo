const JOI = require('joi')

const schemaTag = JOI.object
    ({
        name: JOI.string().min(5).max(15).required().messages({
            'string.base': '{#label} debe ser un texto',
            'string.empty': '{#label} no puede estar vacío',
            'string.min': '{#label} debe tener como mínimo {#limit} caracteres',
            'string.max': '{#label} debe tener como máximo {#limit} caracteres',
        })

    }).unknown(false).messages({
        'object.unknown': 'El atributo {#label} no está permitido'
    })

module.exports = {schemaTag};