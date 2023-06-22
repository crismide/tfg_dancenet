const mongoose = require('mongoose');

const escenaSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

const Escena = mongoose.model('Escena', escenaSchema);
module.exports = Escena;