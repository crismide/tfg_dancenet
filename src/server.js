const express = require('express')
const morgan = require('morgan')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require("body-parser");
const cors = require("cors");

const uri = 'mongodb://localhost:27017/test'
const options = {useNewUrlParser: true}

const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// settings
app.set('port', process.env.PORT || 3000)
var corsOptions = {
  origin: "http://localhost:8081"
};
  
//middlewares
app.use(morgan('dev'))
//app.use(express.json())
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//static files
app.use(express.static(__dirname+'/public'))

// listenning on port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

//ruta
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});
