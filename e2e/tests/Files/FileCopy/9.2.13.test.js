const { login } = require('../../../utils/login.js');
const { admin } = require('../../../users');
const { init } = require('../../../utils/commonActions.js');
const {
  copyFileToCore,
  deleteFileFromGreenroom,
} = require('../../../utils/greenroomActions.js');
const { baseUrl } = require('../../../config');

describe('9.2 File Copy', () => {
  let page;
  const projectId = 61268;
  jest.setTimeout(700000); //sets timeout for entire test suite

  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setCacheEnabled(false);
    await login(page, 'admin');
    await init(page);
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });

  it('9.2.13 - files that are in concurrent operations will be locked', async () => {
    await page.goto(`${baseUrl}project/${projectId}/canvas`);

    const fileName = 'Test Files';
    await copyFileToCore(page, fileName, admin.username);
    await deleteFileFromGreenroom(page, fileName);

    const fileLog = await page.waitForXPath(
      '//header/descendant::li/descendant::span[contains(@class, "Layout_badge")]',
    );
    await fileLog.click();
    await page.waitForSelector('.ant-popover-inner-content');

    // find fileName with copy icon
    await page.waitForXPath(
      `//div[contains(@class, "ant-tabs-content")]/descendant::span[contains(@aria-label, "copy")]/parent::span[contains(text(), '${fileName}')]`,
    );
    // find fileName with delete icon
    await page.waitForXPath(
      `//div[contains(@class, "ant-tabs-content")]/descendant::span[contains(@aria-label, "rest")]/parent::span[contains(text(), '${fileName}')]`,
    );

    await page.click('#tab-deleted');
    const deleteFailed = await page.waitForXPath(
      `//div[contains(@class, "Layout_deleted_list")]/descendant::li/descendant::span[contains(@aria-label, "close")]/following-sibling::span[contains(text(), "${fileName}")]/following-sibling::span[contains(text(), "Green Room")]`,
      { timeout: 120000 },
    );
    const file = await page.waitForXPath(
      `//tr[contains(@class, 'ant-table-row')]/descendant::span[contains(text(), '${fileName}')]/ancestor::tr`,
    );

    expect(deleteFailed).toBeTruthy(); // delete fail in file log
    expect(file).toBeTruthy(); // file still present in greenroom
  });
});
