/**** Core modules */
const fs = require('fs');
const path = require('path');
/**** Core modules */

/**** 3rd party modules */
const bodyParser = require('body-parser');
const compression = require('compression');
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const morgan = require('morgan');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();
/**** 3rd party modules */

/**** Local modules */
const config = require('./src/config/config');
const { mongoConnect } = require('./src/config/dbconfig/MongoDB');
const sequelize = require('./src/config/dbconfig/SequelizeDB');
const { configRelations: sequelizeRelations } = require('./src/helpers/sequelizeHelper');
const { responseObj } = require('./src/helpers/utilsHelper');
const swaggerDefinition = config.swaggerDefinition;
/**** Local modules */

const app = express();

// Create log file for morgan which stores all the log data
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'src/logs', 'access.log'), { flags: 'a' });

// Logging of each request using morgan
app.use(morgan('combined', { stream: accessLogStream }));

// Set some special response headers using helmet
app.use(helmet());

// Compress the assets to be sent in response
app.use(compression());

// Best practices app settings
app.set('port', process.env.HTTP_PORT || 8000);
app.set('app URL', process.env.APP_URL || 'localhost:8000');
app.set('title', process.env.APP_NAME);
app.set('query parser', `extended`);

// Define the path where views are stored
app.set('views', path.join(__dirname, './src/views'));
// Define templating engine for app
app.set('view engine', 'pug');

/**** Setting up the CORS for app */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || '*');
  res.header('Access-Control-Allow-Headers', 'Origin, Authorization, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD');
  if ('OPTIONS' === req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});
/**** Setting up the CORS for app */

// Form encryption application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// POST routes/APIs data in application/json format
app.use(bodyParser.json());

// serve static files
app.use(express.static(path.join(__dirname, 'src/public')));

app.enable('etag'); // use strong etags
app.set('etag', 'strong');

// Swagger configuration.
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsDoc({
  swaggerDefinition,
  'apis': [
    './src/routes/*.js',
    './src/routes/api/*.js'
  ],
}), config.swaggerOptions));

// Handles routes in the app
app.use(require('./src/routes/routes'));

/**** eslint-disable no-unused-vars */
// error handler
app.use((err, req, res, next) => res.status(err.status || 500).json(responseObj(err.message || 'Internal Server Error')));
/**** eslint-enable no-unused-vars */

// Establishes all relations for Sequelize
sequelizeRelations();
// Sequelize auto-create missing tables using sync()
sequelize.sync()
  .then(() => {
    app.listen(app.get('port'), () => {
      console.info(`Find the server at: ${app.get('app URL')}`);
    });
  })
  .catch(err => console.error(err));

// Connect to MongoDB
mongoConnect(() => {
  console.info(`Connection has been established successfully with '${process.env.DB_NAME}' mongo database.`);
});

// Connect to Mongoose ODM
mongoose.connect(process.env.DB_URL+process.env.DB_NAME, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => {
    console.info(`Connection has been established successfully using mongoose ODM with '${process.env.DB_NAME}' database.`);
    fs.readdirSync(__dirname + '/src/models/Mongoose').forEach(file => require(__dirname + '/src/models/Mongoose/' + file));
  })
  .catch(err => console.error(err));

module.exports = app
