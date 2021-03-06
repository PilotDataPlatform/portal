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

const projectCode = dataConfig.copyReq.projectCode;
const contributorProjectCode = dataConfig.copyReq.contributorProjectCode;

describe('CopyRequest', () => {
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
  it('4.4.1 Project admin should be able to see all past requests and new requests', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/requestToCore`);
    //61390
    await page.waitForSelector(`#layout-wrapper ul.ant-list-items`);
    const requestsNames = await page.$$eval(
      `#layout-wrapper ul.ant-list-items>li`,
      (elements) => {
        console.log(elements.length, 'element.length');
        return elements.map((element) => element.textContent);
      },
    );
    const usernames = requestsNames.map((requestName) => {
      const arr = requestName.split(' /');
      return arr[0];
    });
    const usernamesSet = new Set(usernames);
    if (usernamesSet.has('admin')) usernamesSet.delete('admin');
    expect(usernamesSet.size).toBeGreaterThan(0);
    await logout(page);
    await page.waitForTimeout(3000);
  });
  it('4.4.2 Project collaborator could ONLY see their own new request and past requests,  not others', async () => {
    await login(page, 'collaborator');
    await init(page, { closeBanners: false });
    await page.goto(`${baseUrl}project/${projectCode}/requestToCore`);
    await page.waitForSelector(`#layout-wrapper ul.ant-list-items`);
    const requestsNames = await page.$$eval(
      `#layout-wrapper ul.ant-list-items>li`,
      (elements) => {
        console.log(elements.length, 'element.length');
        return elements.map((element) => element.textContent);
      },
    );
    const usernames = requestsNames.map((requestName) => {
      const arr = requestName.split(' /');
      return arr[0];
    });
    const usernamesSet = new Set(usernames);
    if (usernamesSet.has(collaborator.username))
      usernamesSet.delete(collaborator.username);
    expect(usernamesSet.size).toEqual(0);
    await logout(page);
    await page.waitForTimeout(3000);
  });
  it('4.4.3 When project contributor tried to access requestToCore page by changed url, they should be redirect to 403 page', async () => {
    await login(page, 'contributor');
    await init(page, { closeBanners: false });
    await page.goto(
      `${baseUrl}project/${contributorProjectCode}/requestToCore`,
    );
    await page.waitForTimeout(3000);
    /* await page.waitForNavigation() */
    const url = await page.url();
    const urlArr = url.split('/');
    expect(urlArr[urlArr.length - 1]).toEqual('403');
  });
});
