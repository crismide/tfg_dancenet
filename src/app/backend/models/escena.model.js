const mongoose = require('mongoose');
const Idea = require('../models/idea.model');
const PautaMovimiento = require('../models/pautaMovimiento.model');
const RecorridoEspacial = require('../models/recorrido.espacial.model');
const Participante = require('../models/participante.model');
const Ensayo = require('../models/ensayo.model');
const Objeto = require('../models/objeto.model');

const escenaSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  ideas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Idea'
  }],
  pautasMovimiento: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PautaMovimiento'
  }],
  recorridosEspaciales: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RecorridoEspacial'
  }],
  participantes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participante'
  }],
  ensayos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ensayo'
  }],
  objetos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Objeto'
  }],
});

escenaSchema.methods.addIdea = function (ideaId) {
  this.ideas.push(ideaId);
};

escenaSchema.methods.addPautaMovimiento = function (pautaMovimientoId) {
  this.pautasMovimiento.push(pautaMovimientoId);
};

escenaSchema.methods.addRecorridoEspacial = function (recorridoEspacialId) {
  this.recorridosEspaciales.push(recorridoEspacialId);
};

escenaSchema.methods.addParticipante = function (participanteId) {
  this.participantes.push(participanteId);
};

escenaSchema.methods.addEnsayo = function (ensayoId) {
  this.ensayos.push(ensayoId);
};

escenaSchema.methods.addObjeto = function (objetoId) {
  this.objetos.push(objetoId);
};

const Escena = mongoose.model('Escena', escenaSchema);
module.exports = Escena;