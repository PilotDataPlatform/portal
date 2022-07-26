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
const { baseUrl } = require('../config');
const pti = require('puppeteer-to-istanbul');
const fs = require('fs');

jest.setTimeout(30000);
/*
this test runs as a project admin test
Create a project admin account first
then change the login function username, and password
*/

describe('Admin Canvas', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();

    await page.coverage.startJSCoverage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
  });

  afterAll(async () => {
    const jsCoverage = await page.coverage.stopJSCoverage();
    pti.write(jsCoverage);
  });

  it('see login button', async () => {
    await page.goto(`${baseUrl}login`);
    await page.waitForTimeout(4000);
  });
  it('see account assitant', async () => {
    await page.goto(`${baseUrl}account-assistant`);
    const backBtn = await page.waitForXPath('//button[@type="submit"]');
    await backBtn.click();
    await page.waitForTimeout(4000);
  });
});
