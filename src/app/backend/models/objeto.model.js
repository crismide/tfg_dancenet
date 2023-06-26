const mongoose = require('mongoose');
const Participante = require('../models/participante.model');
const PautaMovimiento = require('../models/pautaMovimiento.model');

const objetoSchema = mongoose.Schema({
  image: {
    type: String,
    required: true
  },
  participantes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participante'
  }],
  responsable: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participante'
  },
  pautaMovimiento: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PautaMovimiento'
  }
});

objetoSchema.methods.addPautaMovimiento = function (pautaMovimientoId) {
  this.pautaMovimiento=pautaMovimientoId;
};

objetoSchema.methods.addParticipante = function (participanteId) {
  this.participantes.push(participanteId);
};

objetoSchema.methods.addResponsable = function (responsableId) {
  this.responsable=responsableId;
};

const Objeto = mongoose.model('Objeto', objetoSchema);
module.exports = Objeto;