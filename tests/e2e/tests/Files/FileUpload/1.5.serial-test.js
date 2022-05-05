const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { baseUrl } = require('../../../config');
const {
  createFolder,
  navigateInsideFolder,
  uploadFile,
  cleanupGreenroom,
} = require('../../../../utils/greenroomActions.js');
const { createDummyFile } = require('../../../../utils/createDummyFile');
const fs = require('fs');

const folderName = 'Existing Folder';
const fileName = '1gb-test';

describe('1.5 Upload file/folder to existing folder', () => {
  let page;
  const projectId = 96722;
  jest.setTimeout(700000000);

  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await login(page, 'admin');
    await init(page);
  });

  beforeEach(async () => {
    await page.setCacheEnabled(false);
    await page.goto(`${baseUrl}project/${projectId}/canvas`);
  });

  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });

  it('1.5 - Upload file 1G to existing folder', async () => {
    await createFolder(page, folderName);
    await navigateInsideFolder(page, folderName);
    if (
      !fs.existsSync(`${process.cwd()}/Tests/uploads/FileUpload/${fileName}`)
    ) {
      await createDummyFile('FileUpload', fileName, '1gb');
    }
    await uploadFile(page, 'FileUpload', fileName);
  });

  it('Delete test files from test project', async () => {
    await cleanupGreenroom(page);
  });
});
