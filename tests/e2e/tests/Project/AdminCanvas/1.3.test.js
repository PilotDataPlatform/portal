const moment = require('moment');
const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { baseUrl, dataConfig } = require('../../../config');
const { waitForRes } = require('../../../../utils/api');
// const { projectCode } = dataConfig.adminCanvas;
jest.setTimeout(700000000);

// TODO: update when backend services are back up
const projectCode = 'indoctestproject';

describe('1.3 Canvas Page - Charts', () => {
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1080, height: 900 });
    await login(page, 'admin');
    await init(page, { closeBanners: false });
  });

  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });

  beforeEach(async () => {
    await page.goto(`${baseUrl}project/${projectCode}/canvas`);
  });

  it('Project Admin should be able to see all Project members, Total files number, total file size, project members uploaded file number, downloaded file number', async function () {
    await page.waitForTimeout(5000);
    await waitForRes(page, '/statistics');

    const stats = [
      'Total Files',
      'Total File Size',
      'Project Members',
      'Uploaded',
      'Downloaded',
    ];
    const projectStats = [];

    for (let stat of stats) {
      projectStats.push(
        await page.waitForXPath(
          `//ul[contains(@class, 'Cards_charts__meta')]/li/div/span[contains(text(), '${stat}')]`,
          { timeout: 2000 },
        ),
      );
    }
    expect(projectStats.length).toBe(stats.length);
  });

  it('Project File Size should have month range for x axis and y axis, file size data shown in tooltip when hovering over chart', async function () {
    await page.waitForTimeout(2000);
    await waitForRes(page, '/size');

    const projectFileSizeChart = await page.waitForXPath(
      "//div[@data-chart-source-type='G2Plot' and @size-sensor-id='1']/descendant::canvas",
    );
    await projectFileSizeChart.hover();
    await page.waitForTimeout(1000);
    const tooltipMonth = await page.waitForXPath(
      "//div[@data-chart-source-type='G2Plot' and @size-sensor-id='1']/descendant::div[@class='g2-tooltip') and contains(@style, 'visibility: visible')]/div[@class='g2-tooltip-title']",
    );
    const month = await tooltipMonth.evaluate((node) => node.innerText);

    const chartValueNodes = await page.$x(
      "//div[@data-chart-source-type='G2Plot' and @size-sensor-id='1']/descendant::div[contains(@class, 'g2-tooltip') and contains(@style, 'visibility: visible')]/descendant::span[@class='g2-tooltip-value']",
    );

    const fileUnits = ['kb', 'mb', 'gb'];

    for (let valueNode of chartValueNodes) {
      // returns an array that splits file unit and number
      const value = await valueNode.evaluate((node) =>
        node.innerText.match(/[a-zA-Z]+|[0-9]+/g),
      );
      const lastIndex = value.length - 1;
      expect(
        fileUnits.find((unit) => unit === value[lastIndex]) ||
          value[lastIndex] === '0',
      );
    }

    expect(moment(month, 'MMM').month()).toBeTruthy();
  });

  it('Heat Map should contain color-coded File uploading, downloading, copy, deletion activities frequence by time ', async function () {
    await page.waitForTimeout(3000);
    await waitForRes(page, '/activity');

    const tabs = ['downloads', 'upload', 'deletion', 'copy'];
    const colorTracker = {};
    for (let tab of tabs) {
      const activityTab = await page.waitForXPath(
        `//li[contains(@class, 'Components_tab-switcher__tabs') and contains(text(), '${tab}')]`,
      );
      if (tab !== tabs[0]) await activityTab.click();
      await page.waitForTimeout(1000);

      const legendColors = await page.$x(
        "//li[contains(@class, 'Card_heatmap-legend__color')]",
      );
      const tabColor = await legendColors[3].evaluate(
        (node) => node.style.backgroundColor,
      );
      if (!colorTracker[tabColor]) colorTracker[tabColor] = 1;
    }

    const uniqueColors = Object.values(colorTracker);
    expect(uniqueColors.length).toBe(tabs.length);
  });
});
