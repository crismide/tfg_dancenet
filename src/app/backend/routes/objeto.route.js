const express = require('express');
const ObjetoRoute = express.Router();
var Objeto = require('../models/objeto.model');
var PautaMovimiento = require('../models/pautaMovimiento.model');
const Participante = require('../models/participante.model');

ObjetoRoute.route('/crear-objeto').post(async (req, res) => {
  try {
    const modeloObjeto = new Objeto({
      image: req.body.image
    });
    const objeto = await modeloObjeto.save();
    res.send({ status: true, message: 'Objeto creada con éxito', data: objeto});
  } catch (error) {
    console.error(error); // Log the error message to the console
    res.send({ status: false, message: 'Error creando objeto' });
  }
});

ObjetoRoute.route('/objeto/:objetoId').get(async (req, res) => {
  try {
    const objetoId = req.params.objetoId;
    const objeto = await Objeto.findById(objetoId);
    res.send({ status: true, data: objeto });
  } catch (error) {
    console.error(error); // Log the error message to the console
    res.status(500).send({ status: false, message: 'Error recogiendo objeto' });
  }
});

/***************** PAUTA ***********************/
ObjetoRoute.route('/objeto/asignar-objeto/:objetoId/:pautaMovimientoId').post(async (req, res) => {
    try {
      const objetoId = req.params.objetoId;
      const pautaMovimientoId = req.params.pautaMovimientoId;
  
      const objeto = await Objeto.findById(objetoId);
      const pautaMovimiento = await PautaMovimiento.findById(pautaMovimientoId);
  
      if (!objeto || !pautaMovimiento) {
        return res.send({ status: false, message: 'Objeto o Pauta no encontrado' });
      }
  
      objeto.addPautaMovimiento(pautaMovimiento._id);
      await objeto.save();
  
      res.send({ status: true, message: 'Pauta Movimiento asignada correctamente' });
    } catch (error) {
      console.error(error);
      res.send({ status: false, message: 'Error asignando pauta movimiento' });
    }
  });
/***********************************************/

/***************** RESPONSABLE ***********************/
ObjetoRoute.route('/objeto/asignar-responsable/:objetoId/:responsableId').post(async (req, res) => {
    try {
      const objetoId = req.params.objetoId;
      const responsableId = req.params.responsableId;
  
      const objeto = await Objeto.findById(objetoId);
      const responsable = await Participante.findById(responsableId);
  
      if (!objeto || !responsable) {
        return res.send({ status: false, message: 'Objeto o Responsable no encontrado' });
      }
  
      objeto.addResponsable(responsable._id);
      await objeto.save();
  
      res.send({ status: true, message: 'Responsable asignado correctamente' });
    } catch (error) {
      console.error(error);
      res.send({ status: false, message: 'Error asignando responsable' });
    }
  });
/***********************************************/

/***************** PARTICIPANTE ***********************/
ObjetoRoute.route('/objeto/asignar-participante/:objetoId/:participanteId').post(async (req, res) => {
  try {
    const objetoId = req.params.objetoId;
    const participanteId = req.params.participanteId;

    const objeto = await Objeto.findById(objetoId);
    const participante = await Participante.findById(participanteId);

    if (!objeto || !participante) {
      return res.send({ status: false, message: 'Objeto o Participante no encontrado' });
    }

    objeto.addParticipante(participante._id);
    await objeto.save();

    res.send({ status: true, message: 'Participante asignado correctamente' });
  } catch (error) {
    console.error(error);
    res.send({ status: false, message: 'Error asignando participante' });
  }
});

ObjetoRoute.route('/objeto/encontrar-participantes/:objetoId/participantes').get(async (req, res) => {
  try {
    const objetoId = req.params.objetoId;

    // Find the ProcesoCreativo by ID
    const objeto = await Objeto.findById(objetoId).populate('participantes');

    if (!objeto) {
      return res.send({ status: false, message: 'objeto no encontrado' });
    }

    // Access the populated 'escenas' property to get all the associated Escena documents
    const participantes = objeto.participantes;

    res.send({ status: true, data: participantes });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: 'Error retrieving participantes' });
  }
});
/***********************************************/


module.exports = ObjetoRoute;