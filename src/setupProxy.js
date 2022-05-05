const { createProxyMiddleware } = require('http-proxy-middleware');
const { DOMAIN, API_PATH, PROXY_ROUTE } = require('./config');

module.exports = function (app) {
  const configs = getConfig();
  configs.forEach((config) => {
    app.use(config.route, createProxyMiddleware(config.options));
  });
};

function getConfig() {
  const route = PROXY_ROUTE;
  const options = {
    target: 'http://' + DOMAIN,
  };
  return [{ route, options }];
}
