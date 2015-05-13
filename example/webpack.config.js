"use strict";

var webpack = require('webpack');
var bundleFile = 'bundle.js';

var plugins = [
  // require 'react/addons' when we require 'react'
  new webpack.NormalModuleReplacementPlugin(/^react$/, 'react/addons'),
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(new webpack.optimize.UglifyJsPlugin({ comments: /<strip-all>/ }));
  plugins.push(new webpack.optimize.DedupePlugin());
  plugins.push(new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') } }));
  bundleFile = 'bundle.min.js';
}

module.exports = {
  context:  __dirname,
  cache:    true,
  entry:    './client.js',

  output: {
    filename:   bundleFile,
    path:       __dirname + "/assets",
    publicPath: '/assets'
  },

  plugins: plugins,

  module: {
    loaders: [
      { test: /\.js$/, loader: "jsx" }
    ]
  }
};
