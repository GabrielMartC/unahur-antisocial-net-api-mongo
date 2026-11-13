const mongoose = require("mongoose")

const postImgSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true
        },

    },

    {
        timestamps: false,
    }
);


module.exports = postImgSchema;