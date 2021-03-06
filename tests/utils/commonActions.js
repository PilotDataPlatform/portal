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
const { waitForRes } = require('./api');
const openSupportDrawer = async (page) => {
  const support = await page.waitForXPath('//li[contains(text(), "Support")]');
  await support.click();
  await page.waitForSelector('#support-drawer', { visible: true });
};

const openAndWaitForTarget = async (browser, page, elementHandle) => {
  //save target of original page to know that this was the opener:
  const pageTarget = page.target();
  await elementHandle.click();

  //check that the first page opened this new page:
  const newTarget = await browser.waitForTarget(
    (target) => target.opener() === pageTarget,
  );
  //get the new page object:
  const newPage = await newTarget.page();

  return newPage;
};

const closeReleaseNote = async (page, { wait = true } = {}) => {
  if (wait) {
    await waitForRes(page, '/notifications');
  }
  try {
    const closeModal = await page.waitForXPath(
      '//div[contains(@class, "ant-notification-notice-message")]/b[contains(text(), "Release")]/ancestor::div[contains(@class, "ant-notification-notice")]/descendant::a[contains(@class, "ant-notification-notice-close")]',
      { timeout: 10000, visible: true },
    );
    await closeModal.click();
    await page.waitForTimeout(1000);
  } catch {}
};

const closeAllBanners = async (page, { wait = true } = {}) => {
  if (wait) {
    const res = await waitForRes(page, '/notifications');
  }
  let bannerLeft = true;
  while (bannerLeft) {
    let bannerLeftBtn;
    try {
      bannerLeftBtn = await page.waitForXPath(
        '//ul[contains(@class, "Notifications_banner-notifications")]//li//button',
        { timeout: 3000 },
      );
      await page.evaluate((ele) => ele.click(), bannerLeftBtn);
      await page.waitForTimeout(100);
    } catch {
      bannerLeft = false;
    }
  }
};

const closeMaintenanceWarning = async (page) => {
  await page.evaluateOnNewDocument(() => {
    setInterval(() => {
      const modalButtons = Array.from(
        document.querySelectorAll('.ant-modal-footer button'),
      );
      if (modalButtons.length) {
        const confirmButton = modalButtons.find(
          (button) => button.textContent === 'OK',
        );
        confirmButton.click();
      }
    }, 15000);
  });
};

const init = async (
  page,
  {
    closeMaintenanceModal = true,
    closeReleaseNoteModal = true,
    closeBanners = true,
  } = {},
) => {
  await page.waitForResponse(
    (response) =>
      response.url().includes('/notifications') && response.status() === 200,
  );
  if (closeMaintenanceModal) {
    await closeMaintenanceWarning(page);
  }
  if (closeReleaseNoteModal) {
    await closeReleaseNote(page, { wait: false });
  }
  if (closeBanners) {
    await closeAllBanners(page, { wait: false });
  }
};

module.exports = {
  init,
  closeReleaseNote,
  closeAllBanners,
  openSupportDrawer,
  openAndWaitForTarget,
};
