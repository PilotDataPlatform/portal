const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { collaborator } = require('../../../../users');
const { baseUrl, dataConfig } = require('../../../config');
const { projectId, projectCode } = dataConfig.canvas;
jest.setTimeout(700000);

describe('1.2 Canvas page – Go To', () => {
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

  it('1.2.1 In Go To, Project admin should be able to see Green Room, Core and Collections icons, user should be able to see the correct metadata and able to click on them to go to corresponding file explorer page', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/canvas`);

    const greenHomeIcon = await page.waitForXPath(
      "//div[contains(@class,'shortcut--greenhome')]",
    );
    const coreIcon = await page.waitForXPath(
      "//div[contains(@class,'shortcut--core')]",
    );
    const collectionIcon = await page.waitForXPath(
      "//div[contains(@class,'shortcut--collection')]",
    );
    expect(greenHomeIcon).not.toBe(null);
    expect(coreIcon).not.toBe(null);
    expect(collectionIcon).not.toBe(null);
  }),
    it('1.2.1 In Go To, Project admin should be able to see Green Room, Core and Collections icons, user should be able to see the correct metadata and able to click on them to go to corresponding file explorer page', async () => {
      await page.goto(`${baseUrl}project/${projectCode}/canvas`);
      await page.waitForXPath("//div[contains(@class,'shortcut--greenhome')]");
      let greenHomeIcon = await page.waitForXPath(
        "//div[contains(@class,'shortcut--greenhome')]",
      );
      let coreIcon = await page.waitForXPath(
        "//div[contains(@class,'shortcut--core')]",
      );
      let collectionIcon = await page.waitForXPath(
        "//div[contains(@class,'shortcut--collection')]",
      );
      expect(greenHomeIcon).not.toBe(null);
      expect(coreIcon).not.toBe(null);
      expect(collectionIcon).not.toBe(null);

      //go to greenhome file expolre
      await greenHomeIcon.click();
      await page.waitForTimeout(6000);
      let greehomeTab = await page.waitForXPath(
        "//div[@id='tab-greenroom-home']",
      );
      expect(greehomeTab).not.toBe(null);
    }),
    it('1.2.2 In Go To, the Greenroom Files reflect all the number of files in Greenroom', async () => {
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
    }),
    it('1.2.1 from GoTo to core home in file expolre and 1.2.3 In Go To, the Core Files reflect all the number of files in Core', async () => {
      await page.goto(`${baseUrl}project/${projectCode}/canvas`);
      await page.waitForXPath("//div[contains(@class,'shortcut--greenhome')]");
      coreIcon = await page.waitForXPath(
        "//div[contains(@class,'shortcut--core')]",
      );

      api = `api/vre/portal/v1/files/meta?page=0&page_size=10&order_by=created_time&order_type=desc&zone=core&project_code=${projectCode}&parent_path=admin&source_type=folder&archived=false`;

      waitForResponse = new Promise(getResponseBody);
      await coreIcon.click();
      await page.waitForTimeout(3000);
      response = await waitForResponse;

      let coreFiles = JSON.parse(response);

      let pagesNum = await page.$x(
        "//li[contains(@class,'ant-pagination-item')]",
      );
      if (coreFiles.total > 0) {
        expect(pagesNum.length).toBe(coreFiles.num_of_pages);
      } else {
        expect(pagesNum.length).toBe(0);
      }
      await page.waitForTimeout(6000);
      let coreTab = await page.waitForXPath("//div[@id='tab-core-home']");
      expect(coreTab).not.toBe(null);
      await page.waitForTimeout(2000);
    });

  it('1.2.1 from GoTo to collection home and 1.2.4 In Go To, Colllections reflect the total number of collections the user has', async () => {
    //go to collection file expolre

    await page.goto(`${baseUrl}project/${projectCode}/canvas`);
    await page.waitForXPath("//div[contains(@class,'shortcut--greenhome')]");
    const opacity = await page.$x("//span[contains(@style,'opacity: 1')]");
    collectionIcon = await page.waitForXPath(
      "//div[contains(@class,'shortcut--collection')]",
    );
    //check if collections > 0
    if (opacity.length > 0) {
      api = `api/vre/portal/v1/files/meta?page=0&page_size=10&order_by=created_time&order_type=desc&zone=core&project_code=${projectCode}&parent_path=admin&source_type=collection&archived=false`;

      waitForResponse = new Promise(getResponseBody);
      await collectionIcon.click();
      await page.waitForTimeout(6000);
      response = await waitForResponse;

      let collectionFiles = JSON.parse(response);

      let pagesNum = await page.$x(
        "//li[contains(@class,'ant-pagination-item')]",
      );

      if (collectionFiles.total > 0) {
        expect(pagesNum.length).toBe(collectionFiles.num_of_pages);
      } else {
        expect(pagesNum.length).toBe(0);
      }
      let collectionTab = await page.waitForXPath("//div[@id='tab-vfolder']");
      expect(collectionTab).not.toBe(null);
    }
  });
});
