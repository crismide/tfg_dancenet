module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        nombre: String,
        autora: String,
        descripcion: String
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Proceso_Creativo = mongoose.model("proceso_creativo", schema);
    return Proceso_Creativo;
  };

/*const mongoose = require('mongoose')
const {Schema} = mongoose

const Proceso_Creativo = new Schema({
    nombre: String,
    autora: String,
    descripcion: String
})

module.exports = mongoose.model('Proceso_Creativo', Proceso_Creativo)*/

