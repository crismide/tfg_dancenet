const express = require('express');
const EscenaRoute = express.Router();
const Escena = require('../models/escena.model');
const Idea = require('../models/idea.model');
const PautaMovimiento = require('../models/pautaMovimiento.model');
const RecorridoEspacial = require('../models/recorrido.espacial.model');
const Participante = require('../models/participante.model');
const Ensayo = require('../models/ensayo.model');
const Objeto = require('../models/objeto.model');

EscenaRoute.route('/crear-escena').post(async (req, res) => {
  try {
    const newEscena = new Escena({
        name: req.body.name
    });

    const escena = await newEscena.save();
    res.send({ status: true, message: 'Escena creada con éxito' ,data: escena});
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

/***************** IDEAS ***********************/
EscenaRoute.route('/escena/asignar-idea/:escenaId/:ideaId').post(async (req, res) => {
  try {
    const escenaId = req.params.escenaId;
    const ideaId = req.params.ideaId;

    const escena = await Escena.findById(escenaId);
    const idea = await Idea.findById(ideaId);

    if (!escena || !idea) {
      return res.send({ status: false, message: 'Escena o Idea no encontrado' });
    }

    escena.addIdea(idea._id);
    await escena.save();

    res.send({ status: true, message: 'Idea asignada correctamente' });
  } catch (error) {
    console.error(error);
    res.send({ status: false, message: 'Error asignando idea' });
  }
});

EscenaRoute.route('/escena/encontrar-ideas/:escenaId/ideas').get(async (req, res) => {
  try {
    const escenaId = req.params.escenaId;

    const escena = await Escena.findById(escenaId).populate('ideas');

    if (!escena) {
      return res.send({ status: false, message: 'Escena no encontrado' });
    }

    // Access the populated 'escenas' property to get all the associated Escena documents
    const ideas = escena.ideas;

    res.send({ status: true, data: ideas });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: 'Error retrieving ideas' });
  }
});
/***********************************************/

/***************** PAUTA MOVIMIENTO ***********************/
EscenaRoute.route('/escena/asignar-pautaMovimiento/:escenaId/:pautaMovimientoId').post(async (req, res) => {
  try {
    const escenaId = req.params.escenaId;
    const pautaMovimientoId = req.params.pautaMovimientoId;

    const escena = await Escena.findById(escenaId);
    const pautaMovimiento = await PautaMovimiento.findById(pautaMovimientoId);

    if (!escena || !pautaMovimiento) {
      return res.send({ status: false, message: 'Escena o Idea no encontrado' });
    }

    escena.addPautaMovimiento(pautaMovimiento._id);
    await escena.save();

    res.send({ status: true, message: 'pautaMovimiento asignada correctamente' });
  } catch (error) {
    console.error(error);
    res.send({ status: false, message: 'Error asignando pautaMovimiento' });
  }
});

EscenaRoute.route('/escena/encontrar-pautasMovimiento/:escenaId/pautasMovimiento').get(async (req, res) => {
  try {
    const escenaId = req.params.escenaId;

    const escena = await Escena.findById(escenaId).populate('pautasMovimiento');

    if (!escena) {
      return res.send({ status: false, message: 'Escena no encontrado' });
    }

    // Access the populated 'escenas' property to get all the associated Escena documents
    const pautasMovimiento = escena.pautasMovimiento;

    res.send({ status: true, data: pautasMovimiento });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: 'Error retrieving ideas' });
  }
});
/***********************************************/

/***************** RECORRIDOS ESPACIALES ***********************/
EscenaRoute.route('/escena/asignar-recorridoEspacial/:escenaId/:recorridoEspacialId').post(async (req, res) => {
  try {
    const escenaId = req.params.escenaId;
    const recorridoEspacialId = req.params.recorridoEspacialId;

    const escena = await Escena.findById(escenaId);
    const recorridoEspacial = await RecorridoEspacial.findById(recorridoEspacialId);

    if (!escena || !recorridoEspacial) {
      return res.send({ status: false, message: 'Escena o recorridoEspacial no encontrado' });
    }

    escena.addRecorridoEspacial(recorridoEspacial._id);
    await escena.save();

    res.send({ status: true, message: 'recorridoEspacial asignada correctamente' });
  } catch (error) {
    console.error(error);
    res.send({ status: false, message: 'Error asignando recorridoEspacial' });
  }
});

