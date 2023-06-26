const mongoose = require('mongoose');
const Escena = require('../models/escena.model');
const Idea = require('../models/idea.model');
const Participante = require('../models/participante.model');

const procesoCreativoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
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

const ProcesoCreativo = mongoose.model('ProcesoCreativo', procesoCreativoSchema);
module.exports = ProcesoCreativo;
