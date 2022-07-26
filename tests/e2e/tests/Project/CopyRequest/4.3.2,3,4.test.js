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
jest.setTimeout(700000);

const projectCode = dataConfig.copyReq.projectCode;

describe('CopyRequest', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1280 });
    await login(page, 'collaborator');
    await init(page, { closeBanners: false });
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });
  async function findReqWithOneLeftFile() {
    for (let i = 1; i <= 10; i++) {
      const req = await page.waitForXPath(
        `//ul//li[contains(@class, "NewRequestsList_list_item") and position()=${i}]`,
      );
      await req.click();
      await page.waitForTimeout(3000);
      const isFile = await page.$x(
        '//div[contains(@class, "RequestToCore_request_content")]//tbody[contains(@class,"ant-table-tbody")]//tr[position()=1]//span[contains(@class,"anticon-file")]',
      );
      const fileList = await page.$x(
        '//div[contains(@class, "RequestToCore_request_content")]//tbody[contains(@class,"ant-table-tbody")]//tr',
      );
      const checkBox = await page.$x(
        '//div[contains(@class, "RequestToCore_request_content")]//tbody[contains(@class,"ant-table-tbody")]//tr[position()=1]//span[@class="ant-checkbox"]',
      );
      if (checkBox.length && fileList.length == 1 && isFile.length == 1) {
        return;
      }
    }
  }
  it('4.3.2 File/folders in the request can be reviewed of streaming metadata (tags, attributes, lineage)', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/requestToCore`);
    await findReqWithOneLeftFile();
    const actionButton = await page.waitForXPath(
      '//button[contains(@class, "ant-dropdown-trigger")]',
    );
    await actionButton.click();
    const propertiesBtn = await page.waitForXPath(
      '//li[contains(@class, "ant-dropdown-menu-item") and text()="Properties"]',
    );
    await propertiesBtn.click();
    await page.waitForTimeout(10000);
    const tags = await page.waitForXPath(
      '//span[contains(@class,"ant-tag-blue")]',
    );
    expect(tags).toBeTruthy();
    const fileAttrs = await page.waitForXPath(
      '//div[@class="ant-collapse-header" and contains(text(), "File Attributes")]',
    );
    await fileAttrs.click();
    await page.waitForXPath(
      '//div[@class="ant-collapse-header" and contains(text(), "File Attributes")]//following-sibling::div[1]//td[@class="ant-descriptions-item"]',
    );
    await page.waitForTimeout(2000);

    const lineageGraph = await page.waitForXPath(
      '//span[contains(text(), "Data Lineage Graph")]',
    );
    await lineageGraph.click();
    const dataBefore = await page.evaluate(() => {
      return document.querySelector('canvas').toDataURL();
    });
    await page.waitForResponse(
      (response) =>
        response.url().includes('/v1/lineage') && response.status() === 200,
    );
    await page.waitForTimeout(2000);
    const data = await page.evaluate(() => {
      return document.querySelector('canvas').toDataURL();
    });
    expect(data).not.toBe(dataBefore);
  });
  it('4.3.4 File/folders in the request can be zip previewed if it is a zip. ', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/requestToCore`);
    await findReqWithOneLeftFile();
    const actionButton = await page.waitForXPath(
      '//button[contains(@class, "ant-dropdown-trigger")]',
    );
    await actionButton.click();
    const previewBtn = await page.waitForXPath(
      '//li[contains(@class, "ant-dropdown-menu-item") and text()="Preview"]',
    );
    await previewBtn.click();
    await page.waitForXPath(
      '//div[@class="ant-modal-title"]//div[contains(span, "Zip File Previewer")]',
    );
  });
});
