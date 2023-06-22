const mongoose = require('mongoose');

const ideaSchema = mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
    }
});

const Idea = mongoose.model('Idea', ideaSchema);
module.exports = Idea;