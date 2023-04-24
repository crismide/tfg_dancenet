const mongoose = require('mongoose')
const {Schema} = mongoose

const Proceso_Creativo = new Schema({
    nombre: String,
    autora: String,
    descripcion: String
})

module.exports = mongoose.model('Proceso_Creativo', Proceso_Creativo)