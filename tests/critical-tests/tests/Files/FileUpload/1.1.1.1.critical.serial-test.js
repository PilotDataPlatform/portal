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
const {
  toggleFilePanel,
  checkFilePanelStatus,
  selectFileProperties,
  folderName,
  fileName,
  uploadAction,
  waitForFileExplorer,
  selectGreenroomFile,
  deleteAction,
  deleteFileFromGreenroom,
} = require('../../../../utils/greenroomActions.js');

describe('1.1.1 Files upload with tags', () => {
  let page;
  // const projectId = 96722;
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
    const search = await page.waitForXPath("//span[contains(@class,'search')]");
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

  it('1.1.1.1 - File should be able to upload with a tag', async () => {
    const tagName = 'test';

    // await waitForFileExplorer(page, admin.username);
    await page.waitForTimeout(5000);
    await removeExistFile(fileName);

    await uploadAction(page);
    const uploadInputField = await page.waitForSelector('#form_in_modal_file');
    await uploadInputField.uploadFile(
      `${process.cwd()}/tests/uploads/${folderName}/${fileName}`,
    );
    const tagInput = await page.waitForXPath(
      '//div[contains(@class, "ant-modal-body")]/form/descendant::input[@id="form_in_modal_tags"]',
    );
    await tagInput.type(tagName);

    await page.click('#file_upload_submit_btn');

    await toggleFilePanel(page);
    await checkFilePanelStatus(page, fileName);

    const uploadedFile = await page.waitForXPath(
      `//tr[contains(@class, 'ant-table-row')]/descendant::span[contains(text(), '${fileName}')]`,
    );
    expect(uploadedFile).toBeTruthy();

    await selectFileProperties(page, fileName);
    const tag = await page.waitForXPath(
      `//div[contains(@class, 'FileExplorer_customized_tags')]/following-sibling::div/span[contains(text(), "${tagName}")]`,
    );
    expect(tag).toBeTruthy();
  });

  it('Cleanup greenroom', async () => {
    await deleteFileFromGreenroom(page, fileName);
  });
});
