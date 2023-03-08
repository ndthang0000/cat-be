const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const translationMemorySchema = mongoose.Schema(
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
        translate: {
            type: String,
            required: true,
        },
    }
)

translationMemorySchema.plugin(toJSON);
translationMemorySchema.plugin(paginate);

const translationMemory = mongoose.model('TranslationMemory', translationMemorySchema)

module.exports = translationMemory