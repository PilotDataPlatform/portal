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
const { login } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { baseUrl, dataConfig } = require('../../../config');
const { adminProjectCode } = dataConfig.fileCopy;

describe('9.2 File Copy', () => {
  let page;
  jest.setTimeout(700000); //sets timeout for entire test suite

  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await login(page, 'admin');
    await page.goto(`${baseUrl}project/${adminProjectCode}/data`);
    await init(page);
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });

  it('9.2.1 - cannot copy without selecting at least one file', async () => {
    await page.waitForXPath(
      '//div[contains(@class, "FileExplorer_file_explore_actions")]',
    );

    await page.click('span[aria-label="copy"]');
    const confirmCopy = await page.waitForXPath(
      '//button/span[contains(text(), "Copy to Core")]/parent::button',
    );
    await confirmCopy.click();
    const errorPopup = await page.waitForXPath(
      '//div[contains(@class, "ant-message-notice-content")]/descendant::span[contains(text(), "Please select files to copy")]',
    );

    expect(errorPopup).toBeTruthy();
  });
});
