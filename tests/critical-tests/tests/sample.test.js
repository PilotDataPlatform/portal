const { baseUrl } = require('../config');
const pti = require('puppeteer-to-istanbul');
const fs = require('fs');

jest.setTimeout(700000);
/*
this test runs as a project admin test
Create a project admin account first
then change the login function username, and password
*/

describe('Admin Canvas', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();

    await page.coverage.startJSCoverage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
  });

  afterAll(async () => {
    const jsCoverage = await page.coverage.stopJSCoverage();
    pti.write(jsCoverage);
  });

  it('see login button', async () => {
    await page.goto(`${baseUrl}login`);
    await page.waitForTimeout(4000);
  });
});
