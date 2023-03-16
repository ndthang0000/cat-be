const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const translateSchema = mongoose.Schema({
  project_id: {
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
});

translateSchema.plugin(toJSON);
translateSchema.plugin(paginate);

const translate = mongoose.model('translate', translateSchema);

module.exports = translate;
