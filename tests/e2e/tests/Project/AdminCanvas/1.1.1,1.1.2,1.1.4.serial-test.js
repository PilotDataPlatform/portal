const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { collaborator } = require('../../../../users');
const { baseUrl, dataConfig } = require('../../../config');
jest.setTimeout(700000);
const { projectCode } = dataConfig.adminCanvas;

describe('1.1 Project Canvas - Top Banner ', () => {
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
      `//form//span[@class='ant-tag'and text()='${tagInputText.slice(0, 32)}']`,
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
        document.querySelector('.ant-form-item-control-input-content textarea')
          .value,
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
        document.querySelector('.ant-form-item-control-input-content textarea')
          .value,
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
    it('The user role in the setting page should displayed as ‘Project Administrator’', async () => {
      const role = await page.waitForXPath(
        "//label[@title='Project Administrator' and text()='Project Administrator']",
      );

      expect(role).not.toBe(null);
    }),
    it('1.1 Admin should be able to see Project Information (Title, Code, Description, Tags) and 1.4 Description and Tags match the information in Project Setting page ', async () => {
      await page.goto(`${baseUrl}project/${projectCode}/canvas`);
      const titleText = await title[0].evaluate((el) => el.textContent);
      expect(titleText.length).toBeGreaterThan(0);

      const code = await page.$x("//span[contains(text(),'Project Code')]");
      const codeText = await code[0].evaluate((el) => el.textContent);
      expect(codeText.length).toBeGreaterThan(13);
      await page.waitForTimeout(6000);
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
