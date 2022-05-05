const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { collaborator } =require('../../../../users');
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
  it('3.2.1 Contributor should not see the Core folder ', async () => {
    await page.goto(`${baseUrl}project/${projectId}/canvas`);

    const coreFolder = await page.waitForXPath(
      "//span[@class='FileExplorer_core_title__1kpRo' and @id='core_title']",
      { hidden: true },
    );

    expect(coreFolder).toBe(null);
  });
});
