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
const {
  navigateInsideFolder,
  uploadFile,
  cleanupGreenroom,
} = require('../../../../utils/greenroomActions.js');
const { createFolder } = require('../../../../utils/fileScaffoldActions');
const { createDummyFile } = require('../../../../utils/createDummyFile');
const fs = require('fs');
const { projectCode } = dataConfig.fileUpload;

describe('1.5 Upload file/folder to existing folder', () => {
  let page;
  let folderName;
  jest.setTimeout(700000000);

  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await login(page, 'admin');
    await init(page);
  });

  beforeEach(async () => {
    await page.setCacheEnabled(false);
    await page.goto(`${baseUrl}project/${projectCode}/data`);
  });

  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });

  it('1.5 - Upload file 1G to existing folder', async () => {
    folderName = await createFolder(page);
    await navigateInsideFolder(page, folderName);
    const fileName = '1gb-test';
    if (!fs.existsSync(`${process.cwd()}/tests/uploads/temp/${fileName}`)) {
      await createDummyFile('temp', fileName, '1gb');
    }
    await uploadFile(page, 'temp', fileName);
  });

  it('Delete test files from test project', async () => {
    await cleanupGreenroom(page);
  });
});
