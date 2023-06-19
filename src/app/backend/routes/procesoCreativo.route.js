const express = require('express');
const ProcesoCreativoRoute = express.Router();
// model
let ProcesoCreativoModel = require('../models/ProcesoCreativo');
ProcesoCreativoRoute.route('/crear-procesoCreativo').post((req, res, next) => {
  ProcesoCreativoModel.create(req.body).then((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});
ProcesoCreativoRoute.route('/').get((req, res, next) => {
   ProcesoCreativoModel.find().then((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
 })
 ProcesoCreativoRoute.route('/editar-procesoCreativo/:id').get((req, res, next) => {
  ProcesoCreativoModel.findById(req.params.id).then((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})
// Update
ProcesoCreativoRoute.route('/actualizar-student/:id').put((req, res, next) => {
  ProcesoCreativoModel.findByIdAndUpdate(req.params.id,{$set: req.body}).then((error, data) => {
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
  ProcesoCreativoModel.findByIdAndRemove(req.params.id).then((error, data) => {
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