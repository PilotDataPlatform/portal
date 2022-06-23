const dotenv = require('dotenv');
dotenv.config();

const PORTAL_PREFIX = process.env.REACT_APP_PORTAL_PATH;

let baseUrl;
let mailHogHost;
let mailHogPort;
let dataConfig;
switch (process.env.REACT_APP_TEST_ENV) {
  case 'local':
    baseUrl = `${process.env.REACT_APP_DOMAIN}/${PORTAL_PREFIX}/`;
    mailHogHost = '10.3.7.106';
    mailHogPort = 8025;
    dataConfig = {
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
    break;
  case 'dev':
    baseUrl = `http://10.3.7.220${PORTAL_PREFIX}/`;
    mailHogHost = '10.3.7.106';
    mailHogPort = 8025;
    dataConfig = {
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
    break;
  case 'staging':
    baseUrl = `https://vre-staging.indocresearch.org${PORTAL_PREFIX}/`;
    mailHogHost = '10.3.7.142';
    mailHogPort = 8025;
    dataConfig = {
      copyReq: {
        projectId: 17346,
        contributorProjId: 75044,
      },
      canvas: {
        projectId: 67239,
        projectCode: 'test20220222',
      },
      contributorCanvas: {
        projectId: 3407,
      },
      fileCopy: {
        collaboratorProjectId: 61390,
        adminProjectId: 104582,
      },
      userProfile: {
        projectId: 104234,
      },
    };
    break;
}
module.exports = {
  baseUrl,
  mailHogHost,
  mailHogPort,
  dataConfig,
};
