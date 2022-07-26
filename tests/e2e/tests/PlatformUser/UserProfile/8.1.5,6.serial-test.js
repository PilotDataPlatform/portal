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
    await login(page, 'disabletest');
    await init(page, { closeBanners: true });
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });
  it('8.1.5 Recent Activities: All projects a.Date b.Action && 8.1.6 Recent activities should demonstrate all the user’s activities on the platform related to project roles', async () => {
    await page.goto(`${baseUrl}user-profile`);

    //8.1.5
    await page.waitForTimeout(2000);
    const date = await page.waitForXPath(
      "//li[contains(@class,'UserProfile_activities-log')]",
    );
    await page.waitForTimeout(2000);

    //date exist
    const projectDate = await page.$x(
      "//li[contains(@class,'UserProfile_activities-log')]/div/div/span",
    );
    expect(projectDate.length).toBeGreaterThan(0);

    //action exist
    const projectAction = await page.$x(
      "//li[contains(@class,'UserProfile_activities-log')]/div/div[contains(@class,'activity-item__action')]",
    );
    expect(projectAction.length).toBeGreaterThan(0);
  });
  it('8.1.6 Recent activities should demonstrate all the user’s activities on the platform related to project roles', async () => {
    const projectRole = await page.$x(
      "//span[contains(@class,'UserProfile_action__action-detail')]",
    );
    expect(projectRole.length).toBeGreaterThan(0);
  });
});
