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
const { disabletest, collaborator } = require('../../../../users');
const { baseUrl, dataConfig } = require('../../../config');
const { projectId, projectCode } = dataConfig.userProfile;
const {
  fileName,
  folderName,
  uploadFile,
} = require('../../../../utils/greenroomActions.js');
jest.setTimeout(700000);

describe('1.6.9', () => {
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
  async function addMember() {
    const add_member = await page.waitForXPath(
      "//button[span[text()='Add Member']]",
    );
    await add_member.click();
    const userInput = await page.waitForXPath("//input[@id='email']");
    await userInput.type(disabletest.email);
    const submitBtn = await page.waitForXPath(
      "//button[span[text()='Submit']]",
    );
    await submitBtn.click();
    await page.waitForTimeout(3000);
  }
  async function findDisabletestUser() {
    const searchUserBtn = await page.waitForXPath("//span[@role='button']");
    await searchUserBtn.click();
    const userInput = await page.waitForXPath(
      "//input[@placeholder='Search name']",
    );
    await userInput.type('disabletest');
    const searchBtn = await page.waitForXPath(
      "//div[@class='ant-table-filter-dropdown']/div/div/div/button[contains(@class,'ant-btn ant-btn-primary')]",
    );
    await searchBtn.click();

    await page.waitForTimeout(3000);
  }
  it('1.6.9 Project administrator should be able to filter/sort in members page, 1.filter by username', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/teams`);

    await findDisabletestUser();

    // await page.waitForXPath("//tr[contains(@class,'ant-table-row')]");
    await page.waitForTimeout(5000);
    //check if disabletest not exist
    const disabletest = await page.$x("//tr[@data-row-key='disabletest']");

    if (disabletest.length === 0) {
      await addMember();
      await findDisabletestUser();
    }

    expect(disabletest.length).toBe(1);
  });
});
