const JOI = require('joi')

const schemaPostImage = JOI.object
    ({
        url: JOI.string().uri().required().messages({
            'string.base': '{#label} debe ser una direccion url',
            'string.uri': '{#label} debe ser una dirección URL válida',
            'string.empty': '{#label} no puede estar vacío',
            'any.required': '{#label} es requerido'
        })

    }).unknown(false).messages({
        'object.unknown': 'El atributo {#label} no está permitido'
    })

module.exports = {schemaPostImage};