EscenaRoute.route('/escena/encontrar-recorridosEspaciales/:escenaId/recorridosEspaciales').get(async (req, res) => {
  try {
    const escenaId = req.params.escenaId;

    const escena = await Escena.findById(escenaId).populate('recorridosEspaciales');

    if (!escena) {
      return res.send({ status: false, message: 'Escena no encontrado' });
    }

    // Access the populated 'escenas' property to get all the associated Escena documents
    const recorridosEspaciales = escena.recorridosEspaciales;

    res.send({ status: true, data: recorridosEspaciales });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: 'Error retrieving ideas' });
  }
});
/***********************************************/

/***************** PARTICIPANTE ***********************/
EscenaRoute.route('/escena/asignar-participante/:escenaId/:participanteId').post(async (req, res) => {
  try {
    const escenaId = req.params.escenaId;
    const participanteId = req.params.participanteId;

    const escena = await Escena.findById(escenaId);
    const participante = await Participante.findById(participanteId);

    if (!escena || !participante) {
      return res.send({ status: false, message: 'Escena o Participante no encontrado' });
    }

    escena.addParticipante(participante._id);
    await escena.save();

    res.send({ status: true, message: 'Participante asignado correctamente' });
  } catch (error) {
    console.error(error);
    res.send({ status: false, message: 'Error asignando participante' });
  }
});

EscenaRoute.route('/escena/encontrar-participantes/:escenaId/participantes').get(async (req, res) => {
  try {
    const escenaId = req.params.escenaId;

    // Find the ProcesoCreativo by ID
    const escena = await Escena.findById(escenaId).populate('participantes');

    if (!escena) {
      return res.send({ status: false, message: 'Escena no encontrado' });
    }

    // Access the populated 'escenas' property to get all the associated Escena documents
    const participantes = escena.participantes;

    res.send({ status: true, data: participantes });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: 'Error retrieving participantes' });
  }
});
/***********************************************/

/***************** ENSAYO ***********************/
EscenaRoute.route('/escena/asignar-ensayo/:escenaId/:ensayoId').post(async (req, res) => {
  try {
    const escenaId = req.params.escenaId;
    const ensayoId = req.params.ensayoId;

    const escena = await Escena.findById(escenaId);
    const ensayo = await Ensayo.findById(ensayoId);

    if (!escena || !ensayo) {
      return res.send({ status: false, message: 'Escena o ensayo no encontrado' });
    }

    escena.addEnsayo(ensayo._id);
    await escena.save();

    res.send({ status: true, message: 'ensayo asignado correctamente' });
  } catch (error) {
    console.error(error);
    res.send({ status: false, message: 'Error asignando ensayo' });
  }
});

EscenaRoute.route('/escena/encontrar-ensayos/:escenaId/ensayos').get(async (req, res) => {
  try {
    const escenaId = req.params.escenaId;

    // Find the ProcesoCreativo by ID
    const escena = await Escena.findById(escenaId).populate('ensayos');

    if (!escena) {
      return res.send({ status: false, message: 'Escena no encontrado' });
    }

    // Access the populated 'escenas' property to get all the associated Escena documents
    const ensayos = escena.ensayos;

    res.send({ status: true, data: ensayos });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: 'Error retrieving ensayos' });
  }
});
/***********************************************/

/***************** OBJETO ***********************/
EscenaRoute.route('/escena/asignar-objeto/:escenaId/:objetoId').post(async (req, res) => {
  try {
    const escenaId = req.params.escenaId;
    const objetoId = req.params.objetoId;

    const escena = await Escena.findById(escenaId);
    const objeto = await Objeto.findById(objetoId);

    if (!escena || !objeto) {
      return res.send({ status: false, message: 'Escena o objeto no encontrado' });
    }

    escena.addObjeto(objeto._id);
    await escena.save();

    res.send({ status: true, message: 'objeto asignado correctamente' });
  } catch (error) {
    console.error(error);
    res.send({ status: false, message: 'Error asignando objeto' });
  }
});

EscenaRoute.route('/escena/encontrar-objetos/:escenaId/objetos').get(async (req, res) => {
  try {
    const escenaId = req.params.escenaId;

    // Find the ProcesoCreativo by ID
    const escena = await Escena.findById(escenaId).populate('objetos');

    if (!escena) {
      return res.send({ status: false, message: 'Escena no encontrado' });
    }

    // Access the populated 'escenas' property to get all the associated Escena documents
    const objetos = escena.objetos;

    res.send({ status: true, data: objetos });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: 'Error retrieving objetos' });
  }
});
/***********************************************/

module.exports = EscenaRoute;