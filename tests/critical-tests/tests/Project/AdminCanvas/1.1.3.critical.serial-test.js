/*
 * Copyright (C) 2022 Indoc Research
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
const { login, logout } = require('../../../../utils/login');
const { init } = require('../../../../utils/commonActions.js');
const { baseUrl, dataConfig } = require('../../../config');
const { admin } = require('../../../../users');
const { waitForRes } = require('../../../../utils/api');
const {
  waitForFileExplorer,
  createFolder,
  navigateInsideFolder,
  uploadFile,
  downloadFile,
  deleteFileFromGreenroom,
} = require('../../../../utils/greenroomActions');

// const { projectCode } = dataConfig.adminCanvas;
jest.setTimeout(700000000);

// TODO: update when 'project-file/size' and 'project-file/activity' routes are live for all projects
const projectCode = 'indoctestproject';

describe('Project Admin Canvas - Charts', function () {
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

  beforeEach(async () => {
    await page.goto(`${baseUrl}project/${projectCode}/canvas`);
  });

  it('The number of upload and download matches today’s number of occurrence', async function () {
    // TODO: update with createFolder below when project-files API is live
    const folderName = 'dddd';
    const folderPath = 'Test Files';
    const fileUpload = 'test001.md';

    await page.waitForTimeout(5000);
    await waitForRes(page, '/statistics');

    const xUploadStat =
      "//ul[contains(@class, 'Cards_charts__meta')]/li/descendant::span[contains(text(), 'Uploaded')]/parent::div/div/span[2]";
    const xDownloadStat =
      "//ul[contains(@class, 'Cards_charts__meta')]/li/descendant::span[contains(text(), 'Downloaded')]/parent::div/div/span[2]";

    const beforeUploadStat = await page.waitForXPath(xUploadStat);
    const beforeUpload = await beforeUploadStat.evaluate(
      (node) => node.innerText,
    );
    // const beforeDownloadStat = await page.waitForXPath(xDownloadStat);
    // const beforeDownload = await beforeDownloadStat.evaluate(
    //   (node) => node.innerText,
    // );

    // navigate to file explorer, create folder and upload
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    await waitForFileExplorer(page, admin.username);
    // await createFolder(page, folderName);
    await navigateInsideFolder(page, folderName);
    await uploadFile(page, folderPath, fileUpload);

    // download - TODO: to be tested when download service is fixed
    // await page.goto(`${baseUrl}project/${projectCode}/data`);
    // await navigateInsideFolder(page, folderName);
    // // TODO: downloadFile function's expect needs to be updated when testing
    // await downloadFile(page, fileUpload, () => waitForRes(page, '/download/status'))

    // delete upload
    await page.goto(`${baseUrl}project/${projectCode}/data`);
    await waitForFileExplorer(page, admin.username);
    await navigateInsideFolder(page, folderName);
    await deleteFileFromGreenroom(page, fileUpload);

    await page.goto(`${baseUrl}project/${projectCode}/canvas`);
    await page.waitForTimeout(5000);
    await waitForRes(page, '/statistics');

    const afterUploadStat = await page.waitForXPath(xUploadStat);
    const afterUpload = await afterUploadStat.evaluate(
      (node) => node.innerText,
    );
    // const afterDownloadStat = await page.waitForXPath(xDownloadStat);
    // const afterDownload = await afterDownloadStat.evaluate(
    //   (node) => node.innerText,
    // );

    expect(afterUpload - beforeUpload).toBe(1);
    // expect(afterDownload - beforeDownload).toBe(1);
  });
});
