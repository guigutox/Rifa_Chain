const express = require('express');
const apiRoutes = require('./routes.js');

const app = express();
app.use(express.json());


app.use(apiRoutes);

module.exports = app;