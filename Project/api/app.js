const express = require('express');
const apiRoutes = require('./routes.js');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.json());


app.use(apiRoutes);

module.exports = app;