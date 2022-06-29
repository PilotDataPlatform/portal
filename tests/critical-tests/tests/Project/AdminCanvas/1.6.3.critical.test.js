const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { collaborator } = require('../../../../users');
const { baseUrl, dataConfig } = require('../../../config');
const { projectId, projectCode } = dataConfig.userProfile;
const {
  fileName,
  folderName,
  uploadFile,
} = require('../../../../utils/greenroomActions.js');
jest.setTimeout(700000);

describe('1.6.2', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await login(page, 'admin');
    await init(page, { closeBanners: false });
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });
  it('Check sidebar position', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/canvas`);
    const team = await page.waitForXPath(
      "//li[@class='ant-menu-item ant-menu-item-only-child' and @role='menuitem']//span[@aria-label='team']",
    );
    expect(team).not.toBe(null);
  });
});
