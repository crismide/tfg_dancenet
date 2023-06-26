const mongoose = require('mongoose');

const recorridoEspacialSchema = mongoose.Schema({
  image: {
    type: String,
    required: true
  }
});

const RecorridoEspacial = mongoose.model('RecorridoEspacial', recorridoEspacialSchema);
module.exports = RecorridoEspacial;