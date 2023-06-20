const mongoose = require('mongoose');

const procesoCreativoSchema = mongoose.Schema({
  title: {
    type: String,
    required: false
  }, 
  completed: {
    type: Boolean,
    required: false
  }
});
const procesoCreativo = (module.exports = mongoose.model("procesoCreativo", procesoCreativoSchema));