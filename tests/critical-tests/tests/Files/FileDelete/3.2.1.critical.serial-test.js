const { login, logout } = require('../../../../utils/login.js');
const { admin } = require('../../../../users');
const { init } = require('../../../../utils/commonActions.js');
const { baseUrl, dataConfig } = require('../../../config');
const { projectCode } = dataConfig.fileDelete;
const {
  selectGreenroomFile,
  fileName,
  folderName,
  uploadFile,
  deleteAction,
  checkFilePanelStatus,
  waitForFileExplorer,
  toggleFilePanel,
} = require('../../../../utils/greenroomActions.js');

describe('3.2 The selected file/folder can be deleted by using delete button', () => {
  let page;
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

  it('Upload files to test project', async () => {
    await uploadFile(page, folderName, fileName);
  });

  it('3.2.1 - The file will have "to be deleted" tag after clicking the delete button', async () => {
    await waitForFileExplorer(page, admin.username);
    await selectGreenroomFile(page, fileName);
    await deleteAction(page);
    const deleteTag = page.waitForXPath(
      '//div[contains(@class, "ant-tabs-tabpane-active")]/descendant::div[contains(@class, "ant-table-layout")]/descendant::td[3]/descendant::span[contains(text(), "to be deleted")]',
    );
    expect(deleteTag).toBeTruthy();

    // wait for file to be deleted before proceeding
    await toggleFilePanel(page);
    await checkFilePanelStatus(page, fileName);
  });
});
