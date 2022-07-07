const dotenv = require('dotenv');
dotenv.config();

const PORTAL_PREFIX = process.env.REACT_APP_PORTAL_PATH;

let baseUrl;
let mailHogHost;
let mailHogPort;
let mailHogAdminEmail;
let dataConfig = {
  copyReq: {
    projectCode: 'test20220222',
    contributorProjectCode: 'testproject0413',
  },
  adminCanvas: {
    projectCode: 'test20220222',
  },
  contributorCanvas: {
    projectCode: 'testproject0413',
  },
  fileCopy: {
    adminProjectCode: 'test20220222',
    collaboratorProjectCode: 'dluuwiptest',
  },
  fileUpload: {
    projectCode: 'test0609',
  },
  userProfile: {
    projectCode: 'test0411',
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
    baseUrl = `http://${process.env.REACT_APP_DOMAIN}${PORTAL_PREFIX}/`;
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
