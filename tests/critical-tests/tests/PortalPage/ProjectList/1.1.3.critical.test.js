const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { collaborator } =require('../../../../users');
const { baseUrl, dataConfig } = require('../../../config');
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
  it('1.1.3 Search project. ', async () => {
    await page.goto(`${baseUrl}landing`);
    const searchIcon = await page.waitForXPath(
      '//button//span[contains(@class, "anticon-search")]',
    );
    await searchIcon.click();
    const projectCodeInput = await page.waitForXPath(
      '//p[text()="Project Code"]//following-sibling::div//input',
    );
    await projectCodeInput.type('generate');
    const searchBtn = await page.waitForXPath(
      '//div[contains(@class,"LandingPageContent_secondInputLine" )]//button[@type="submit"]',
    );
    await searchBtn.click();
    await page.waitForTimeout(1000);
    const projectList = await page.$x('//*[@class="ant-list-items"]');
    expect(projectList.length).toBe(1);
  });
});
