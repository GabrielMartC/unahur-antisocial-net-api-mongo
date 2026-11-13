const JOI = require('joi')

const schemaAsociarTag = JOI.object
    ({
        idTag: JOI.string().hex().length(24).required().messages({
            'string.base': '{#label} debe ser un texto',
            'any.required': '{#label} es requerido',
            }
        )
    }).unknown(false).messages({
            'object.unknown': 'El atributo {#label} no está permitido'
    });

module.exports = {schemaAsociarTag};