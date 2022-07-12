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
    mailHogHost = '10.3.7.106';
    mailHogPort = 8025;
    mailHogAdminEmail = 'jzhang@indocresearch.org';
    break;
  case 'dev':
    baseUrl = `https://dev.pilot.indocresearch.org${PORTAL_PREFIX}/`;
    mailHogHost = '10.3.7.106';
    mailHogPort = 8025;
    mailHogAdminEmail = 'jzhang@indocresearch.org';
    break;
  case 'staging':
    baseUrl = `https://vre-staging.indocresearch.org${PORTAL_PREFIX}/`;
    mailHogHost = '10.3.7.142';
    mailHogPort = 8025;
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
