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

const procesoCreativoAPI = require('./routes/procesoCreativo.route.js')
const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
)
app.use(cors())
// API
app.use(procesoCreativoAPI)
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