const JOI = require('joi')

const schemaComment = JOI.object
    ({
        PostId: JOI.string().hex().length(24).required().messages({
            'string.base': '{#label} debe ser un texto',
            'any.required': '{#label} es requerido',
        }),
        content: JOI.string().max(150).required().messages({
            'string.base': '{#label} debe ser un texto',
            'string.empty': '{#label} no puede estar vacío',
            'string.max': '{#label} debe tener como máximo {#limit} caracteres',
            'any.required': '{#label} es requerido',
        }),
        fechaCreacion: JOI.date().iso()

    }).unknown(false).messages({
        'object.unknown': 'El atributo {#label} no está permitido'
    })

module.exports = {schemaComment};