const { login, logout } = require('../../../utils/login.js');
const { init } = require('../../../utils/commonActions');
const { admin } = require('../../../users');
const { baseUrl } = require('../../config');
jest.setTimeout(700000);

describe('Login and verify the route and username', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
  });

  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });

  it('1.1.1 - User should be able to to login VRE portal successfully by providing email or username', async () => {
    await login(page, 'admin');
    await init(page);

    const url = new URL(await page.url());
    expect(url.pathname === '/404').toBeFalsy();
  });

  it('1.1.1 - Username should be displayed properly on top right corner after login', async () => {
    const usernameNode = await page.waitFor('#header_username');
    expect(await usernameNode.evaluate((ele) => ele.innerText)).toBe(
      admin.username,
    );
  });
});
