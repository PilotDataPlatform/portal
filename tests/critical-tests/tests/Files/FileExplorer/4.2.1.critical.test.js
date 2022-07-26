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
  waitForFileExplorer,
} = require('../../../../utils/greenroomActions.js');

describe('4.2 File explorer should display properly', () => {
  let page;
  // const projectCode = dataConfig.fileExplorer.projectCode;
  const projectCode = 'dluufeautotest';
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

  it('4.2.1 - Folder path should always exist for Core and Greenrom even without any files', async () => {
    await waitForFileExplorer(page, admin.username);
    // check there are no files
    const breadcrumbGreenroom = page.waitForXPath(
      '//div[contains(@class, "FileExplorer_file_folder_path")]/span/span[contains(text(), "Green Room")]',
    );
    const breadcrumbUsername = page.waitForXPath(
      `//div[contains(@class, "FileExplorer_file_folder_path")]/span/span[contains(text(), "${admin.username}")]`,
    );

    const resolvedItems = await Promise.all([
      breadcrumbGreenroom,
      breadcrumbUsername,
    ]);

    for (let item of resolvedItems) {
      expect(item).toBeTruthy();
    }
  });
});
