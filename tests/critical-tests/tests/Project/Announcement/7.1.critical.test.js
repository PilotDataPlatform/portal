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
const { baseUrl, dataConfig } = require('../../../config');
const { projectCode } = dataConfig.adminCanvas;
jest.setTimeout(700000);

describe('7.1', () => {
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
  it('7.1 Only project administrator/ platform administrator could publish announcement', async () => {
    // admin
    await page.goto(`${baseUrl}project/${projectCode}/announcement`);
    const announcementContent = await page.waitForXPath(
      '//div[text()="Create new announcement"]',
    );
    expect(announcementContent).not.toBe(null);
    await logout(page);
    await page.waitForTimeout(3000);

    // collaborator
    await login(page, 'collaborator');
    await page.goto(`${baseUrl}project/${projectCode}/announcement`);
    await page.waitForTimeout(3000);
    const announcementCollaboratorContent = await page.$x(
      '//div[text()="Create new announcement"]',
    );
    expect(announcementCollaboratorContent.length).toBe(0);
    await logout(page);
    await page.waitForTimeout(3000);

    // contributor
    await login(page, 'contributor');
    await page.goto(`${baseUrl}project/${projectCode}/announcement`);
    await page.waitForTimeout(3000);
    const announcementContributorContent = await page.$x(
      '//div[text()="Create new announcement"]',
    );
    expect(announcementContributorContent.length).toBe(0);
  });
});
