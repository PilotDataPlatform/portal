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
const { login } = require('../../../../utils/login.js');
const {
  init,
  openSupportDrawer,
  openAndWaitForTarget,
} = require('../../../../utils/commonActions.js');
const { clearInput } = require('../../../../utils/inputBox.js');
const { collaborator } = require('../../../../users');
const {
  baseUrl,
  mailHogHost,
  mailHogAdminEmail,
} = require('../../../config');
const mailhog = require('mailhog')({
  host: mailHogHost,
});

describe('5.5 Test Contact us form should receive an email confirmation', () => {
  let page;
  jest.setTimeout(10000000);

  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await login(page, 'collaborator');
    await init(page);
  });

  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });

  beforeEach(async () => {
    await page.setCacheEnabled(false);
  });

  it('Username and email prefilled, user should receive email confirmation', async () => {
    const title = 'Test inquiry';
    const description = 'This is the test body';

    await openSupportDrawer(page);
    const usernameInput = await page.$eval('#name', (input) => input.value);
    const emailInput = await page.$eval('#email', (input) => input.value);

    expect(usernameInput).toBe(collaborator.username);
    expect(emailInput.replace(/\+/g, '')).toBe(collaborator.email);

    await page.type('#title', title);
    await page.type('#description', description);
    const submitButton = await page.waitForXPath(
      '//div[contains(@id, "support-drawer")]/descendant::span[contains(text(), "Submit")]/parent::button',
    );
    await submitButton.click();

    await page.waitForResponse(
      (response) =>
        response.status() === 200 && response.url().includes('/v1/contact'),
    );

    const result = await mailhog.messages(0, 10);
    const userEmailConfirmation = result.items.find((item) => {
      const hasEmail = item.to.replace(/\+/g, '').includes(collaborator.email);
      const hasSubject = item.subject
        .replace(/_/g, ' ')
        .includes('Confirmation of Contact Email');
      const hasContent =
        item.html.includes(`Issue title: ${title}`) &&
        item.html.includes(description);

      if (hasEmail && hasSubject && hasContent) {
        return item;
      }
    });
    const adminEmailConfirmation = result.items.find((item) => {
      const hasEmail = item.to.replace(/\+/g, '').includes(mailHogAdminEmail);
      const hasSubject = item.subject
        .replace(/_/g, ' ')
        .toLowerCase()
        .includes('support request submitted');
      const hasContent =
        item.html.includes(`Issue title: ${title}`) &&
        item.html.includes(description);

      if (hasSubject && hasEmail && hasContent) {
        return item;
      }
    });

    expect(userEmailConfirmation).toBeTruthy();
    expect(adminEmailConfirmation).toBeTruthy();

    await mailhog.deleteMessage(userEmailConfirmation.ID);
    await mailhog.deleteMessage(adminEmailConfirmation.ID);
  });

  it('Contact us form description is limited between 10 to 10,000 characters, display error message if any information is incorrect', async () => {
    await page.reload();
    const charErrorMessage =
      'The description must be between 10 and 1000 characters';
    const descErrorMessage = 'Please provide a description';

    let upperLimitChar = '';
    for (let i = 0; i < 1001; i++) {
      upperLimitChar += 'a';
    }
    const lowerLimitChar = 'aaa';
    const withinLimitChar = 'aaaaaaaaaaa';
    const inputChars = [upperLimitChar, lowerLimitChar, withinLimitChar];

    await openSupportDrawer(page);

    for (let char of inputChars) {
      await page.type('#description', char);
      let charErrorLabel;
      try {
        charErrorLabel = await page.waitForXPath(
          `//div[contains(@id, 'support-drawer')]/descendant::div[contains(text(), '${charErrorMessage}')]`,
          { timeout: 2500 },
        );
      } catch {}
      if (char.length > 1000 || char.length < 10) {
        expect(charErrorLabel).toBeTruthy();
      } else {
        expect(charErrorLabel).toBeFalsy();
      }

      await clearInput(page, '#description');
      const descErrorLabel = await page.waitForXPath(
        `//div[contains(@id, 'support-drawer')]/descendant::div[contains(text(), '${descErrorMessage}')]`,
      );
      expect(descErrorLabel).toBeTruthy();
    }
  });

  it('Description message should not contain only space and line breaks', async () => {
    await page.reload();
    const invalidChars = '     \n\n    \n  ';
    const charErrorMessage =
      'The description must be between 10 and 1000 characters';

    await openSupportDrawer(page);
    await page.type('#description', invalidChars);

    const charErrorLabel = await page.waitForXPath(
      `//div[contains(@id, 'support-drawer')]/descendant::div[contains(text(), '${charErrorMessage}')]`,
      { timeout: 2500 },
    );
    expect(charErrorLabel).toBeTruthy();
  });

  it('Documentation should redirect user to xwiki user guide page', async () => {
    await openSupportDrawer(page);

    const wikiLink = await page.waitForXPath(
      '//div[contains(@id, "support-drawer")]/descendant::button/a[contains(text(), "User Guide")]',
    );
    const newPage = await openAndWaitForTarget(browser, page, wikiLink);

    expect(newPage.url().includes('/xwiki/wiki/')).toBeTruthy();
    await newPage.close();
  });
});
