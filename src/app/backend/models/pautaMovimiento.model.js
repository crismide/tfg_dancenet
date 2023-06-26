const mongoose = require('mongoose');
const Participante = require('../models/participante.model');

const pautaMovimientoSchema = mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    inicialTime:{
      type: Number
    },
    finalTime:{
        type: Number
    },
    participantes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Participante'
    }],
    level: {
        type: String,
        required: true
    }
  });
  
  pautaMovimientoSchema.methods.addParticipante = function (participanteId) {
    this.participantes.push(participanteId);
  };

const PautaMovimiento = mongoose.model('PautaMovimiento', pautaMovimientoSchema);
module.exports = PautaMovimiento;