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
const { login, logout } = require('../../../../utils/login.js');
const { admin } = require('../../../../users');
const { init } = require('../../../../utils/commonActions.js');
const { baseUrl, dataConfig } = require('../../../config');
const { projectCode } = dataConfig.fileDelete;
const {
  selectGreenroomFile,
  fileName,
  folderName,
  uploadFile,
  deleteAction,
  checkFilePanelStatus,
  waitForFileExplorer,
  toggleFilePanel,
} = require('../../../../utils/greenroomActions.js');

describe('3.2 The selected file/folder can be deleted by using delete button', () => {
  let page;
  jest.setTimeout(7000000); //sets timeout for entire test suite
  async function removeExistFile(file) {
    await page.waitForTimeout(5000);
    const search = await page.waitForXPath(
      "//tr//th[position()=3]//span[contains(@class,'search')]",
    );
    await search.click();
    const nameInput = await page.waitForXPath(
      '//div[contains(@class, "ant-dropdown")]//input[@placeholder="Search name"]',
      { visible: true },
    );
    await nameInput.type(file);
    const searchFileBtn = await page.waitForXPath(
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

  it('Upload files to test project', async () => {
    await uploadFile(page, folderName, fileName);
  });

  it('3.2.1 - The file will have "to be deleted" tag after clicking the delete button', async () => {
    await removeExistFile(fileName);
    const deleteTag = page.waitForXPath(
      '//div[contains(@class, "ant-tabs-tabpane-active")]/descendant::div[contains(@class, "ant-table-layout")]/descendant::td[3]/descendant::span[contains(text(), "to be deleted")]',
    );
    expect(deleteTag).toBeTruthy();

    // wait for file to be deleted before proceeding
    await toggleFilePanel(page);
    await checkFilePanelStatus(page, fileName);
  });
});
