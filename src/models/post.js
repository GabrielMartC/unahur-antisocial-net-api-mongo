const mongoose = require('mongoose');
const postImageSchema = require('./postImages');

const postSchema = new mongoose.Schema(
    {
        content: {
            type: String,
        },

        fechaCreacion: {
            type: Date,
            default: Date.now
        },

        autor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        images : [postImageSchema], //incrustacion

        tags: [{ //arrays de referencias de tags 
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tag"
        }]
    },

    {
        timestamp: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

postSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post',

    // Filtrar comentarios según su antigüedad
    match: () => {
        const maxMeses = parseInt(process.env.COMMENT_MAX_MESES, 10);

        if (!Number.isInteger(maxMeses) || maxMeses <= 0) {
            throw new Error('COMMENT_MAX_MESES debe ser un entero positivo');
        }

        const fechaLimite = new Date();
        fechaLimite.setMonth(fechaLimite.getMonth() - maxMeses);

        return {
            fechaCreacion: { $gte: fechaLimite }
        };
    }
});

const Post = mongoose.model('Post', postSchema)

module.exports = Post;