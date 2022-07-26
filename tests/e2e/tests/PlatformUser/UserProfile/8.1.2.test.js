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
  it('8.1.2 Member profile should have 3 main sections: Member Information, Project Membership and Recent Activities ', async () => {
    await page.goto(`${baseUrl}user-profile`);

    //Member Information
    const memberInfo = await page.waitForXPath(
      "//div[@class='ant-card-head-title' and text()='Member Profile']",
    );
    expect(memberInfo).not.toBe(null);

    //Project Membership
    const projectMembership = await page.waitForXPath(
      "//div[@class='ant-card-head-title' and text()='Project Membership']",
    );
    expect(projectMembership).not.toBe(null);

    //Recent Activities
    const recentActivities = await page.waitForXPath(
      "//div[@class='ant-card-head-title' and text()='Recent Activities']",
    );
    expect(recentActivities).not.toBe(null);
  });
});
