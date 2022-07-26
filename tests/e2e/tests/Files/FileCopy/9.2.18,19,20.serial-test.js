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
const { admin } = require('../../../../users');
const { baseUrl, dataConfig } = require('../../../config');
const {
  fileName,
  folderName,
  coreFolderName,
  selectGreenroomFile,
  findUserFolderDestination,
  coreSubFolderName,
  navigateToCore,
  cleanupGreenroom,
  waitForFileExplorer,
  cleanupCore,
} = require('../../../../utils/greenroomActions.js');
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
    await init(page);
  });

  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });

  beforeEach(async () => {
    await page.setCacheEnabled(false);
    await page.goto(`${baseUrl}project/${adminProjectCode}/data`);
  });

  it('9.2.18 - User should select destination when copying files/folder otherwise an error message should display', async () => {
    await selectGreenroomFile(page, fileName);

    await page.click('span[aria-label="copy"]');
    const confirmCopy = await page.waitForXPath(
      '//button/span[contains(text(), "Copy to Core")]/parent::button',
    );
    await confirmCopy.click();

    const xCode = await page.waitForXPath(
      '//div[contains(@class, "ant-modal-body")]/descendant::b',
    );
    const verificationCode = await page.evaluate(
      (xCode) => xCode.textContent,
      xCode,
    );
    await page.type('input[placeholder="Enter Code"]', verificationCode);

    const confirmFolder = await page.waitForXPath(
      '//span[contains(text(), "Confirm")]/parent::button',
    );
    await confirmFolder.click();

    const errorMessage = await page.waitForXPath(
      '//div[contains(@class, "ant-modal-content")]/descendant::span[contains(text(), "*Select Destination") and contains(@style, "font-style: italic")]',
    );

    expect(errorMessage).toBeTruthy();
  });

  it('9.2.19 - In destination drop down menu, user could choose Core Home and all folder displayed in the Core Home', async () => {
    await selectGreenroomFile(page, fileName);

    await page.click('span[aria-label="copy"]');
    const confirmCopy = await page.waitForXPath(
      '//button/span[contains(text(), "Copy to Core")]/parent::button',
    );
    await confirmCopy.click();

    await findUserFolderDestination(page, admin.username);
    const coreFolder = await page.waitForXPath(
      `//span[contains(@title, '${coreFolderName}')]`,
      { timeout: 5000 },
    );
    expect(coreFolder).toBeTruthy();
  });

  it('9.2.20 - When selecting destination, if user selected folder contains sub folder, folder should expand to display sub folders for user to choose', async () => {
    await selectGreenroomFile(page, fileName);

    await page.click('span[aria-label="copy"]');
    const confirmCopy = await page.waitForXPath(
      '//button/span[contains(text(), "Copy to Core")]/parent::button',
    );
    await confirmCopy.click();

    await findUserFolderDestination(page, admin.username);
    const coreFolder = await page.waitForXPath(
      `//span[contains(@title, '${coreFolderName}')]`,
      { timeout: 5000 },
    );
    await coreFolder.click();

    const coreSubFolder = await page.waitForXPath(
      `//span[contains(@title, '${coreSubFolderName}')]`,
      { timeout: 5000 },
    );

    expect(coreSubFolder).toBeTruthy();
  });

  it('Delete test files from test project', async () => {
    await cleanupGreenroom(page);
    await navigateToCore(page);
    await waitForFileExplorer(page, admin.username);
    await cleanupCore(page);
  });
});
