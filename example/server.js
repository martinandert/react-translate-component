'use strict';

var express     = require('express');
var browserify  = require('connect-browserify');
var reactify    = require('reactify');
var React       = require('react');

require('node-jsx').install();

var App = React.createFactory(require('./client'));

express()
  .use('/bundle.js', browserify.serve({
    entry: __dirname + '/client',
    debug: true, watch: true,
    transforms: [reactify]
  }))
  .get('/', function(req, res, next) {
    res.send(React.renderToString(App()));
  })
  .listen(3000, function() {
    console.log('Point your browser to http://localhost:3000');
  });
