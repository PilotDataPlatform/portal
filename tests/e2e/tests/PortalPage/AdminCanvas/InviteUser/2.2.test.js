const { login, logout } = require('../../../../../utils/login.js');
const { init } = require('../../../../../utils/commonActions.js');
const { collaborator } = require('../../../../../users');
const { baseUrl, dataConfig } = require('../../../../config');
jest.setTimeout(700000);

const projectId = dataConfig.copyReq.projectId;

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
    await page.goto(`${baseUrl}project/${projectId}/teams`);
    const icon = await page.waitForSelector(`#side-bar > li:nth-child(4)`);
    expect(icon).not.toBeNull();
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
