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
const dataConfig = {
  copyReq: {
    projectId: 60023,
    contributorProjId: 75044,
  },
  canvas: {
    projectId: 67239,
    projectCode: 'test20220222',
    projectCodeContributor: 'testproject0413',
    projectGeid: '248874d6-7a4d-4cf4-acac-d30a3007a97d',
  },
  contributorCanvas: {
    projectId: 68129,
    projectCode: 'testproject0413',
  },
  fileDelete: {
    projectCode: 'tp0621',
  },
  fileCopy: {
    collaboratorProjectId: 61390,
    adminProjectId: 104582,
  },
  fileDownload: {
    projectCode: 'tp0621',
  },
  fileUpload: {
    projectCode: 'test0621',
  },
  fileExplorer: {
    projectCode: 'tp0621',
  },
  userProfile: {
    projectId: 104234,
    projectCode: 'test20220222',
  },
};

module.exports = {
  baseUrl,
  mailHogHost,
  mailHogPort,
  dataConfig,
};
