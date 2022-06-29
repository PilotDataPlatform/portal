const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { collaborator } = require('../../../../users');
const { baseUrl, dataConfig } = require('../../../config');
jest.setTimeout(700000);
const { projectId } = dataConfig.contributorCanvas;

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
  it('2.7.1 No ‘Members’ page button on the side bar', async () => {
    await page.goto(`${baseUrl}project/${projectId}/canvas`);

    const member = await page.waitForXPath(
      "//span[contains(@class,'anticon-team')]",
      { hidden: true },
    );

    expect(member).toBe(null);
  });
});
