const express = require('express');
const IdeaRoute = express.Router();
const Idea = require('../models/idea.model');

IdeaRoute.route('/crear-idea').post(async (req, res) => {
  try {
    const newIdea = new Idea({
      type: req.body.type,
      content: req.body.content
    });

    await newIdea.save();
    res.send({ status: true, message: 'Idea creado con éxito' });
  } catch (error) {
    console.error(error);
    res.send({ status: false, message: 'Error creando idea' });
  }
});

IdeaRoute.route('/idea/:ideaId').get(async (req, res) => {
  try {
    const ideaId = req.params.ideaId;
    const idea = await Idea.findById(ideaId);
    res.send({ status: true, data: idea });
  } catch (error) {
    console.error(error); // Log the error message to the console
    res.status(500).send({ status: false, message: 'Error recogiendo idea' });
  }
});

module.exports = IdeaRoute;