'use strict';
var express = require('express');
var app = express();
var morgan = require('morgan');
var swig = require('swig');
var wikiRouter = require('./routes/wiki');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var bodyParser = require('body-parser');
var socketio = require('socket.io');
var models = require('./models');

// start the server

models.User.sync({})
.then(function () {
    return models.Page.sync({})
})
.then(function () {
    app.listen(3001, function () {
        console.log('Server is listening on port 3001!');
    });
})
.catch(console.error);

// templating boilerplate setup
app.use(express.static(path.join(__dirname, '/styles')));

app.set('views', path.join(__dirname, '/views')); // where to find the views
app.set('view engine', 'html'); // what file extension do our templates have
app.engine('html', swig.renderFile); // how to render html templates
swig.setDefaults({ cache: false });

// logging middleware
app.use(morgan('dev'));

// body parsing middleware
app.use(bodyParser.urlencoded({ extended: true })); // for HTML form submits
app.use(bodyParser.json()); // would be for AJAX requests

// modular routing that uses io inside it
app.use('/wiki', wikiRouter);