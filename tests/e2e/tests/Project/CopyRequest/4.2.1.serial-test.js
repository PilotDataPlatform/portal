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
const {
  baseUrl,
  mailHogHost,
  mailHogPort,
  mailHogAdminEmail,
} = require('../../../config');
jest.setTimeout(700000);
const mailhog = require('mailhog')({
  host: mailHogHost,
  port: mailHogPort,
});

describe('CopyRequest', () => {
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
  it('4.2.1 All project admins could receive email notification with correct information including project code, username and user email', async () => {
    const result = await mailhog.messages(0, 10);
    const emailConfirmation = result.items.find((item) => {
      const hasEmail = item.from.replace(/\+/g, '').includes(mailHogAdminEmail);
      const hasSubject = item.subject
        .replace(/_/g, ' ')
        .toLowerCase()
        .includes('a new request to copy data');

      if (hasEmail && hasSubject) {
        return item;
      }
    });
    expect(emailConfirmation).toBeTruthy();
    await mailhog.deleteMessage(emailConfirmation.ID);
  });
});
