const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { baseUrl, dataConfig } = require('../../../config');
const { projectCode } = dataConfig.adminCanvas;
jest.setTimeout(700000);

describe('6.1.1', () => {
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
  it('6.1.1 Only project administrator could access project setting page', async () => {
    // admin
    await page.goto(`${baseUrl}project/${projectCode}/canvas`);
    const announcementContent = await page.waitForXPath(
      '//ul[@id="side-bar"]//li[contains(@class, "ant-menu-item")]//span[text()="Settings"]',
    );
    expect(announcementContent).not.toBe(null);
  });
});
