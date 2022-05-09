const handler = require('serve-handler');
const http = require('http');
const httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({});
require('dotenv').config();
const { DOMAIN, PROXY_ROUTE } = require('./src/config');
const server = http.createServer((request, response) => {
  // You pass two more arguments for config and middleware
  // More details here: https://github.com/zeit/serve-handler#options
  if (request.url.indexOf(PROXY_ROUTE) !== -1) {
    return proxy.web(request, response, { target: 'http://' + DOMAIN });
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
