'use strict';

var express = require('express');
var React   = require('react');

require('node-jsx').install();

var App  = React.createFactory(require('./client'));
var port = Number(process.env.PORT || 3000);

express()
  .use('/assets', express.static(__dirname + '/assets'))
  .get('/', function(req, res, next) {
    res.send(React.renderToString(App()));
  })
  .listen(port, function() {
    console.log('Point your browser to http://localhost:' + port);
  });
