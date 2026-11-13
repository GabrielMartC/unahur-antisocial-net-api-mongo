const JOI = require('joi')

const schemaUser = JOI.object
    ({
        nickName: JOI.string().min(3).max(16).required().messages({
            'string.base': '{#label} debe ser un texto',
            'string.empty': '{#label} no puede estar vacío',
            'string.min': '{#label} debe tener como mínimo {#limit} caracteres',
            'string.max': '{#label} debe tener como máximo {#limit} caracteres',
            'any.required': '{#label} es requerido',
        })

    }).unknown(false).messages({
        'object.unknown': 'El atributo {#label} no está permitido'
    })

module.exports = {schemaUser};