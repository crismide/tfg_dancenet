const express = require('express');
const ProcesoCreativoRoute = express.Router();
var ProcesoCreativoSchema = require('../models/procesoCreativo.model')


ProcesoCreativoRoute.route('/crear-procesoCreativo').post(async (req, res) => {
  try {
    const modeloProcesoCreativo = new ProcesoCreativoSchema({
      title: req.body.title,
      completed: req.body.completed
    });
    await modeloProcesoCreativo.save();
    res.send({ status: true, message: 'Proceso creado con éxito' });
  } catch (error) {
    console.error(error); // Log the error message to the console
    res.send({ status: false, message: 'Error creando proceso' });
  }
});

ProcesoCreativoRoute.route('/procesosCreativos').get(async (req, res) => {
  try {
    const procesosCreativos = await ProcesoCreativoSchema.find();
    res.send({ status: true, data: procesosCreativos });
  } catch (error) {
    console.error(error); // Log the error message to the console
    res.status(500).send({ status: false, message: 'Error retrieving procesosCreativos' });
  }
});


 ProcesoCreativoRoute.route('/editar-procesoCreativo/:id').get((req, res, next) => {
  ProcesoCreativoSchema.findById(req.params.id).then((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})
// Update
ProcesoCreativoRoute.route('/actualizar-student/:id').put((req, res, next) => {
  ProcesoCreativoSchema.findByIdAndUpdate(req.params.id,{$set: req.body}).then((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
      console.log('Student successfully updated!')
    }
  })
})

// Delete
ProcesoCreativoRoute.route('/borrar-procesoCreativo/:id').delete((req, res, next) => {
  ProcesoCreativoSchema.findByIdAndRemove(req.params.id).then((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})
module.exports = ProcesoCreativoRoute;