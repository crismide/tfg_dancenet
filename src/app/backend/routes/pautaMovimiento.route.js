const express = require('express');
const PautaMovimientoRoute = express.Router();
var PautaMovimiento = require('../models/pautaMovimiento.model');
const Participante = require('../models/participante.model');

PautaMovimientoRoute.route('/crear-pautaMovimiento').post(async (req, res) => {
  try {
    const modeloPautaMovimiento = new PautaMovimiento({
      name: req.body.name,
      description: req.body.description,
      inicialTime: req.body.inicialTime,
      finalTime: req.body.finalTime,
      level: req.body.level
    });
    const pautaMovimiento = await modeloPautaMovimiento.save();
    res.send({ status: true, message: 'Pauta creada con éxito', data: pautaMovimiento});
  } catch (error) {
    console.error(error); // Log the error message to the console
    res.send({ status: false, message: 'Error creando pauta' });
  }
});

PautaMovimientoRoute.route('/pautaMovimiento/:pautaMovimientoId').get(async (req, res) => {
  try {
    const pautaMovimientoId = req.params.pautaMovimientoId;
    const pautaMovimiento = await PautaMovimiento.findById(pautaMovimientoId);
    res.send({ status: true, data: pautaMovimiento });
  } catch (error) {
    console.error(error); // Log the error message to the console
    res.status(500).send({ status: false, message: 'Error recogiendo pauta movimiento' });
  }
});

/***************** PARTICIPANTE ***********************/
PautaMovimientoRoute.route('/pautaMovimiento/asignar-pautaMovimiento/:pautaMovimientoId/:participanteId').post(async (req, res) => {
  try {
    const pautaMovimientoId = req.params.pautaMovimientoId;
    const participanteId = req.params.participanteId;

    const pautaMovimiento = await PautaMovimiento.findById(pautaMovimientoId);
    const participante = await Participante.findById(participanteId);

    if (!pautaMovimiento || !participante) {
      return res.send({ status: false, message: 'PautaMovimiento o Participante no encontrado' });
    }

    pautaMovimiento.addParticipante(participante._id);
    await pautaMovimiento.save();

    res.send({ status: true, message: 'Participante asignado correctamente' });
  } catch (error) {
    console.error(error);
    res.send({ status: false, message: 'Error asignando participante' });
  }
});

PautaMovimientoRoute.route('/pautaMovimiento/encontrar-participantes/:pautaMovimientoId/participantes').get(async (req, res) => {
  try {
    const pautaMovimientoId = req.params.pautaMovimientoId;

    // Find the ProcesoCreativo by ID
    const pautaMovimiento = await PautaMovimiento.findById(pautaMovimientoId).populate('participantes');

    if (!pautaMovimiento) {
      return res.send({ status: false, message: 'pautaMovimiento no encontrado' });
    }

    // Access the populated 'escenas' property to get all the associated Escena documents
    const participantes = pautaMovimiento.participantes;

    res.send({ status: true, data: participantes });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: 'Error retrieving participantes' });
  }
});
/***********************************************/


module.exports = PautaMovimientoRoute;