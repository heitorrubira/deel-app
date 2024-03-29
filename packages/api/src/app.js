const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { sequelize } = require('./model');
const router = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));
app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

app.use(router);

module.exports = app;
