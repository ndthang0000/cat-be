const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const translationMemorySchema = mongoose.Schema(
    {
        translation_memory_code:{
            type: String,
            required: true,
        },
        source: {
            type: String,
            required: true,
            index: true,
        },
        target: {
            type: String,
            required: true,
        },
    }
)

translationMemorySchema.plugin(toJSON);
translationMemorySchema.plugin(paginate);

const translationMemory = mongoose.model('TranslationMemory', translationMemorySchema)

module.exports = translationMemory