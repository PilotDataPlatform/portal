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

describe('Administrator console should list all users', () => {
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
  it('3.2.9 Platform administrator will be highlighted', async () => {
    await page.goto(`${baseUrl}users`);
    const checkBox = await page.waitForXPath(
      '//span[contains(text(),"Platform Administrator Only")]/ancestor::label//span[contains(@class, "ant-checkbox")]',
    );
    await checkBox.click();
    await page.waitForTimeout(3000);
    const adminRowStars = await page.$x(
      '//table//tbody//tr[contains(@class, "ant-table-row")]//td//span[contains(@class, "anticon-crown")]',
    );
    expect(adminRowStars.length).toBeGreaterThan(0);
  });
});
