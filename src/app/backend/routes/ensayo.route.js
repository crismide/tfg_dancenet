const express = require('express');
const EnsayoRoute = express.Router();
const Ensayo = require('../models/ensayo.model');
const Escena = require('../models/escena.model');

EnsayoRoute.route('/crear-ensayo').post(async (req, res) => {
  try {
    const newEnsayo = new Ensayo({
      fecha: req.body.fecha,
      escenas: req.body.escenas
    });

    const ensayo = await newEnsayo.save();
    res.send({ status: true, message: 'Ensayo creado con éxito', data: ensayo });
  } catch (error) {
    console.error(error);
    res.send({ status: false, message: 'Error creando ensayo' });
  }
});

EnsayoRoute.route('/ensayo/:ensayoId').get(async (req, res) => {
  try {
    const ensayoId = req.params.ensayoId;
    const ensayo = await Ensayo.findById(ensayoId);
    res.send({ status: true, data: ensayo });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: 'Error recogiendo ensayo' });
  }
});

/***************** ESCENAS ********************/
EnsayoRoute.route('/ensayo/asignar-escena/:ensayoId/:escenaId').post(async (req, res) => {
  try {
    const ensayoId = req.params.ensayoId;
    const escenaId = req.params.escenaId;

    const ensayo = await Ensayo.findById(ensayoId);
    const escena = await Escena.findById(escenaId);

    if (!ensayo || !escena) {
      return res.send({ status: false, message: 'Ensayo o Escena no encontrado' });
    }

    ensayo.addEscena(escena._id);
    await ensayo.save();

    res.send({ status: true, message: 'Escena asignada correctamente' });
  } catch (error) {
    console.error(error);
    res.send({ status: false, message: 'Error asignando escena' });
  }
});

EnsayoRoute.route('/ensayo/encontrar-escenas/:ensayoId/escenas').get(async (req, res) => {
  try {
    const ensayoId = req.params.ensayoId;

    // Find the Ensayo by ID
    const ensayo = await Ensayo.findById(ensayoId).populate('escenas');

    if (!ensayo) {
      return res.send({ status: false, message: 'Ensayo no encontrado' });
    }

    // Access the populated 'escenas' property to get all the associated Escena documents
    const escenas = ensayo.escenas;

    res.send({ status: true, data: escenas });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: 'Error retrieving escenas' });
  }
});
/***********************************************/

module.exports = EnsayoRoute;