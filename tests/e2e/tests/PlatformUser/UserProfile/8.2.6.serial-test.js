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

describe('User profile', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1300, height: 600 });
    await login(page, 'admin');
    await init(page, { closeBanners: true });
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });

  it('8.2.6 Recent activities should demonstrate all the user’s activities on the platform related to project roles ', async () => {
    await page.goto(`${baseUrl}users`);
    const searchUserBtn = await page.waitForXPath("//span[@role='button']");
    await searchUserBtn.click();
    const userInput = await page.waitForXPath(
      "//input[@placeholder='Search name']",
    );
    await userInput.type('disabletest');
    const searchBtn = await page.waitForXPath(
      "//div[@class='ant-table-filter-dropdown']/div/div/div/button[contains(@class,'ant-btn ant-btn-primary')]",
    );
    await searchBtn.click();

    await page.waitForTimeout(6000);

    const btn = await page.waitForXPath(
      "//tr[contains(@class,'ant-table-row') and @data-row-key='disabletest']/td/div[@class='ant-dropdown-trigger']/button",
    );
    await btn.click();
    const profileBtn = await page.waitForXPath(
      "//li[contains(@class,'ant-dropdown-menu-item') and text()='Profile']",
    );
    await profileBtn.click();

    var lastPage = await page.$x(
      "//div[contains(@class,'UserProfile_activities__activity-log')]/div[contains(@class,'ant-list')]/div[@class='ant-list-pagination']/ul/li[@title='Next Page' and @aria-disabled='true']",
    );
    while (lastPage.length === 0) {
      var nextPage = await page.waitForXPath(
        "//div[contains(@class,'UserProfile_activities__activity-log')]/div[contains(@class,'ant-list')]/div[@class='ant-list-pagination']/ul/li[@title='Next Page'  and @aria-disabled='false']",
      );

      await nextPage.click();
      await page.waitForTimeout(3000);
      lastPage = await page.$x(
        "//div[contains(@class,'UserProfile_activities__activity-log')]/div[contains(@class,'ant-list')]/div[@class='ant-list-pagination']/ul/li[@title='Next Page' and @aria-disabled='true']",
      );
    }

    const roleLog = await page.$x(
      "//span[@class='UserProfile_action__action-detail__2zcqW']/em[contains(text(),'by')]",
    );

    expect(roleLog.length).toBeGreaterThan(0);
  });
});
