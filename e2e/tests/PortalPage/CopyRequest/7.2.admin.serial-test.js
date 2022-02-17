const { login, logout } = require('../../../utils/login.js');
const { baseUrl } = require('../../../config');
const moment = require('moment-timezone');
jest.setTimeout(700000);

const projectId = 60023;

describe('CopyRequest', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await login(page, 'admin');
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });
  async function findReqWithOneLeftItem() {
    for (let i = 1; i <= 10; i++) {
      const req = await page.waitForXPath(
        `//ul//li[contains(@class, "NewRequestsList_list_item") and position()=${i}]`,
      );
      await req.click();
      await page.waitForTimeout(3000);
      const fileList = await page.$x(
        '//div[contains(@class, "RequestToCore_request_content")]//tbody[contains(@class,"ant-table-tbody")]//tr',
      );
      const checkBox = await page.$x(
        '//div[contains(@class, "RequestToCore_request_content")]//tbody[contains(@class,"ant-table-tbody")]//tr[position()=1]//span[@class="ant-checkbox"]',
      );
      if (checkBox.length && fileList.length == 1) {
        return;
      }
    }
  }
  async function openApporveModal() {
    const firstCheckBox = await page.waitForXPath(
      '//div[contains(@class, "RequestToCore_request_content")]//tbody[contains(@class,"ant-table-tbody")]//tr[position()=1]//span[@class="ant-checkbox"]',
      {
        visible: true,
      },
    );
    await firstCheckBox.click();
    const approveBtn = await page.waitForXPath(
      '//button[contains(@class, "Widget_accept-icon")]',
      {
        visible: true,
      },
    );
    await approveBtn.click();
  }
  async function approveFirstItem() {
    await openApporveModal();
    const verificationPart = await page.waitForXPath(
      '//b[contains(@class, "Widget_no_select")]',
    );
    const verificationCode = await page.evaluate(
      (element) => element.textContent,
      verificationPart,
    );
    await page.type('.ant-modal-body input', verificationCode);
    await page.waitForTimeout(1000);
    await page.click('.ant-modal-footer button.approve-btn');
    await page.waitForTimeout(1000);
  }

  it('7.2.2 each new requests should displayed properly', async () => {
    await page.goto(`${baseUrl}project/${projectId}/requestToCore`);
    const firstReq = await page.waitForXPath(
      '//ul//li[contains(@class, "NewRequestsList_list_item") and position()=1]',
    );
    const firstReqText = await page.evaluate(
      (element) => element.textContent,
      firstReq,
    );
    const firstReqArr = firstReqText.split(' / ');
    expect(firstReqArr[0]).not.toBe('');
    const firstReqTime = firstReqArr[1];
    const dateReq = new Date(firstReqTime).valueOf();
    const dateCur = moment().valueOf();
    expect((dateCur - dateReq) / 1000.0).toBeLessThan(60 * 60);
    const firstItemName = await page.waitForXPath(
      '//div[contains(@class, "RequestToCore_request_content")]//tbody[contains(@class,"ant-table-tbody")]//tr[position()=1]//td[position()=3]//span',
      {
        visible: true,
      },
    );
    const name = await page.evaluate(
      (element) => element.textContent,
      firstItemName,
    );
    expect(name).not.toBe('');
    const firstItemAddBy = await page.waitForXPath(
      '//div[contains(@class, "RequestToCore_request_content")]//tbody[contains(@class,"ant-table-tbody")]//tr[position()=1]//td[position()=4]',
      {
        visible: true,
      },
    );
    const addBy = await page.evaluate(
      (element) => element.textContent,
      firstItemAddBy,
    );
    expect(addBy).not.toBe('');
    const firstItemCreated = await page.waitForXPath(
      '//div[contains(@class, "RequestToCore_request_content")]//tbody[contains(@class,"ant-table-tbody")]//tr[position()=1]//td[position()=5]',
      {
        visible: true,
      },
    );
    const created = await page.evaluate(
      (element) => element.textContent,
      firstItemCreated,
    );
    expect(created).not.toBe('');
  });
});
