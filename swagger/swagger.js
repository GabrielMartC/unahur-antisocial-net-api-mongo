const swaggerJSDoc = require('swagger-jsdoc');


const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'proyecto api',
            version: '1.0.0',
            description: 'PROYECTO RED ANTISOCIAL',
            contact: {
                name: 'Jonathan Puyol, Pablo Elias Andino Guasch, Gabriel Martinez '
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'servidor local'
            }
        ]
    },
    apis: ['./src/routes/*.js']
};

const specs =swaggerJSDoc(options); //al swaggerJSDoc le pasamos las opciones 
module.exports= specs