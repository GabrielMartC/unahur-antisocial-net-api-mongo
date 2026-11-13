const mongoose = require('mongoose');

const validarById = (modelo, opciones = {}) => {

    const {
        fuente = 'params',
        campo = 'id',
        propiedad = modelo.modelName.toLowerCase()
    } = opciones;

    return async (req, res, next) => {
        try {
            const id = req[fuente][campo];

            console.log('ID recibido:', id);

            if (!mongoose.isObjectIdOrHexString(id)) {
                return res.status(400).json({
                    error_message: `El id ${id} debe ser un ObjectId válido`
                });
            }

            const instance = await modelo.findById(id);

            if (!instance) {
                return res.status(404).json({
                    error_message: `El ${modelo.modelName} con id ${id} no fue encontrado.`
                });
            }

            // Guardamos el documento para los siguientes middlewares.
            req[propiedad] = instance;

            next();

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Error interno'
            });
        }
    };
};


const validarSchema = (schema) => {
    return (req, res, next) => {
        const dataAValidar = req.body
        const result = schema.validate(dataAValidar, {abortEarly:false})
        if (result.error){
            return res.status(400).json({ //400 Bad Request
                errores: result.error.details.map( e=> {
                    return {atributo: e.path[0], error: e.message }
                })
            })
        }
        req.body = result.value; //los datos que continúen hacia el controller sean los valores procesados por Joi
        
        next()
    }
}

const validarUnico = (Modelo, campo) => {
    return async (req, res, next) => {

        const valor = req.body[campo];

        const filtro = {
            [campo]: valor
        };

        const existente = await Modelo.findOne(filtro);

        if (existente) {
            return res.status(409).json({
                mensaje: `${campo} ya se encuentra registrado.`
            });
        }

        next();
    };
};

module.exports = { validarById, validarSchema, validarUnico};