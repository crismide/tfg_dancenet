import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';

const app = express();
const mongoose = require('mongoose');

const uri = 'mongodb+srv://Cluster88206:WXpUe1JKUW5v@cluster88206.2zfoqd5.mongodb.net/test';
const options = {useNewUrlParser: true};

// Middleware
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Middleware para Vue.js router modo history
const history = require('connect-history-api-fallback');
app.use(history());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', require('./routes/nota'));

app.set('puerto', process.env.PORT || 3000);
app.listen(app.get('puerto'), () => {
  console.log('Example app listening on port '+ app.get('puerto'));
});

//Mongoose
// Or using promises
mongoose.connect(uri, options).then(
//mongoose.connect(uri).then(
    () => { console.log('Conectado a DB') },
    err => { console.log(err) }
);