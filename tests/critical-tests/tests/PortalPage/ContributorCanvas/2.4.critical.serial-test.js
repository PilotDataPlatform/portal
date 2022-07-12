const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { collaborator } = require('../../../../users');
const { baseUrl, dataConfig } = require('../../../config');
const { projectId, projectCode } = dataConfig.canvas;
const fs = require('fs');
jest.setTimeout(700000);

const {
  generateLocalFile,
  removeExistFile,
  removeLocalFile,
} = require('../../../../utils/fileScaffoldActions.js');
const {
  deleteAction,
  uploadFile,
} = require('../../../../utils/greenroomActions.js');

describe('Project Canvas – Recent File Stream', () => {
  let page;
  let fileName;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1080, height: 900 });
    await login(page, 'contributor');
    await init(page, { closeBanners: false });
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });
  it('upload file', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    fileName = await generateLocalFile(
      `${process.cwd()}/tests/uploads/Test Files`,
      'License.md',
    );
    if (fileName) {
      await page.waitForTimeout(3000);
      await uploadFile(page, 'temp', fileName);
    }
  });
  it('2.4.1 The operator in the log matches username', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/canvas`);
    await page.waitForTimeout(3000);
    const username = await page.$x("//span[@id='header_username']");

    let usernameText = await username[0].evaluate((el) => el.textContent);

    const opearterName = await page.waitForXPath(
      `//div[contains(@class,'Cards_card')]//span[contains(@class,'Cards_user-name' ) and text()='${usernameText}']`,
    );

    expect(opearterName).not.toBe(null);
  });

  it('2.4.2 In ‘Advanced search’, search by time range upload, should not contain future dates', async () => {
    const advancedSearchBtn = await page.waitForXPath(
      "//span[text()='Recent File Stream']//following-sibling::div//span[@aria-label='search']",
    );
    await advancedSearchBtn.click();

    const endDate = await page.$x("//input[@placeholder='End date]");
    let endDateText = await endDate[0].evaluate((el) => el.textContent);

    const timelines = await page.$x(
      "//div[@class='ant-timeline-item-content']",
    );

    for (let timeline of timelines) {
      let timelineText = timeline.evaluate((el) => el.textContent);
      if (!timelineText.includes(endDateText)) {
        expect(timeline).not.toBeTruthy();
        await page.waitForTimeout(2000);
      }
    }
  });
  it('2.4.4 In ‘Advanced search’, search by other user upload/download/delete/all, should not give any option except contributor self', async () => {
    const userDropDown = await page.waitForXPath(
      "//input[@id='advanced_search_user']",
    );
    await userDropDown.click();
    const user = await page.$("//div[@class='ant-select-item-option-content']");
    expect(user.length).toBe(1);
    const testautomation = await page.$(
      "//div[@class='ant-select-item-option-content' and text()='testautomation']",
    );
    expect(testautomation.length).toBe(1);
  });
  it('2.4.10 The ‘Advanced search’ modal should only be closed by user click the cross on the top right corner', async () => {
    const closeAdvancedBtn = await page.waitForXPath(
      "//span[@aria-label='close']",
    );
    await closeAdvancedBtn.click();
    const advancedTitle = await page.waitForXPath(
      "//div[@class='ant-modal-title' and contains(text(),'File Stream')]",
      { hidden: true },
    );
    expect(advancedTitle).toBe(null);
  }),
    it('delete file', async () => {
      await page.goto(`${baseUrl}project/${projectCode}/data`);
      await removeLocalFile(fileName);
    });
  it('2.4.9 Search result of deletion should provide original folder information, such as from Green room/Home to Trash or from Core/Home to Trash ', async () => {
    await selectGreenroomFile(page, fileName);
    await clickFileAction(page, 'Delete');
    await page.waitForXPath(
      '//div[contains(@class, "ant-modal-title") and contains(text(), "Delete Files")]',
      {
        visible: true,
      },
    );
    const deleteMsg = await page.waitForXPath(
      "//div[@class='ant-modal-body']//p[contains(text(),'sent')]",
    );
    expect(deleteMsg).not.toBe(null);
    await page.waitForTimeout(2000);
    const modalConfirmButton = await page.waitForXPath(
      '//div[contains(@class, "ant-modal-footer")]/descendant::button/descendant::span[contains(text(), "OK")]/ancestor::button',
    );
    await modalConfirmButton.click();
    await page.waitForTimeout(3000);
  });
  it('2.4.8 If search returns no result, then it should say ‘No result’', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/canvas`);
    await page.waitForXPath(
      "//span[text()='Recent File Stream']//following-sibling::div//span[@aria-label='search']",
    );
    const search = await page.waitForXPath(
      "//span[text()='Recent File Stream']//following-sibling::div//span[@aria-label='search']",
    );
    await search.click();

    const emptyDescr = await page.waitForXPath(
      "//p[@class='ant-empty-description']",
    );
    expect(emptyDescr).not.toBe(null);
  });
});
