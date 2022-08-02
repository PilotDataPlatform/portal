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
const moment = require('moment');
const {
  waitForAPIResponse,
  getProjectStatsValues,
  getFileSizeChartTooltipData,
  getHeatmapColors,
} = require('../utils');
const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { baseUrl, dataConfig } = require('../../../config');
// const { projectCode } = dataConfig.adminCanvas;
jest.setTimeout(700000000);

// TODO: update when 'project-file/size' and 'project-file/activity' routes are live for all projects
const projectCode = 'indoctestproject';

describe('2.3 Canvas Page - Charts', () => {
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1080, height: 900 });
    await login(page, 'contributor');
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
    await waitForAPIResponse(page, { url: '/statistics' });

    const stats = ['Total Files', 'Total File Size', 'Uploaded', 'Downloaded'];
    const projectStats = await getProjectStatsValues(page, stats);
    expect(projectStats.length).toBe(stats.length);
  });

  it('Project File Size should have month range for x axis and y axis, file size data shown in tooltip when hovering over chart', async function () {
    await waitForAPIResponse(page, { url: '/size', timeout: 2000 });

    const { month, chartValues } = await getFileSizeChartTooltipData(page);
    const fileUnits = ['kb', 'mb', 'gb'];
    for (let values of chartValues) {
      const lastIndex = values.length - 1;
      expect(
        fileUnits.find((unit) => unit === values[lastIndex]) ||
          values[lastIndex] === '0',
      );
    }

    expect(moment(month, 'MMM').month()).toBeTruthy();
  });

  it('Heat Map should contain color-coded File uploading, downloading, copy, deletion activities frequence by time ', async function () {
    await waitForAPIResponse(page, { url: '/activity', timeout: 2000 });

    const tabs = ['downloads', 'upload', 'deletion'];
    const heatmapColors = await getHeatmapColors(page, tabs);

    let copyTab;
    try {
      copyTab = await page.waitForXPath(
        `//li[contains(@class, 'Components_tab-switcher__tabs') and contains(text(), 'copy')]`,
        { timeout: 5000 },
      );
      console.log(copyTab);
    } catch {}

    expect(heatmapColors.length).toBe(tabs.length);
    expect(copyTab).toBeFalsy();
  });
});
