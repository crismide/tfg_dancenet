const mongoose = require('mongoose');
const Escena = require('../models/escena.model');

const ensayoSchema = mongoose.Schema({
  fecha: {
    type: Date,
    required: true
  },
  escenas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Escena'
  }]
});

ensayoSchema.methods.addEscena = function (escenaId) {
    this.escenas.push(escenaId);
};

const Ensayo = mongoose.model('Ensayo', ensayoSchema);
module.exports = Ensayo;