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
const { projectId, projectCode } = dataConfig.userProfile;
jest.setTimeout(700000);

describe('Project List', () => {
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
  it('2.4.3 List all Project tags which within limit (32 char), tag should be displayed properly', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/settings`);
    await page.waitForXPath('//form//label[text()="Project Name"]');
    let editBtn = await page.waitForXPath(
      '//div[contains(@class, "ant-tabs-top-bar")]//button',
    );
    await editBtn.click();

    const dummyText = 'testtagtesttagtesttagtesttagtesttagtesttag';
    await page.click('form .ant-form-item .ant-select-selector', {
      clickCount: 1,
    });
    await page.keyboard.press('Backspace');
    await page.type(
      'form .ant-form-item .ant-select-selector',
      dummyText.slice(0, 32),
    );
    let saveBtn = await page.waitForXPath(
      '//div[contains(@class, "ant-tabs-top-bar")]//button//span[text()="Save"]',
    );
    await saveBtn.click();
    await page.waitForTimeout(3000);

    const tag = await page.waitForXPath(
      `//form//span[@class='ant-tag'and text()='${dummyText.slice(0, 32)}']`,
    );

    expect(tag).not.toBe(null);
  });
  it('2.4.4 List Project description which within limit of 250 char, description should be displayed properly ', async () => {
    let editBtn = await page.waitForXPath(
      '//div[contains(@class, "ant-tabs-top-bar")]//button',
    );
    await editBtn.click();
    await page.click('.ant-form-item-control-input-content textarea', {
      clickCount: 3,
    });
    await page.keyboard.press('Backspace');
    await page.type(
      '.ant-form-item-control-input-content textarea',
      '  \n\n  ',
    );
    let saveBtn = await page.waitForXPath(
      '//div[contains(@class, "ant-tabs-top-bar")]//button//span[text()="Save"]',
    );
    await saveBtn.click();
    await page.waitForTimeout(2000);

    editBtn = await page.waitForXPath(
      '//div[contains(@class, "ant-tabs-top-bar")]//button',
    );
    await editBtn.click();
    let noteInputVal = await page.evaluate(
      () =>
        document.querySelector('.ant-form-item-control-input-content textarea')
          .value,
    );
    expect(noteInputVal).toBe('');
    const dummyText =
      'testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest';
    await page.type('.ant-form-item-control-input-content textarea', dummyText);

    noteInputVal = await page.evaluate(
      () =>
        document.querySelector('.ant-form-item-control-input-content textarea')
          .value,
    );
    expect(noteInputVal).toBe(dummyText.slice(0, 250));
    saveBtn = await page.waitForXPath(
      '//div[contains(@class, "ant-tabs-top-bar")]//button//span[text()="Save"]',
    );
    await saveBtn.click();
    await page.waitForTimeout(3000);

    const describe = await page.waitForXPath(
      `//form//p[text()='${dummyText.slice(0, 250)}']`,
    );

    expect(describe).not.toBe(null);
  });
});
