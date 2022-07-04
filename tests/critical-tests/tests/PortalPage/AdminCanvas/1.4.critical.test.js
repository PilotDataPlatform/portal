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

let renamedFileName = '';

describe('1.4 Canvas page – Recent File Stream ', () => {
  let page;
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
  async function renameFile(path, file) {
    let status = 1;
    //get extension
    let ext = file.split('.');
    //copy file and rename
    try {
      fs.copyFile(
        `${path}/${file}`,
        `${path}/1.4-test-${moment().unix()}.${ext[1]}`,
        (err) => {
          if (err) throw err;
          console.log('success');
        },
      );
      status = 0;
    } catch (err) {
      status = 1;
    }

    if (status === 0) {
      return `1.4-test-${moment().unix()}.${ext[1]}`;
    }
  }

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

  it('1.4.1 Project admin could search download/upload/copy/delete/all activities in Recent File Stream. and 1.4.2 The operator in the log matches username and 1.4.3 Upload/download/copy/delete log matches device local time ', async () => {
    // await page.goto(`${baseUrl}project/${projectCode}/data`);

    // await waitForFileExplorer(page, admin.username);
    // await page.waitForTimeout(5000);

    // //perpare file (upload)
    // let renamedFileName = await renameFile(
    //   `${process.cwd()}/tests/uploads/${folderName}`,
    //   fileName,
    // );

    // await uploadAction(page);
    // const uploadInputField = await page.waitForSelector('#form_in_modal_file');
    // await uploadInputField.uploadFile(
    //   `${process.cwd()}/tests/uploads/${folderName}/${renamedFileName}`,
    // );

    // await page.click('#file_upload_submit_btn');

    // await toggleFilePanel(page);
    // await checkFilePanelStatus(page, renamedFileName);

    // const uploadedFile = await page.waitForXPath(
    //   `//tr[contains(@class, 'ant-table-row')]/descendant::span[contains(text(), '${renamedFileName}')]`,
    // );
    // expect(uploadedFile).toBeTruthy();
    let renamedFileName = '1.4-test-1656959515.md';

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
    console.log(localUploadedTime);

    const uploadTime_in_steam = await page.waitForXPath(
      `//span[text()='${renamedFileName}']//ancestor::span//parent::*//parent::*//following-sibling::div//div[contains(@class,'file-descr')]//span[contains(@class,'time') and text()='${localUploadedTime}']`,
    );

    expect(uploadTime_in_steam).not.toBe(null);
  });
  //   it('1.4.1 Project admin could search download/upload/copy/delete/all activities in Recent File Stream', async () => {
  //     await page.goto(`${baseUrl}project/${projectCode}/teams`);
  //     await page.waitForXPath(
  //       "//div[@class='ant-row']/main[@class='ant-layout-content']//span[@aria-label='down-circle']",
  //     );

  //     expect(admins.length).toBe(mail.length);
  //   });
});
