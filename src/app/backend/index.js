const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const createError = require('http-errors')


// Connect mongoDB
mongoose.connect("mongodb://localhost:27017/tfg_database",{
    useNewUrlParser: true,
    useUnifiedTopology: true
})


var db = mongoose.connection;
db.on('open', () => {
    console.log('Connected to mongoDB');
});
db.on('error', (error) => {
    console.log(error)
})

const procesoCreativoAPI = require('./routes/procesoCreativo.route.js');
const userAPI = require('./routes/usuario.route.js');
const ideaAPI = require('./routes/idea.route.js');
const escenaAPI = require('./routes/escena.route.js');
const ensayoAPI = require('./routes/ensayo.route.js');
const pautaMovimientoAPI = require('./routes/pautaMovimiento.route.js');
const participanteAPI = require('./routes/participante.route.js');
const objetoAPI = require('./routes/objeto.route.js');
const RecorridoEspacialAPI = require('./routes/recorrido.espacial.route.js');

const app = express()
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(express.json())

// API

const corsOptions = {
  origin: 'http://192.168.1.55:8080',
};

app.use(cors(corsOptions));

app.use(userAPI);
app.use(ideaAPI);
app.use(procesoCreativoAPI);
app.use(escenaAPI);
app.use(ensayoAPI);
app.use(pautaMovimientoAPI);
app.use(participanteAPI);
app.use(objetoAPI);
app.use(RecorridoEspacialAPI);

// Create port
const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log('Connected to port ' + port)
})
// Find 404
app.use((req, res, next) => {
  next(createError(404))
})
// error handler
app.use(function (err, req, res, next) {
  console.error(err.message)
  if (!err.statusCode) err.statusCode = 500
  res.status(err.statusCode).send(err.message)
})