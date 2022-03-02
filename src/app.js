require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const cors = require('cors');
const app = express();

app.use(express.json());

// Setting cors
app.use(cors());


//Index Route
app.get('/', function (req, res) {
    res.send('invalid rest point');
})

var authRoutes = require('./routes/auth-route');
// Logic goes here
app.use('/auth', authRoutes);

module.exports = app;