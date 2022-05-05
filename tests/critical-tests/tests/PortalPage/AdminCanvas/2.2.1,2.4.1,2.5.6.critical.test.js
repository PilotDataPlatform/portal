const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { collaborator } =require('../../../../users');
const { baseUrl, dataConfig } = require('../../../config');
const { projectId } = dataConfig.userProfile;
const {
  fileName,
  folderName,
  uploadFile,
} = require('../../../../utils/greenroomActions.js');
jest.setTimeout(700000);

describe('Project List', () => {
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
  it('2.2 Project administrator should be able to invite user 1.Check sidebar position', async () => {
    await page.goto(`${baseUrl}project/${projectId}/canvas`);
    const team = await page.waitForXPath(
      "//li[@class='ant-menu-item ant-menu-item-only-child' and @role='menuitem']//span[@aria-label='team']",
    );
    expect(team).not.toBe(null);
  });
  it('2.4.1 The number of upload/download/copy activities matches today’s number of occurrence', async () => {
    const upload = await page.waitForXPath(
      "//div[contains(@class,'Cards_card')]//div[span[contains(@class,'Cards_fileFont') and contains(text(),'Uploaded')]]//preceding-sibling::div/span",
    );
    const uploadNum = await upload.evaluate((el) => el.textContent);
    expect(uploadNum).not.toBe(null);

    const download = await page.waitForXPath(
      "//div[contains(@class,'Cards_card')]//div[span[contains(@class,'Cards_fileFont') and contains(text(),'Downloaded')]]//preceding-sibling::div/span",
    );
    const downloadNum = await download.evaluate((el) => el.textContent);
    expect(downloadNum).not.toBe(null);

    const copy = await page.waitForXPath(
      "//div[contains(@class,'Cards_card')]//div[span[contains(@class,'Cards_fileFont') and contains(text(),'Approved')]]//preceding-sibling::div/span",
    );
    const copyNum = await copy.evaluate((el) => el.textContent);
    expect(copyNum).not.toBe(null);
  });
  it('2.5.6 The search result in ‘Advanced search’ should be displayed properly', async () => {
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

    const advancedSearch = await page.waitForXPath(
      "//span[text()='Advanced Search']",
    );
    await advancedSearch.click();

    const type = await page.waitForXPath(
      "//div[contains(@class,'Modals_filterWrapper')]//span[@class='ant-select-selection-item' and text()='Upload']",
    );
    await type.click();

    const download = await page.waitForXPath(
      "//div[@class='ant-select-item-option-content' and text()='Download']",
    );
    await download.click();

    const search = await page.waitForXPath(
      "//div[contains(@class,'Modals')]//button[@type='submit']",
    );
    await search.click();

    const timelinecontent = await page.waitForXPath(
      "//div[@class='ant-timeline-item-content']",
    );
    expect(timelinecontent).not.toBe(null);
  });
});
