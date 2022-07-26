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
const { collaborator } = require('../../../../users');
const { baseUrl, dataConfig } = require('../../../config');
jest.setTimeout(700000);

const projectCode = dataConfig.adminCanvas.projectCode;

describe('Project administrator should be able to invite user', () => {
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
  it('members button on the sidebar', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/teams`);
    const icon = await page.waitForXPath(
      `//ul[@id="side-bar"]/li//span[contains(text(), "Members")]`,
    );
    expect(icon).toBeTruthy();
  });
  //#layout-wrapper > main > div.ant-row > div > div > div > button

  it(`add user modal can only be close by clicking on close icon or cancel button`, async () => {
    const button = await page.waitForSelector(
      `#layout-wrapper > main > div.ant-row > div > div > div > button`,
    );
    await button.click();
    const otherElement = await page.waitForSelector(
      `#layout-wrapper > main > div:nth-child(1) > div > main > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div > div > div > span > div > div:nth-child(1) > span`,
    );
    await otherElement.click();
    const modalTitle = await page.waitForSelector(`#rcDialogTitle0`);
    expect(modalTitle).not.toBeNull();
    const cancel = await page.waitForSelector(`#add-member-cancel-button`);
    await cancel.click();
    const isModalHidden = await page.$eval(
      '.ant-modal-root > div.ant-modal-wrap',
      (elem) => {
        return elem.style.display === 'none';
      },
    );
    expect(isModalHidden).toBeTruthy();
  });
});
