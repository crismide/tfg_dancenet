const mongoose = require('mongoose');
const Participante = require('../models/participante.model');
const Idea = require('../models/idea.model');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  participantes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participante'
  }],
  ideas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Idea'
  }]
});

userSchema.methods.addParticipante = function (participanteId) {
    this.participantes.push(participanteId);
};

userSchema.methods.addIdea = function (ideaId) {
    this.ideas.push(ideaId);
};

const User = mongoose.model('User', userSchema);

module.exports = User;