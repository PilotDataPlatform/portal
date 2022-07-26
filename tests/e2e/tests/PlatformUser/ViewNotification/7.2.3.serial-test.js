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
const { baseUrl } = require('../../../config');
const { init } = require('../../../../utils/commonActions.js');
const { navigateToNotifications, createNotification, disableNotification } = require('../../../../utils/notificationActions.js');

describe('User can access notification list to review published notifications', () => {
  jest.setTimeout(7000000);
  let page;

  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(baseUrl);
    await login(page, 'admin');
    await init(page);
  });

  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });

  it('7.2.3a, 7.2.3b - Clicking a notification item will open up the modal and modal can be closed', async () => {

    // Open modal via notification item
    const bellNotification = await page.waitForXPath(
      '//header/descendant::li[contains(@class, "ant-menu-item")]/descendant::span[contains(@aria-label, "bell")]',
    );
    await bellNotification.click();

    await page.waitForXPath(
      '//ul[contains(@class, "Notifications_notification_container")]',
    );
    const bellItems = await page.$x(
      '//li[contains(@class, "Notifications_bell-item")]',
    );
    await bellItems[0].click();

    await page.waitForXPath('//div[contains(@class, "ant-modal-wrap")]');
    const modal = await page.$x('//div[contains(@class, "ant-modal-content")]');

    // Close Modal
    const closeModalButton = await page.waitForXPath(
      '//button[contains(@class, "maintenance_maintenance-modal__primary-button")]',
    );
    await closeModalButton.click();

    let isModalHidden;
    try {
      isModalHidden = await page.waitForXPath(
        '//div[contains(@class, "ant-modal-mask-hidden")]',
        { timeout: 5000 },
      );
    } catch {}

    expect(modal).toBeTruthy();
    expect(isModalHidden).toBeTruthy();
  });

  it('7.2.3c - User cannot view disabled notification from the notification list', async () => {
    await navigateToNotifications(page);
    await createNotification(page);
    await page.waitForTimeout(5000);

    await disableNotification(page);
    await page.waitForTimeout(2000);

    const bellNotification = await page.waitForXPath(
      '//header/descendant::li[contains(@class, "ant-menu-item")]/descendant::span[contains(@aria-label, "bell")]',
    );
    await bellNotification.click();

    let disabledNotification;
    try {
      disabledNotification = await page.waitForXPath(
        `//ul[contains(@class, "Notifications_notification_container")]/li/p[contains(text(), "${notificationDateValue}")]`,
        { timeout: 5000}
      );
    } catch {}

    expect(disabledNotification).toBeFalsy();
  });
});
