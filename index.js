require('dotenv').config();
const path = require('path');
const { DOMAIN, PROXY_ROUTE } = require('./src/config');

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(
  PROXY_ROUTE,
  createProxyMiddleware({ target: 'http://' + DOMAIN, changeOrigin: true }),
);
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(3000);
