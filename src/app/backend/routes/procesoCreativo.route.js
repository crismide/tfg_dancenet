const express = require('express');
const ProcesoCreativoRoute = express.Router();
var ProcesoCreativo = require('../models/procesoCreativo.model');
const Escena = require('../models/escena.model');
const Idea = require('../models/idea.model');
const Participante = require('../models/participante.model');

ProcesoCreativoRoute.route('/crear-procesoCreativo').post(async (req, res) => {
  try {
    const modeloProcesoCreativo = new ProcesoCreativo({
      title: req.body.title,
      completed: req.body.completed
    });
    const procesoCreativo = await modeloProcesoCreativo.save();
    res.send({ status: true, message: 'Proceso creado con éxito', data: procesoCreativo});
  } catch (error) {
    console.error(error); // Log the error message to the console
    res.send({ status: false, message: 'Error creando proceso' });
  }
});

ProcesoCreativoRoute.route('/procesosCreativos').get(async (req, res) => {
  try {
    const procesosCreativos = await ProcesoCreativo.find();
    res.send({ status: true, data: procesosCreativos });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: 'Error retrieving procesosCreativos' });
  }
});

ProcesoCreativoRoute.route('/procesoCreativo/:procesoCreativoId').get(async (req, res) => {
  try {
    const procesoCreativoId = req.params.procesoCreativoId;
    const procesoCreativo = await ProcesoCreativo.findById(procesoCreativoId);
    res.send({ status: true, data: procesoCreativo });
  } catch (error) {
    console.error(error); // Log the error message to the console
    res.status(500).send({ status: false, message: 'Error recogiendo proceso creativo' });
  }
});

/***************** ESCENAS ********************/
ProcesoCreativoRoute.route('/procesoCreativo/asignar-escena/:procesoCreativoId/:escenaId').post(async (req, res) => {
  try {
    const procesoCreativoId = req.params.procesoCreativoId;
    const escenaId = req.params.escenaId;

    const procesoCreativo = await ProcesoCreativo.findById(procesoCreativoId);
    const escena = await Escena.findById(escenaId);

    if (!procesoCreativo || !escena) {
      return res.send({ status: false, message: 'ProcesoCreativo o Escena no encontrado' });
    }

    procesoCreativo.addEscena(escena._id);
    await procesoCreativo.save();

    res.send({ status: true, message: 'Escena asignada correctamente' });
  } catch (error) {
    console.error(error);
    res.send({ status: false, message: 'Error asignando escena' });
  }
});

ProcesoCreativoRoute.route('/procesoCreativo/encontrar-escenas/:procesoCreativoId/escenas').get(async (req, res) => {
  try {
    const procesoCreativoId = req.params.procesoCreativoId;

    // Find the ProcesoCreativo by ID
    const procesoCreativo = await ProcesoCreativo.findById(procesoCreativoId).populate('escenas');

    if (!procesoCreativo) {
      return res.send({ status: false, message: 'ProcesoCreativo no encontrado' });
    }

    // Access the populated 'escenas' property to get all the associated Escena documents
    const escenas = procesoCreativo.escenas;

    res.send({ status: true, data: escenas });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: 'Error retrieving escenas' });
  }
});
/***********************************************/

/***************** IDEAS ***********************/
ProcesoCreativoRoute.route('/procesoCreativo/asignar-idea/:procesoCreativoId/:ideaId').post(async (req, res) => {
  try {
    const procesoCreativoId = req.params.procesoCreativoId;
    const ideaId = req.params.ideaId;

    const procesoCreativo = await ProcesoCreativo.findById(procesoCreativoId);
    const idea = await Idea.findById(ideaId);

    if (!procesoCreativo || !idea) {
      return res.send({ status: false, message: 'ProcesoCreativo o Idea no encontrado' });
    }

    procesoCreativo.addIdea(idea._id);
    await procesoCreativo.save();

    res.send({ status: true, message: 'Idea asignada correctamente' });
  } catch (error) {
    console.error(error);
    res.send({ status: false, message: 'Error asignando idea' });
  }
});

ProcesoCreativoRoute.route('/procesoCreativo/encontrar-ideas/:procesoCreativoId/ideas').get(async (req, res) => {
  try {
    const procesoCreativoId = req.params.procesoCreativoId;

    // Find the ProcesoCreativo by ID
    const procesoCreativo = await ProcesoCreativo.findById(procesoCreativoId).populate('ideas');

    if (!procesoCreativo) {
      return res.send({ status: false, message: 'ProcesoCreativo no encontrado' });
    }

    // Access the populated 'escenas' property to get all the associated Escena documents
    const ideas = procesoCreativo.ideas;

    res.send({ status: true, data: ideas });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: 'Error retrieving ideas' });
  }
});
/***********************************************/

/***************** PARTICIPANTE ***********************/
ProcesoCreativoRoute.route('/procesoCreativo/asignar-participante/:procesoCreativoId/:participanteId').post(async (req, res) => {
  try {
    const procesoCreativoId = req.params.procesoCreativoId;
    const participanteId = req.params.participanteId;

    const procesoCreativo = await ProcesoCreativo.findById(procesoCreativoId);
    const participante = await Participante.findById(participanteId);

    if (!procesoCreativo || !participante) {
      return res.send({ status: false, message: 'ProcesoCreativo o Participante no encontrado' });
    }

    procesoCreativo.addParticipante(participante._id);
    await procesoCreativo.save();

    res.send({ status: true, message: 'Participante asignado correctamente' });
  } catch (error) {
    console.error(error);
    res.send({ status: false, message: 'Error asignando participante' });
  }
});

ProcesoCreativoRoute.route('/procesoCreativo/encontrar-participantes/:procesoCreativoId/participantes').get(async (req, res) => {
  try {
    const procesoCreativoId = req.params.procesoCreativoId;

    // Find the ProcesoCreativo by ID
    const procesoCreativo = await ProcesoCreativo.findById(procesoCreativoId).populate('participantes');

    if (!procesoCreativo) {
      return res.send({ status: false, message: 'ProcesoCreativo no encontrado' });
    }

    // Access the populated 'escenas' property to get all the associated Escena documents
    const participantes = procesoCreativo.participantes;

    res.send({ status: true, data: participantes });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: 'Error retrieving participantes' });
  }
});
/***********************************************/


module.exports = ProcesoCreativoRoute;