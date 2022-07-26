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
const dotenv = require('dotenv');
dotenv.config();

const PORTAL_PREFIX = process.env.REACT_APP_PORTAL_PATH;

let baseUrl;
let mailHogHost;
let mailHogPort;
let mailHogAdminEmail;
let dataConfig = {
  copyReq: {
    projectCode: 'automatic001',
    contributorProjectCode: 'automatic002',
  },
  adminCanvas: {
    projectCode: 'automatic001',
  },
  contributorCanvas: {
    projectCode: 'automatic002',
  },
  fileCopy: {
    adminProjectCode: 'automatic001',
    collaboratorProjectCode: 'automatic006',
  },
  fileUpload: {
    projectCode: 'automatic003',
  },
  userProfile: {
    projectCode: 'automatic004',
  },
};
switch (process.env.REACT_APP_TEST_ENV) {
  case 'local':
    baseUrl = `http://localhost:3000${PORTAL_PREFIX}/`;
    mailHogHost = 'https://mail.dev.pilot.indocresearch.org/';
    mailHogAdminEmail = 'jzhang@indocresearch.org';
    break;
  case 'dev':
    baseUrl = `https://dev.pilot.indocresearch.org${PORTAL_PREFIX}/`;
    mailHogHost = 'https://mail.dev.pilot.indocresearch.org/';
    mailHogAdminEmail = 'jzhang@indocresearch.org';
    break;
  case 'staging':
    baseUrl = `https://vre-staging.indocresearch.org${PORTAL_PREFIX}/`;
    mailHogHost = 'https://mail.dev.pilot.indocresearch.org/';
    mailHogAdminEmail = 'jzhang@indocresearch.org';
    break;
}
module.exports = {
  baseUrl,
  mailHogHost,
  mailHogPort,
  mailHogAdminEmail,
  dataConfig,
};
