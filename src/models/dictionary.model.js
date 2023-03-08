const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const dictionarySchema = mongoose.Schema(
    {
        user_id:{
            type: String,
            required: true,
        },
        word: {
            type: String,
            required: true,
            index: true,
        },
        wordtype: {
            type: String,
        },
        mean: {
            type: String,
            required: true,
        },
    }
)

dictionarySchema.plugin(toJSON);
dictionarySchema.plugin(paginate);

const Dictionary = mongoose.model('Dictionary', dictionarySchema)

module.exports = Dictionary