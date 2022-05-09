const handler = require('serve-handler');
const http = require('http');
const httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({});
require('dotenv').config();
const { DOMAIN, PROXY_ROUTE } = require('./src/config');
const server = http.createServer((request, response) => {
  if (request.url.indexOf(PROXY_ROUTE) !== -1) {
    proxy.web(request, response, { target: 'http://' + DOMAIN }, function (e) {
      console.log('proxy error.', e);
    });
  } else {
    return handler(request, response, {
      public: './build',
      rewrites: [{ source: '**', destination: '/index.html' }],
    });
  }
});

server.listen(3000, () => {
  console.log('Running at port: 3000');
});
