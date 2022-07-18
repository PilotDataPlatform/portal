const { login, logout } = require('../../../utils/login.js');
const { init } = require('../../../utils/commonActions');
const { baseUrl } = require('../../config');
jest.setTimeout(700000);

describe('Login and verify the route and username', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await login(page, 'admin');
    await init(page);
  });

  it('1.1.2 - User should be redirected to the login page', async () => {
    await logout(page);
    await page.waitForTimeout(3000);

    const url = new URL(await page.url());
    expect(url.pathname === '/login').toBeTruthy();
  });
});
