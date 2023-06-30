const mongoose = require('mongoose');
const Escena = require('../models/escena.model');
const Idea = require('../models/idea.model');
const Participante = require('../models/participante.model');
const Ensayo = require('../models/ensayo.model');

const procesoCreativoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  portada:{
    type: String
  },
  escenas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Escena'
  }],
  ideas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Idea'
  }],
  participantes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participante'
  }],
  ensayos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ensayo'
  }]
});

procesoCreativoSchema.methods.addEscena = function (escenaId) {
  this.escenas.push(escenaId);
};

procesoCreativoSchema.methods.addIdea = function (ideaId) {
  this.ideas.push(ideaId);
};

procesoCreativoSchema.methods.addParticipante = function (participanteId) {
  this.participantes.push(participanteId);
};

procesoCreativoSchema.methods.addEnsayo = function (ensayoId) {
  this.ensayos.push(ensayoId);
};

const ProcesoCreativo = mongoose.model('ProcesoCreativo', procesoCreativoSchema);
module.exports = ProcesoCreativo;
