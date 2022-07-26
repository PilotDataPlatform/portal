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
const { collaborator } =require('../../../../users');
const { baseUrl, dataConfig } = require('../../../config');
jest.setTimeout(700000);

describe('User profile', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await login(page, 'admin');
    await init(page, { closeBanners: true });
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });
  it('8.1.3 User Information should contain following fields:Username,First Name,Last Name,Email,Invited by,Join Date,Last login,Button to reset password', async () => {
    await page.goto(`${baseUrl}user-profile`);
    await page.waitForXPath(
      '//ul[contains(@class, "UserProfile_member__content")]//span[text()="Username"]//following-sibling::span',
    );
    await page.waitForTimeout(5000);
    var fieldFill = await page.$x(
      "//li[contains(@class,'UserProfile')]/div/div[@class='ant-col']/span[text()!='Username' and text()!='First Name' and text() != 'Last Name' and text() != 'Email' and text() != 'Join Date' and text() != 'Last Login']",
    );
    expect(fieldFill.length).toBe(6);

    var resetPwdBtn = await page.waitForXPath(
      "//span[text()='Reset Password']",
    );
    expect(resetPwdBtn).not.toBe(null);
  });
});
