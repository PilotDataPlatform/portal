const fs = require('fs');
const { login, logout } = require('../../../../utils/login.js');
const { admin } = require('../../../../users');
const { init } = require('../../../../utils/commonActions.js');
const { baseUrl } = require('../../../config');
const {
  folderName,
  uploadMultipleFiles,
  deleteAction,
  selectGreenroomFile,
  cleanupGreenroom,
} = require('../../../../utils/greenroomActions.js');

describe('1.1.0 One or more file upload', () => {
  let page;
  // const projectId = 96722;
  const projectCode = 'test0621';
  jest.setTimeout(7000000); //sets timeout for entire test suite

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
    await page.goto(`${baseUrl}project/${projectCode}/data`);
  });

  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });
  async function removeExistFiles(fileNames) {
    if (fileNames.length > 0) {
      fileNames.forEach(async (file) => {
        const search = await page.waitForXPath(
          "//span[contains(@class,'search')]",
        );
        await search.click();
        const nameInput = await page.waitForXPath(
          '//div[contains(@class, "ant-dropdown")]//input[@placeholder="Search name"]',
          { visible: true },
        );
        await nameInput.type(file);
        const searchFileBtn = await page.waitForXPath(
          '//div[contains(@class, "ant-dropdown")]//button[contains(@class, "ant-btn-primary")]',
          { visible: true },
        );
        await searchFileBtn.click();
        let fileInTable = await page.$x(
          `//td[@class='ant-table-cell']//span[text()=${file}]`,
        );
        if (fileInTable.length > 0) {
          await selectGreenroomFile(page, file);
          await deleteAction(page);
        }
      });
    }
  }

  it('1.1.0.1 - Should be able to upload one or more than one file', async () => {
    const fileNames = fs.readdirSync(`./tests/uploads/${folderName}`);

    const filePaths = fileNames.map(
      (file) => `${process.cwd()}/tests/uploads/${folderName}/${file}`,
    );

    await removeExistFiles(fileNames);

    await uploadMultipleFiles(page, filePaths, fileNames);
  });

  it('Cleanup greenroom', async () => {
    await cleanupGreenroom(page);
  });
});
