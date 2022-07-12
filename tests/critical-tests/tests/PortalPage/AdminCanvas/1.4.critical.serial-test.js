const fs = require('fs');
const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { admin, collaborator } = require('../../../../users');
const { baseUrl, dataConfig } = require('../../../config');

const {
  fileName,
  folderName,
  waitForFileExplorer,
  uploadAction,
  toggleFilePanel,
  checkFilePanelStatus,
  deleteAction,
  selectGreenroomFile,
  clickFileAction,
} = require('../../../../utils/greenroomActions.js');
const { projectId, projectCode, projectGeid } = dataConfig.canvas;
const moment = require('moment-timezone');
const { TestScheduler } = require('jest');
jest.setTimeout(700000);

describe('1.4 Canvas page – Recent File Stream ', () => {
  let page;
  let renamedFileName;
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
        console.log('get response');
        resolve(await response.text());
      }
    });
  }

  async function convertToLocalTime(fileName) {
    console.log('get time start');
    api = `audit-logs`;

    waitForResponse = new Promise(getResponseBody);
    await page.goto(`${baseUrl}project/${projectCode}/canvas`, {
      waitUntil: 'networkidle0',
    });
    response = await waitForResponse;

    let greenhomeFiles = JSON.parse(response);

    for (let file of greenhomeFiles.result) {
      if (file['_source']['displayName'] === fileName) {
        let localTime = moment(file['_source']['createdTime'] * 1000).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        return localTime;
      }
    }
  }
  it('upload file', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);

    await waitForFileExplorer(page, admin.username);
    await page.waitForTimeout(5000);
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    renamedFileName = await generateLocalFile(
      `${process.cwd()}/tests/uploads/Test Files`,
      'License.md',
    );
    if (renamedFileName) {
      await page.waitForTimeout(3000);
      await uploadFile(page, 'temp', renamedFileName);
    }
  });

  it('1.4.1 Project admin could search download/upload/copy/delete/all activities in Recent File Stream. and 1.4.2 The operator in the log matches username and 1.4.3 Upload/download/copy/delete log matches device local time ', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/canvas`);

    await page.waitForXPath("//span[@id='header_username']");

    const username = await page.$x("//span[@id='header_username']");

    let usernameText = await username[0].evaluate((el) => el.textContent);

    const username_in_stream = await page.waitForXPath(
      `//span[text()='${renamedFileName}']//ancestor::span//parent::*//parent::*//following-sibling::div//div[contains(@class,'file-descr')]//span[text()='${usernameText}']`,
    );

    expect(username_in_stream).not.toBe(null);

    //Upload log matches device local time
    let localUploadedTime = await convertToLocalTime(renamedFileName);

    const uploadTime_in_steam = await page.waitForXPath(
      `//span[text()='${renamedFileName}']//ancestor::span//parent::*//parent::*//following-sibling::div//div[contains(@class,'file-descr')]//span[contains(@class,'time') and text()='${localUploadedTime}']`,
    );

    expect(uploadTime_in_steam).not.toBe(null);
  });

  it('1.4.5,15 In today’s file stream, upload/download/copy/delete log only shows the current date logs.', async () => {
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
  it('1.4.6 The header of Advanced search modal is “File Stream Advanced Search', async () => {
    const advancedTitle = await page.waitForXPath(
      "//div[@class='ant-modal-title' and contains(text(),'File Stream')]",
    );
    expect(advancedTitle).not.toBe(null);
  }),
    it('1.4.8 The ‘Advanced search’ modal should only be closed by user click the cross on the top right corner', async () => {
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
    it('1.4.9,10,11,18 In ‘Advanced search’, search by other user upload/download/copy with/without range time', async () => {
      const userDropDown = await page.waitForXPath(
        "//input[@id='advanced_search_user']",
      );
      await userDropDown.click();
      const user = await page.$(
        "//div[@class='ant-select-item-option-content']",
      );
      expect(user.length).GreaterThan(0);
      const testautomation = await page.$(
        "//div[@class='ant-select-item-option-content' and text()='testautomation']",
      );
      expect(testautomation.length).toBe(1);

      const type = await page.waitForXPath(
        "//div[contains(@class,'Modals_filterWrapper')]//span[@class='ant-select-selection-item' and text()='Upload']",
      );
      await type.click();

      const download = await page.waitForXPath(
        "//div[@class='ant-select-item-option-content' and text()='Download']",
      );
      await download.click();

      const startDate = await page.$x("//input[@placeholder='Start date]");
      await startDate.click();

      const first = await page.waitForXPath(
        "//div[@class='ant-picker-cell-inner' and text()=1]",
      );

      await first.click();

      const search = await page.waitForXPath(
        "//div[contains(@class,'Modals')]//button[@type='submit']",
      );
      await search.click();

      const timelinecontent = await page.waitForXPath(
        "//div[@class='ant-timeline-item-content']",
      );
      expect(timelinecontent).not.toBe(null);
    });
  it('1.4.12,13,14,19 In ‘Advanced search’, search login account’s self upload/download/copy with/without range time', async () => {
    const userDropDown = await page.waitForXPath(
      "//input[@id='advanced_search_user']",
    );
    await userDropDown.click();
    const user = await page.$("//div[@class='ant-select-item-option-content']");
    expect(user.length).GreaterThan(0);
    const admin = await page.$(
      "//div[@class='ant-select-item-option-content' and text()='All Users']",
    );
    expect(admin.length).toBe(1);

    const type = await page.waitForXPath(
      "//div[contains(@class,'Modals_filterWrapper')]//span[@class='ant-select-selection-item' and text()='Upload']",
    );
    await type.click();

    const download = await page.waitForXPath(
      "//div[@class='ant-select-item-option-content' and text()='Download']",
    );
    await download.click();

    const startDate = await page.$x("//input[@placeholder='Start date]");
    await startDate.click();

    const first = await page.waitForXPath(
      "//div[@class='ant-picker-cell-inner' and text()=1]",
    );

    await first.click();

    const search = await page.waitForXPath(
      "//div[contains(@class,'Modals')]//button[@type='submit']",
    );
    await search.click();

    const timelinecontent = await page.waitForXPath(
      "//div[@class='ant-timeline-item-content']",
    );
    expect(timelinecontent).not.toBe(null);
  });
  it('delete file', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    await removeLocalFile(renamedFileName);
  });
  it('1.4.22 Search result of deletion should provide original folder information, such as from Green room/Home to Trash or from Core/Home to Trash ', async () => {
    await selectGreenroomFile(page, renamedFileName);
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
  it('1.4.21 If search returns no result, then it should say ‘No result’', async () => {
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
