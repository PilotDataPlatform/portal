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
const { baseUrl } = require('../../../config');
jest.setTimeout(700000);

describe('Platform administrator could see user profile', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await login(page, 'admin');
    await init(page, {
      closeBanners: false,
    });
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });

  it('3.11.1 User details contain information including User Name, Role, Email, First Name, Last Name, Join Date, Last Login Time and Status', async () => {
    await page.goto(`${baseUrl}users`);
    await page.waitForXPath("//tr[contains(@class,'ant-table-row')]");
    const btn = await page.waitForXPath(
      "//tr[contains(@class,'ant-table-row')]/td/div[@class='ant-dropdown-trigger']/button",
    );
    await btn.click();
    const profileBtn = await page.waitForXPath(
      "//li[contains(@class,'ant-dropdown-menu-item') and text()='Profile']",
    );
    await profileBtn.click();
    await page.waitForXPath(
      '//ul[contains(@class, "UserProfile_member__content")]//span[text()="Username"]//following-sibling::span',
    );
    await page.waitForTimeout(1000);

    let fields = [
      'Username',
      'First Name',
      'Last Name',
      'Join Date',
      'Email',
      'Last Login',
    ];
    let field;
    fields.forEach(async (e) => {
      field = await page.waitForXPath(
        `//ul[contains(@class, 'UserProfile_member__content')]//span[text()='${e}']//following-sibling::span`,
      );
      expect(field).not.toBe(null);
      await page.waitForTimeout(1000);
    });

    const accountStatus = await page.waitForXPath(
      "//div[@class='ant-card-extra']/span[contains(@class,'UserProfile_member__account-status--active') and text()='Account Status: ']/span",
    );
    expect(accountStatus).not.toBe(null);
  });
});
