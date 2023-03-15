const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const wordSchema = mongoose.Schema(
    {
        dictionary_id:{
            type: String,
            required: true,
        },
        word: {
            type: String,
            required: true,
            index: true,
        },
        mean: {
            type: String,
            required: true,
        },
    }
)

wordSchema.plugin(toJSON);
wordSchema.plugin(paginate);

const word = mongoose.model('Word', wordSchema)

module.exports = word