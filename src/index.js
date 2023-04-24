const express = require('express')
const morgan = require('morgan')
const app = express()
const mongoose = require('mongoose')

const uri = 'mongodb://localhost:27017/test'
const options = {useNewUrlParser: true}

mongoose.connect(uri, options)
  .then(db => console.log('DB is connected'))
  .catch(err => console.error(err))

// settings
app.set('port', process.env.PORT || 3000)
  
//middlewares
app.use(morgan('dev'))
app.use(express.json())

//routes
app.use('/procesos_creativos', require('./routes/proceso_creativo'))

//static files
app.use(express.static(__dirname+'/public'))

// listenning on port
app.listen(app.get('port'), () => {
    console.log(`server on port ${app.get('port')}`)
  });