const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const config = require('./webpack.config');

const app = new (require('express'))();
const express = require('express');
const port = 3000;

const compiler = webpack(config({}, {mode: 'development'}));

app.use(express.static('./dist'));
app.use(webpackDevMiddleware(compiler));

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port);
  }
});