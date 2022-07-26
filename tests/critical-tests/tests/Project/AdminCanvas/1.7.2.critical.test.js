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
const { clearInput, clearSelector } = require('../../../../utils/inputBox.js');
const { init } = require('../../../../utils/commonActions.js');
const { baseUrl, dataConfig } = require('../../../config');
const { projectCode } = dataConfig.adminCanvas;
jest.setTimeout(700000);

describe('Project administrator should be able to edit project information', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1520, height: 1080 });
    await login(page, 'admin');
    await init(page, { closeBanners: false });
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });
  it('1.7.2. Project admin should be able to edit project name. If user changed project name then user can see the change immediately in the project page and teams page', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/settings`);
    await page.waitForXPath('//form//label[text()="Project Name"]');
    const editBtn = await page.waitForXPath(
      '//div[contains(@class, "ant-tabs-top-bar")]//button',
    );
    await editBtn.click();
    const nameInput = await page.waitForXPath(
      '//form[contains(@class, "Settings_custom_general_info_form")]//div[contains(@class, "ant-form-item") and position()=1]//input',
    );
    const previousName = await page.evaluate((nameInput) => {
      return nameInput.value;
    }, nameInput);
    await clearInput(
      page,
      'form > div > .ant-row .ant-form-item-control-input-content input',
    );
    let nextName = 'Frontend Automation - ' + parseInt(Math.random() * 1000);
    while (nextName === previousName) {
      nextName = 'Frontend Automation - ' + parseInt(Math.random() * 1000);
    }
    await nameInput.type(nextName);
    const saveBtn = await page.waitForXPath(
      '//div[contains(@class, "ant-tabs-top-bar")]//button//span[text()="Save"]',
    );
    await saveBtn.click();
    await page.waitForTimeout(3000);
    const changedName = await page.waitForXPath(
      '//span[@class="ant-page-header-heading-title"]//div//div//span',
    );
    const changedNameTxt = await page.evaluate(
      (node) => node.textContent,
      changedName,
    );
    expect(changedNameTxt).toBe(nextName);
  });
});
