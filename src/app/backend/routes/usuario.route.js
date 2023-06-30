const express = require('express');
const UserRoute = express.Router();
const User = require('../models/user.model');
const ProcesoCreativo = require('../models/procesoCreativo.model');
const Idea = require('../models/idea.model').Idea;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

UserRoute.route('/login').post(async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user with the provided email exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.send({ status: false, message: 'Invalid email' });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = password == user.password; //pendiente de hashing

    if (!passwordMatch) {
      return res.send({ status: false, message: 'Invalid password' });
    }

    userId = user._id
    // Create and sign a JSON Web Token (JWT)
    //const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });

    res.send({ status: true, message: 'Login successful', userId });
  } catch (error) {
    console.error(error);
    res.send({ status: false, message: 'Error logging in' });
  }
});

UserRoute.route('/crear-usuario').post(async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email
    });

    await newUser.save();
    res.send({ status: true, message: 'Usuario creado con éxito' });
  } catch (error) {
    console.error(error);
    res.send({ status: false, message: 'Error creando usuario' });
  }
});

UserRoute.route('/user/:userId').get(async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId);
      res.send({ status: true, data: user });
    } catch (error) {
      console.error(error); // Log the error message to the console
      res.status(500).send({ status: false, message: 'Error recogiendo usuario' });
    }
  });

UserRoute.route('/user/asignar-procesoCreativo/:userId/:procesoCreativoId').post(async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId);

      const procesoCreativoId = req.params.procesoCreativoId;
      const procesoCreativo = await ProcesoCreativo.findById(procesoCreativoId);
  
      if (!user || !procesoCreativo) {
        return res.send({ status: false, message: 'Usuario o ProcesoCreativo no encontrado' });
      }
      
      user.addProcesoCreativo(procesoCreativo._id);
      await user.save();
  
      res.send({ status: true, message: 'Proceso asignado correctamente' });
    } catch (error) {
      console.error(error);
      res.send({ status: false, message: 'Error asignando proceso' });
    }
  });
  
  UserRoute.route('/asignar-idea/:userId/:ideaId').post(async (req, res) => {
    try {
      const userId = req.params.userId;
      const ideaId = req.params.ideaId;
  
      const user = await User.findById(userId);
      const idea = await Idea.findById(ideaId);
  
      if (!user || !idea) {
        return res.send({ status: false, message: 'Usuario o idea no encontrado' });
      }
  
      user.addIdea(idea._id);
      await user.save();
  
      res.send({ status: true, message: 'Idea asignada correctamente' });
    } catch (error) {
      console.error(error);
      res.send({ status: false, message: 'Error asignando idea' });
    }
  });


module.exports = UserRoute;