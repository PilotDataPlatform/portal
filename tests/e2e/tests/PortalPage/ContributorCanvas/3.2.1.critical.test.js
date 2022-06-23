const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { collaborator } = require('../../../../users');
const { baseUrl, dataConfig } = require('../../../config');
jest.setTimeout(700000);
const { projectCode } = dataConfig.contributorCanvas;

describe('Contributor Canvas', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await login(page, 'contributor');
    await init(page, { closeBanners: false });
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });
  it('3.2.1 Contributor should not see the Core folder ', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/canvas`);

    const coreFolder = await page.waitForXPath(
      "//div[contains(@class,'shortcut--core')]",
      { hidden: true },
    );

    expect(coreFolder).toBe(null);
  });
});
