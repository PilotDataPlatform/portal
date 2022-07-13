const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { contributor } = require('../../../../users');
const { baseUrl, dataConfig } = require('../../../config');
const { projectId, projectCode } = dataConfig.canvas;
jest.setTimeout(700000);

describe('2.2 Canvas page – Go To', () => {
  let page;
  let api;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1080, height: 900 });
    await login(page, 'admin');
    await init(page, { closeBanners: false });
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });
  function getResponseBody(resolve, reject) {
    page.on('response', async function (response) {
      if (response.url().includes(api)) {
        resolve(await response.text());
      }
    });
  }

  it('perpare user is contributor', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/teams`);
    await page.waitForXPath("//tr[@data-row-key='testautomation']");
    const contributor = await page.$x(
      "//tr[@data-row-key='testautomation']//td[text()='Project Contributor']",
    );
    if (contributor.length > 0) {
      const changeRoleBtn = await page.waitForXPath(
        "//tr[@data-row-key='testautomation']//div//a[contains(text(),'role')]",
      );
      await changeRoleBtn.click();
      await page.waitForXPath(
        "//li[contains(@class,'ant-dropdown-menu-item') and text()='Project Contributor']",
      );
      const contributorRoleBtn = await page.waitForXPath(
        "//li[contains(@class,'ant-dropdown-menu-item') and text()='Project Contributor']",
      );
      contributorRoleBtn.click();
      await page.waitForTimeout(2000);
      await logout(page);
      await page.waitForTimeout(3000);
    }
  }),
    it('In Go To, Project Contributor should be able to see Green Room icon, click it will go to corresponding file explorer page Green Room/Home ', async () => {
      await login(page, 'contributor');
      await init(page, { closeBanners: true });
      await page.waitForTimeout(4000);

      await page.goto(`${baseUrl}project/${projectCode}/canvas`);

      const greenHomeIcon = await page.waitForXPath(
        "//div[contains(@class,'shortcut--greenhome')]",
      );

      expect(greenHomeIcon).not.toBe(null);
    }),
    it('In Go To, Project Contributor should be able to see Green Room icon, click it will go to corresponding file explorer page Green Room/Home', async () => {
      await page.goto(`${baseUrl}project/${projectCode}/canvas`);
      await page.waitForXPath("//div[contains(@class,'shortcut--greenhome')]");
      let greenHomeIcon = await page.waitForXPath(
        "//div[contains(@class,'shortcut--greenhome')]",
      );

      expect(greenHomeIcon).not.toBe(null);

      //go to greenhome file expolre
      await greenHomeIcon.click();
      await page.waitForTimeout(6000);
      let greehomeTab = await page.waitForXPath(
        "//div[@id='tab-greenroom-home']",
      );
      expect(greehomeTab).not.toBe(null);
    }),
    it('2.2.2 In Go To, the Greenroom Files reflect all the number of files in Greenroom', async () => {
      //get data from api;
      api = `api/vre/portal/v1/files/meta?page=0&page_size=10&order_by=created_time&order_type=desc&zone=greenroom&project_code=${projectCode}&parent_path=admin&source_type=folder&archived=false`;

      waitForResponse = new Promise(getResponseBody);
      await page.goto(`${baseUrl}project/${projectCode}/data`, {
        waitUntil: 'networkidle0',
      });
      response = await waitForResponse;

      let greenhomeFiles = JSON.parse(response);

      let pagesNum = await page.$x(
        "//li[contains(@class,'ant-pagination-item')]",
      );

      if (greenhomeFiles.total > 0) {
        expect(pagesNum.length).toBe(greenhomeFiles.num_of_pages);
      } else {
        expect(pagesNum.length).toBe(0);
      }

      await page.waitForTimeout(2000);
    });
});
