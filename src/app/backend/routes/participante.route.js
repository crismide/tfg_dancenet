const express = require('express');
const ParticipanteRoute = express.Router();
const Participante = require('../models/participante.model');
const Escena = require('../models/escena.model');
const User = require('../models/user.model');

ParticipanteRoute.route('/crear-participante').post(async (req, res) => {
  try {
    const newParticipante = new Participante({
      userId: req.body.userId,
      name: req.body.name
    });

    let participante = await newParticipante.save();
    res.send({ status: true, message: 'Participante creado con éxito', data: participante });
  } catch (error) {
    console.error(error);
    res.send({ status: false, message: 'Error creando participante' });
  }
});

ParticipanteRoute.route('/participante/:participanteId').get(async (req, res) => {
  try {
    const participanteId = req.params.participanteId;
    const participante = await Participante.findById(participanteId);
    res.send({ status: true, data: participante });
  } catch (error) {
    console.error(error); // Log the error message to the console
    res.status(500).send({ status: false, message: 'Error recogiendo participante' });
  }
});

ParticipanteRoute.route('/participante/:participanteId/name').get(async (req, res) => {
  try {
    const participanteId = req.params.participanteId;

    // Find the Participante by ID and populate the 'userId' field to get the associated User document
    const participante = await Participante.findById(participanteId).populate('userId');

    if (!participante) {
      return res.send({ status: false, message: 'Participante not found' });
    }

    // Access the 'name' parameter of the associated User document
    const userId = participante.userId;
    const usuario = await User.findById(userId)
    const name = usuario.name

    res.send({ status: true, data: { name } });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: 'Error retrieving participante' });
  }
});

/***************** ESCENAS ********************/
ParticipanteRoute.route('/participante/asignar-escena/:participanteId/:escenaId').post(async (req, res) => {
  try {
    const participanteId = req.params.participanteId;
    const escenaId = req.params.escenaId;

    const participante = await Participante.findById(participanteId);
    const escena = await Escena.findById(escenaId);

    if (!participante || !escena) {
      return res.send({ status: false, message: 'Participante o Escena no encontrado' });
    }

    participante.addEscena(escena._id);
    await participante.save();

    res.send({ status: true, message: 'Escena asignada correctamente' });
  } catch (error) {
    console.error(error);
    res.send({ status: false, message: 'Error asignando escena' });
  }
});

ParticipanteRoute.route('/participante/encontrar-escenas/:participanteId/escenas').get(async (req, res) => {
  try {
    const participanteId = req.params.participanteId;

    // Find the Ensayo by ID
    const participante = await Participante.findById(participanteId).populate('escenas');

    if (!participante) {
      return res.send({ status: false, message: 'Participante no encontrado' });
    }

    // Access the populated 'escenas' property to get all the associated Escena documents
    const escenas = participante.escenas;

    res.send({ status: true, data: escenas });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: 'Error retrieving escenas' });
  }
});
/***********************************************/

module.exports = ParticipanteRoute;