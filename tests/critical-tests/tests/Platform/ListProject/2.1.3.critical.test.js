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
jest.setTimeout(700000);

describe('Project List', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await login(page, 'collaborator');
    await init(page, { closeBanners: false });
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });
  it('2.1.3 Click All Projects. ', async () => {
    await page.goto(`${baseUrl}landing`);
    const allProjectsIcon = await page.waitForXPath(
      '//*[@id="tab-All Projects"]',
    );
    await allProjectsIcon.click();

    const paginationItem = await page.$x(
      '//ul/li[contains(@class, "ant-pagination-item")]',
    );
    expect(paginationItem.length).toBeGreaterThan(0);

    //check project item length
    const porjects = await page.$x(
      "//div[contains(@class,'ant-tabs-tabpane-active')]/div/div[@id='uploadercontent_project_list']/div[@class='ant-spin-nested-loading']/div[@class='ant-spin-container']/ul[@class = 'ant-list-items']/*",
    );
    console.log(porjects.length);
    expect(porjects.length).toBeGreaterThan(0);
  });
});
