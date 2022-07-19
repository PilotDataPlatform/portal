const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { contributor } = require('../../../../users');
const { baseUrl, dataConfig } = require('../../../config');
jest.setTimeout(700000);
const { projectCode } = dataConfig.adminCanvas;
const {
  generateLocalFile,
  removeExistFile,
  removeLocalFile,
} = require('../../../../utils/fileScaffoldActions.js');
const {
  deleteAction,
  uploadFile,
} = require('../../../../utils/greenroomActions.js');

describe('Project Canvas - Top Banner  ', () => {
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
  it('perpare user is contributor', async () => {
    await page.goto(`${baseUrl}project/${projectCode}/teams`);
    await page.waitForXPath("//tr[@data-row-key='testautomation']");
    const contributor = await page.$x(
      "//tr[@data-row-key='testautomation']//td[text()='Project Contributor']",
    );
    if (contributor.length > 0) {
      const changeRoleBtn = await page.waitForXPath(
        "//tr[@data-row-key='testautomation']//div//a[contains(text(),'role')]",
      );
      await changeRoleBtn.click();
      await page.waitForXPath(
        "//li[contains(@class,'ant-dropdown-menu-item') and text()='Project Contributor']",
      );
      const contributorRoleBtn = await page.waitForXPath(
        "//li[contains(@class,'ant-dropdown-menu-item') and text()='Project Contributor']",
      );
      contributorRoleBtn.click();
      await page.waitForTimeout(2000);
    }
  }),
    it('perpare describtion and tag', async () => {
      await page.goto(`${baseUrl}project/${projectCode}/settings`);

      //add tag
      await page.waitForXPath('//form//label[text()="Project Name"]');
      let editBtn = await page.waitForXPath(
        '//div[contains(@class, "ant-tabs-top-bar")]//button',
      );
      await editBtn.click();

      const tagInputText = 'testtagtesttagtesttagtesttagtesttagtesttag';
      await page.click('form .ant-form-item .ant-select-selector', {
        clickCount: 1,
      });
      await page.keyboard.press('Backspace');
      await page.type(
        'form .ant-form-item .ant-select-selector',
        tagInputText.slice(0, 32),
      );
      let saveBtn = await page.waitForXPath(
        '//div[contains(@class, "ant-tabs-top-bar")]//button//span[text()="Save"]',
      );
      await saveBtn.click();
      await page.waitForTimeout(3000);

      const tag = await page.waitForXPath(
        `//form//span[@class='ant-tag'and text()='${tagInputText.slice(
          0,
          32,
        )}']`,
      );

      expect(tag).not.toBe(null);

      //add description
      let editDescriptionBtn = await page.waitForXPath(
        '//div[contains(@class, "ant-tabs-top-bar")]//button',
      );
      await editDescriptionBtn.click();
      await page.click('.ant-form-item-control-input-content textarea', {
        clickCount: 3,
      });
      await page.keyboard.press('Backspace');
      await page.type(
        '.ant-form-item-control-input-content textarea',
        '  \n\n  ',
      );
      let saveDescriptionBtn = await page.waitForXPath(
        '//div[contains(@class, "ant-tabs-top-bar")]//button//span[text()="Save"]',
      );
      await saveDescriptionBtn.click();
      await page.waitForTimeout(2000);
      await page.waitForXPath("//span[@aria-label='edit']//ancestor::button");
      editDescriptionBtn = await page.waitForXPath(
        "//span[@aria-label='edit']//ancestor::button",
      );

      await editDescriptionBtn.click();
      let noteInputVal = await page.evaluate(
        () =>
          document.querySelector(
            '.ant-form-item-control-input-content textarea',
          ).value,
      );
      expect(noteInputVal).toBe('');
      const descriptionInputText =
        'testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest';
      await page.type(
        '.ant-form-item-control-input-content textarea',
        descriptionInputText,
      );

      noteInputVal = await page.evaluate(
        () =>
          document.querySelector(
            '.ant-form-item-control-input-content textarea',
          ).value,
      );
      expect(noteInputVal).toBe(descriptionInputText.slice(0, 250));
      saveDescriptionBtn = await page.waitForXPath(
        '//div[contains(@class, "ant-tabs-top-bar")]//button//span[text()="Save"]',
      );
      await saveDescriptionBtn.click();
      await page.waitForTimeout(3000);

      const describe = await page.waitForXPath(
        `//form//p[text()='${descriptionInputText.slice(0, 250)}']`,
      );

      expect(describe).not.toBe(null);
    }),
    it('2.1.2 The user role in the setting page should displayed as Project Contributor', async () => {
      const role = await page.waitForXPath(
        "//label[@title='Project Contributor' and text()='Project Contributor']",
      );

      expect(role).not.toBe(null);
      await logout(page);
      await page.waitForTimeout(3000);
    }),
    it('2.1.1 Project Contributor should be able to see Project Information (Title, Code, Description, Tags)', async () => {
      await login(page, 'contributor');
      await init(page, { closeBanners: true });
      await page.waitForTimeout(4000);
      await page.goto(`${baseUrl}project/${projectCode}/canvas`);

      await page.waitForTimeout(6000);
      const title = await page.$x(
        "//span[contains(@class,'Canvas_curproject-name')]",
      );
      const titleText = await title[0].evaluate((el) => el.textContent);
      expect(titleText.length).toBeGreaterThan(0);

      const code = await page.$x("//span[contains(text(),'Project Code')]");
      const codeText = await code[0].evaluate((el) => el.textContent);
      expect(codeText.length).toBeGreaterThan(13);

      await page.waitForXPath("//span[@aria-label='down-circle']");
      const expandBtn = await page.waitForXPath(
        "//span[@aria-label='down-circle']",
      );
      await expandBtn.click();

      const descriptionInputText =
        'testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest';
      const description = await page.$x(
        "//span[text()='Description']//ancestor::div[@class='ant-typography']//p",
        { hidden: true },
      );

      const descriptionText = await description[0].evaluate(
        (el) => el.textContent,
      );

      expect(descriptionText.length).toBeGreaterThan(0);
      expect(descriptionText).toBe(descriptionInputText.slice(0, 250));

      const tagInputText = 'testtagtesttagtesttagtesttagtesttagtesttag';

      const tag = await page.$x("//span[@class='ant-tag']");

      const tagText = await tag[0].evaluate((el) => el.textContent);

      expect(tagText.length).toBeGreaterThan(0);
      expect(tagText).toBe(tagInputText.slice(0, 32));
    });
});
