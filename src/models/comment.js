const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true
        },

        content: {
            type: String,
            required: true
        },

        fechaCreacion: {
            type: Date,
            default: Date.now
        },
    },

    {
        timestamps: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const maxMeses = parseInt(process.env.COMMENT_MAX_MESES, 10);
commentSchema.virtual('isVisible').get(function () {

    const fechaLimite = new Date();
    fechaLimite.setMonth(fechaLimite.getMonth() - maxMeses);

    return this.fechaCreacion >= fechaLimite;
});

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment;