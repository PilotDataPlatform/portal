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
const {
  selectGreenroomFile,
} = require('../../../../utils/greenroomActions.js');
const { baseUrl, dataConfig } = require('../../../config');
const fs = require('fs');

const { adminProjectCode } = dataConfig.fileCopy;

describe('9.2 File Copy', () => {
  let page;
  const fileName = 'tinified.zip';
  jest.setTimeout(700000); //sets timeout for entire test suite

  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setCacheEnabled(false);
    await login(page, 'admin');
    await page.goto(`${baseUrl}project/${adminProjectCode}/data`);
    await init(page);
  });

  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });

  it('9.2.7 - User should be able to download file from VRE Core', async () => {
    await page._client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: './tests/downloads',
    });
    await selectGreenroomFile(page, fileName);
    const downloadButton = await page.waitForXPath(
      '//div[contains(@class, "FileExplorer_file_explore_actions")]/descendant::span[contains(text(), "Download")]/parent::button',
    );
    await downloadButton.click();
    await page.waitForTimeout(10000);

    fs.readFileSync(`./tests/downloads/${fileName}`);
    fs.unlinkSync(`./tests/downloads/${fileName}`);
  });
});
