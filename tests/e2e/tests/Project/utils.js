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
const { waitForRes } = require('../../../utils/api');

const waitForAPIResponse = async (page, { url, timeout = 4000 }) => {
  await page.waitForTimeout(timeout);
  await waitForRes(page, url);
};

const getProjectStatsValues = async (page, stats) => {
  const projectStats = [];

  for (let stat of stats) {
    projectStats.push(
      await page.waitForXPath(
        `//ul[contains(@class, 'Cards_charts__meta')]/li/div/span[contains(text(), '${stat}')]`,
        { timeout: 5000 },
      ),
    );
  }

  return projectStats;
};

const getFileSizeChartTooltipData = async (page) => {
  const projectFileSizeChart = await page.waitForXPath(
    "//div[@data-chart-source-type='G2Plot' and @size-sensor-id='1']/descendant::canvas",
  );
  await projectFileSizeChart.hover();
  await page.waitForTimeout(1000);
  const tooltipMonth = await page.waitForXPath(
    "//div[@data-chart-source-type='G2Plot' and @size-sensor-id='1']/descendant::div[@class='g2-tooltip' and contains(@style, 'visibility: visible')]/div[@class='g2-tooltip-title']",
  );
  const month = await tooltipMonth.evaluate((node) => node.innerText);

  // an array of chart values for per zone
  const chartValueNodes = await page.$x(
    "//div[@data-chart-source-type='G2Plot' and @size-sensor-id='1']/descendant::div[contains(@class, 'g2-tooltip') and contains(@style, 'visibility: visible')]/descendant::span[@class='g2-tooltip-value']",
  );

  const chartValues = [];
  for (let node of chartValueNodes) {
    chartValues.push(
      await node.evaluate((n) => n.innerText.match(/[a-zA-Z]+|[0-9]+/g)),
    );
  }

  return { month, chartValues };
};

const getHeatmapColors = async (page, tabs) => {
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

  return Object.values(colorTracker);
};

module.exports = {
  waitForAPIResponse,
  getProjectStatsValues,
  getFileSizeChartTooltipData,
  getHeatmapColors,
};
