const { login, logout } = require('../../../../utils/login.js');
const { clearInput, clearSelector } = require('../../../../utils/inputBox.js');
const { init } = require('../../../../utils/commonActions.js');
const {
  createSimpleManifest,
  fillSimpleManifest,
} = require('../../../../utils/manifest.js');
const { baseUrl, dataConfig } = require('../../../config');
const {
  uploadFile,
  deleteFileFromGreenroom,
  selectGreenroomFile,
  clickFileAction,
} = require('../../../../utils/greenroomActions.js');
const { createDummyFile } = require('../../../../utils/createDummyFile');
const { collaborator, admin } =require('../../../../users');
const fs = require('fs');
const { projectId } = dataConfig.canvas;
jest.setTimeout(700000);

describe('2.17.2', () => {
  let page;
  const fileName = 'tinified.zip';
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page._client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: './tests/downloads',
    });
    await page.goto(baseUrl);
    await page.setViewport({ width: 1500, height: 1080 });
    await login(page, 'collaborator');
    await init(page, { closeBanners: false });
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });
  it('prepare file for test', async () => {
    await page.goto(`${baseUrl}project/${projectId}/canvas`);
    if (!fs.existsSync(`${process.cwd()}/tests/uploads/test/${fileName}`)) {
      await createDummyFile('Test Files', fileName, '10kb');
    }
    await uploadFile(page, 'Test Files', fileName);
  });
  it("Project admin could access any users' name folder download any file", async () => {
    await logout(page);
    await login(page, 'admin');
    // need to be fixed later
    await page.goto(`${baseUrl}project/${61268}/canvas`);
    await page.waitForTimeout(3000);
    await page.waitForXPath(
      '//div[contains(@class, "FileExplorer_file_folder_path")]//span[@class="ant-breadcrumb-link" and text()="' +
        admin.username +
        '"]',
      { visible: true },
    );
    const greenroomBtn = await page.waitForXPath(
      '//div[contains(@class, "FileExplorer_file_folder_path")]//span[@class="ant-breadcrumb-link" and text()="Green Room"]',
      { visible: true },
    );
    await greenroomBtn.click();
    await page.waitForTimeout(3000);
    const searchNameTrigger = await page.waitForXPath(
      '//span[contains(@class, "ant-table-filter-trigger-container")]',
      { visible: true },
    );
    await searchNameTrigger.click();
    const nameInput = await page.waitForXPath(
      '//div[contains(@class, "ant-dropdown")]//input[@placeholder="Search name"]',
      { visible: true },
    );
    await nameInput.type(collaborator.username);
    const searchBtn = await page.waitForXPath(
      '//div[contains(@class, "ant-dropdown")]//button[contains(@class, "ant-btn-primary")]',
      { visible: true },
    );
    await searchBtn.click();
    await page.waitForTimeout(3000);

    const userFolder = await page.waitForXPath(
      '//td[contains(@class, "ant-table-cell")]//span[text()="' +
        collaborator.username +
        '"]',
      { visible: true },
    );
    await userFolder.click();
    await page.waitForTimeout(3000);

    const fileKebabBtn = await page.waitForXPath(
      '//span[text()="' +
        fileName +
        '"]//ancestor::td//following-sibling::td[@class="ant-table-cell"]//button[contains(@class, "ant-dropdown-trigger")]',
    );
    await fileKebabBtn.click();
    const downloadBtn = await page.waitForXPath(
      '//li[contains(@class, "ant-dropdown-menu-item") and text()="Download"]',
    );
    await downloadBtn.click();
    await page.waitForTimeout(10000);
    // if no error raised, that means the file has been downloaded
    await fs.readFileSync(`./tests/downloads/${fileName}`);
    //remove file when test ends
    await fs.unlinkSync(`./tests/downloads/${fileName}`);
  });
});
