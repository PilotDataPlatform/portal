const dotenv = require('dotenv');
dotenv.config();

const PORTAL_PREFIX = process.env.REACT_APP_PORTAL_PATH;

baseUrl = `http://localhost:3000${PORTAL_PREFIX}/`;
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
  },
  contributorCanvas: {
    projectId: 68129,
  },
  fileCopy: {
    collaboratorProjectId: 61390,
    adminProjectId: 104582,
  },
  userProfile: {
    projectId: 104234,
  },
};

module.exports = {
  baseUrl,
  mailHogHost,
  mailHogPort,
  dataConfig,
};
