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
const fs = require('fs');
const { login, logout } = require('../../../../utils/login.js');
const { admin } = require('../../../../users');
const { init } = require('../../../../utils/commonActions.js');
const { baseUrl, dataConfig } = require('../../../config');
const {
  folderName,
  uploadMultipleFiles,
  deleteAction,
  selectGreenroomFile,
  clickFileAction,
} = require('../../../../utils/greenroomActions.js');

describe('1.1.0 One or more file upload', () => {
  let page;
  const projectCode = dataConfig.fileUpload.projectCode;
  jest.setTimeout(7000000); //sets timeout for entire test suite

  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await login(page, 'admin');
    await init(page);
  });

  beforeEach(async () => {
    await page.setCacheEnabled(false);
    await page.goto(`${baseUrl}project/${projectCode}/data`);
  });

  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });

  async function removeExistFile(file) {
    await page.waitForTimeout(6000);
    let searchBtn = await page.waitForXPath(
      "//span[contains(@class,'search')]//parent::span",
    );
    await searchBtn.click();
    let nameInput = await page.waitForXPath(
      '//div[contains(@class, "ant-dropdown")]//input[@placeholder="Search name"]',
      { visible: true },
    );
    await nameInput.type(file);
    let searchFileBtn = await page.waitForXPath(
      '//div[contains(@class, "ant-dropdown")]//button[contains(@class, "ant-btn-primary")]',
      { visible: true },
    );
    await searchFileBtn.click();
    await page.waitForTimeout(2000);
    let fileInTable = await page.$x(
      `//td[@class='ant-table-cell']//span[text()='${file}']`,
    );

    if (fileInTable.length !== 0) {
      await selectGreenroomFile(page, file);
      await deleteAction(page);
    }
  }

  it('1.1.0.1 - Should be able to upload one or more than one file', async () => {
    const fileNames = fs.readdirSync(`./tests/uploads/${folderName}`);
    fileNames.pop();

    const filePaths = fileNames.map(
      (file) => `${process.cwd()}/tests/uploads/${folderName}/${file}`,
    );

    for (let file of fileNames) {
      await removeExistFile(file);
      await clickFileAction(page, 'Refresh');
      await page.waitForTimeout(6000);
    }
    await clickFileAction(page, 'Refresh');
    await page.waitForTimeout(3000);
    await uploadMultipleFiles(page, filePaths, fileNames);
  });

  it('Cleanup greenroom', async () => {
    // await cleanupGreenroom(page);
    const fileNames = fs.readdirSync(`./tests/uploads/${folderName}`);
    fileNames.pop();
    for (let file of fileNames) {
      await removeExistFile(file);
      await clickFileAction(page, 'Refresh');
      await page.waitForTimeout(6000);
      const deletedFile = await page.waitForXPath(
        `//tr[contains(@class, 'ant-table-row')]/descendant::span[contains(text(), '${file}')]`,
        { timeout: 15000, hidden: true },
      );
      expect(deletedFile).toBeNull();
    }
  });
});
