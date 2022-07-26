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
  uploadFile,
  waitForFileExplorer,
  selectFileProperties,
  fileName,
  folderName,
  deleteFileFromGreenroom,
} = require('../../../../utils/greenroomActions.js');

describe('4.6 File tag could be added / removed in file details panel', () => {
  let page;
  // const projectId = 96722;
  const projectCode = dataConfig.fileExplorer.projectCode;
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

  it('Upload files to test project', async () => {
    await uploadFile(page, folderName, fileName);
  });

  it('4.6.1 - Add tag in file details', async () => {
    const tagName = 'test';

    await waitForFileExplorer(page, admin.username);
    await selectFileProperties(page, fileName);

    await page.click('span.site-tag-plus');
    const tagInput = await page.waitForXPath(
      '//span[contains(@class, "ant-descriptions-item-content")]/descendant::input',
    );
    await tagInput.type(tagName);
    await page.keyboard.press('Enter');
    const saveTag = await page.waitForXPath(
      '//div[contains(@class, "FileExplorer_customized_tags")]/descendant::button',
    );
    await saveTag.click();

    const newTag = await page.waitForXPath(
      `//div[contains(@class, 'FileExplorer_customized_tags')]/following-sibling::div/span[contains(text(), "${tagName}")]`,
    );
    expect(newTag).toBeTruthy();
  });

  it('Cleanup greenroom', async () => {
    await deleteFileFromGreenroom(page, fileName);
  });
});
