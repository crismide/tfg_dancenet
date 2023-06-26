const mongoose = require('mongoose');
const ProcesoCreativo = require('../models/procesoCreativo.model').ProcesoCreativo;
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
  procesoCreativos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProcesoCreativo'
  }],
  ideas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Idea'
  }]
});

userSchema.methods.addProcesoCreativo = function (procesoCreativoId) {
    this.procesoCreativos.push(procesoCreativoId);
};

userSchema.methods.addIdea = function (ideaId) {
    this.ideas.push(ideaId);
};

const User = mongoose.model('User', userSchema);

module.exports = User;