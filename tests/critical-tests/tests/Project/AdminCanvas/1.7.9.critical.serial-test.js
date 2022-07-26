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
const { collaborator, disabletest } = require('../../../../users');
const { baseUrl, dataConfig } = require('../../../../e2e/config');
const { projectId } = dataConfig.userProfile;

jest.setTimeout(700000);

describe('Project List', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await login(page, 'admin');
    await init(page, { closeBanners: true });
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
  async function CheckProjectExist() {
    const searchIcon = await page.waitForXPath(
      '//button//span[contains(@class, "anticon-search")]',
    );
    await searchIcon.click();
    const projectCodeInput = await page.waitForXPath(
      '//p[text()="Project Name"]//following-sibling::div//input',
    );
    await projectCodeInput.type('Test0411');
    const searchBtn = await page.waitForXPath(
      '//div[contains(@class,"LandingPageContent_secondInputLine" )]//button[@type="submit"]',
    );
    await searchBtn.click();
    await page.waitForTimeout(1000);
    const projectList = await page.$x('//*[@class="ant-list-items"]');
    expect(projectList.length).toBe(0);
  }
  it('1.7.9 After change project visibility “Discoverable by all platform user”, then only project member should be able to see this project', async () => {
    await page.goto(`${baseUrl}project/${projectId}/settings`);
    await page.waitForXPath('//form//label[text()="Project Name"]');
    let editBtn = await page.waitForXPath(
      '//div[contains(@class, "ant-tabs-top-bar")]//button',
    );
    await editBtn.click();

    const visibleSwitch = await page.waitForXPath(
      "//button[@aria-checked='true' and @role='switch']",
    );
    await visibleSwitch.click();

    let saveBtn = await page.waitForXPath(
      '//div[contains(@class, "ant-tabs-top-bar")]//button//span[text()="Save"]',
    );
    await saveBtn.click();
    await page.waitForTimeout(3000);

    //remove disabletest from project
    await page.goto(`${baseUrl}project/${projectId}/teams`);

    await page.waitForXPath("//tr[contains(@class,'ant-table-row')]");
    //check if disabletest exist or not
    const disabletest = await page.$x("//tr[@data-row-key='disabletest']");

    //if exist, remove first
    if (disabletest.length != 0) {
      let disabletestBtn = await page.waitForXPath(
        "//tr[@data-row-key='disabletest']/td/button",
      );
      await disabletestBtn.click();
      const removeBtn = await page.waitForXPath(
        "//li[contains(@class,'ant-dropdown-menu-item') and text()='Delete']",
      );
      await removeBtn.click();
      let okBtn = await page.waitForXPath(
        "//div[@class='ant-modal-confirm-btns']/button[span[text()='OK']]",
      );
      await okBtn.click();
    }

    await page.waitForTimeout(3000);

    //login disable to check if project can be displayed

    await logout(page);
    await page.waitForTimeout(6000);

    await login(page, 'disabletest');
    await init(page, { closeBanners: true });

    await page.goto(`${baseUrl}landing`);

    await CheckProjectExist();
    await page.waitForTimeout(6000);

    // add back agein
    await logout(page);
    await page.waitForTimeout(6000);

    await login(page, 'admin');
    await page.goto(`${baseUrl}project/${projectId}/teams`);

    await page.waitForXPath("//tr[contains(@class,'ant-table-row')]");
    //check if disabletest exist or not
    const user = await page.$x("//tr[@data-row-key='disabletest']");

    if (user.length === 0) {
      await addMember();
    }

    await page.waitForTimeout(3000);

    //open visible again
    await page.goto(`${baseUrl}project/${projectId}/settings`);
    await page.waitForXPath('//form//label[text()="Project Name"]');

    let edit = await page.waitForXPath(
      '//div[contains(@class, "ant-tabs-top-bar")]//button',
    );
    await edit.click();

    const invisibleSwitch = await page.waitForXPath(
      "//button[@aria-checked='false' and @role='switch']",
    );
    await invisibleSwitch.click();

    let save = await page.waitForXPath(
      '//div[contains(@class, "ant-tabs-top-bar")]//button//span[text()="Save"]',
    );
    await save.click();
  });
});
