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
const { init } = require('../../../../utils/commonActions.js');
const { collaborator } = require('../../../../users');
const { baseUrl, dataConfig } = require('../../../config');
const { projectId, projectCode } = dataConfig.userProfile;
const {
  fileName,
  folderName,
  uploadFile,
} = require('../../../../utils/greenroomActions.js');
jest.setTimeout(700000);

describe('1.4.7', () => {
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

  it('The search result in ‘Advanced search’ should be displayed properly', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/canvas`);
    // const fileKebabBtn = await page.waitForXPath(
    //   '//span[text()="' +
    //     fileName +
    //     '"]//ancestor::td//following-sibling::td[@class="ant-table-cell"]//button[contains(@class, "ant-dropdown-trigger")]',
    // );
    // await fileKebabBtn.click();
    // const downloadBtn = await page.waitForXPath(
    //   '//li[contains(@class, "ant-dropdown-menu-item") and text()="Download"]',
    // );
    // await downloadBtn.click();
    // await page.waitForTimeout(10000);

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
