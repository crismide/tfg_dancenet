const mongoose = require('mongoose');
const Escena = require('../models/escena.model');

const participanteSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required:true
  },
  escenas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Escena'
  }],
});

participanteSchema.methods.addEscena = function (escenaId) {
  this.escenas.push(escenaId);
};

const Participante = mongoose.model('Participante', participanteSchema);
module.exports = Participante;