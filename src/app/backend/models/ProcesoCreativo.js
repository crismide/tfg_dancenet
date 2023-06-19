const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let procesoCreativoSchema = new Schema({
  nombre: {
    type: String
  },
  autor: {
    type: String
  }
}, {
  collection: 'procesosCreativos'
})
module.exports = mongoose.model('procesosCreativos', procesoCreativoSchema)