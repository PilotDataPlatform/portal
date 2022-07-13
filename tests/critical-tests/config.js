const dotenv = require('dotenv');
dotenv.config();

const PORTAL_PREFIX = process.env.REACT_APP_PORTAL_PATH;

let baseUrl;
switch (process.env.REACT_APP_TEST_ENV) {
  case 'local':
    baseUrl = `http://localhost:3000${PORTAL_PREFIX}/`;
    break;
  case 'dev':
    baseUrl = `http://${process.env.REACT_APP_DOMAIN}${PORTAL_PREFIX}/`;
    break;
}

mailHogHost = '10.3.7.106';
mailHogPort = 8025;
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

module.exports = {
  baseUrl,
  mailHogHost,
  mailHogPort,
  dataConfig,
};
