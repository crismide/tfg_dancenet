const express = require('express');
const EscenaRoute = express.Router();
const Escena = require('../models/escena.model');

EscenaRoute.route('/crear-escena').post(async (req, res) => {
  try {
    const newEscena = new Escena({
        name: req.body.name
    });

    await newEscena.save();
    res.send({ status: true, message: 'Escena creada con éxito' });
  } catch (error) {
    console.error(error);
    res.send({ status: false, message: 'Error creando escena' });
  }
});

EscenaRoute.route('/escena/:escenaId').get(async (req, res) => {
  try {
    const escenaId = req.params.escenaId;
    const escena = await Escena.findById(escenaId);
    res.send({ status: true, data: escena });
  } catch (error) {
    console.error(error); // Log the error message to the console
    res.status(500).send({ status: false, message: 'Error recogiendo escena' });
  }
});

module.exports = EscenaRoute;