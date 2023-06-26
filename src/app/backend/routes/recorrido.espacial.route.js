const express = require('express');
const RecorridoEspacialRoute = express.Router();
const RecorridoEspacial = require('../models/recorrido.espacial.model');

RecorridoEspacialRoute.route('/crear-recorridoEspacial').post(async (req, res) => {
  try {
    const newRecorridoEspacial = new RecorridoEspacial({
      image: req.body.image
    });

    const recorridoEspacial = await newRecorridoEspacial.save();
    res.send({ status: true, message: 'recorridoEspacial creado con éxito', data: recorridoEspacial });
  } catch (error) {
    console.error(error);
    res.send({ status: false, message: 'Error creando recorridoEspacial' });
  }
});

RecorridoEspacialRoute.route('/recorridoEspacial/:recorridoEspacialId').get(async (req, res) => {
  try {
    const recorridoEspacialId = req.params.recorridoEspacialId;
    const recorridoEspacial = await RecorridoEspacial.findById(recorridoEspacialId);
    res.send({ status: true, data: recorridoEspacial });
  } catch (error) {
    console.error(error); // Log the error message to the console
    res.status(500).send({ status: false, message: 'Error recogiendo recorrido espacial' });
  }
});

module.exports = RecorridoEspacialRoute;