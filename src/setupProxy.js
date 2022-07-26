/*
 * Copyright (C) 2022 Indoc Research
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
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
