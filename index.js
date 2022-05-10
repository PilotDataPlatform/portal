const handler = require('serve-handler');
require('dotenv').config();
const { DOMAIN, PROXY_ROUTE } = require('./src/config');

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(
  PROXY_ROUTE,
  createProxyMiddleware({ target: 'http://' + DOMAIN, changeOrigin: true }),
);
app.get('*', (req, res) => {
  return handler(req, res, {
    public: './build',
    rewrites: [{ source: '**', destination: '/index.html' }],
  });
});
app.listen(3000);
