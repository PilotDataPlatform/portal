const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { disabletest } = require('../../../../users');
const { baseUrl, dataConfig } = require('../../../config');
const { projectCode } = dataConfig.userProfile;
jest.setTimeout(700000);

describe('User profile', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1300, height: 1080 });
    await login(page, 'admin');
    await init(page, { closeBanners: true });
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });
  async function findDisabletestUser() {
    const searchUserBtn = await page.waitForXPath("//span[@role='button']");
    await searchUserBtn.click();
    const userInput = await page.waitForXPath(
      "//input[@placeholder='Search name']",
    );
    await userInput.type('disabletest');
    const searchBtn = await page.waitForXPath(
      "//div[@class='ant-table-filter-dropdown']/div/div/div/button[contains(@class,'ant-btn ant-btn-primary')]",
    );
    await searchBtn.click();

    await page.waitForTimeout(3000);
  }
  async function clickBtnInUser() {
    const btn = await page.waitForXPath(
      "//tr[contains(@class,'ant-table-row') and @data-row-key='disabletest']/td/div[@class='ant-dropdown-trigger']/button",
    );
    await btn.click();
  }
  it('8.2.7 When user is disabled, all the projects relation should be removed and enable of the user will not restore the project relationship', async () => {
    //add projects
    await page.goto(`${baseUrl}project/${projectCode}/teams`);
    await page.waitForXPath("//tr[contains(@class,'ant-table-row')]");
    //check if disabletest not exist
    const disabletest = await page.$x("//tr[@data-row-key='disabletest']");

    if (disabletest.length === 0) {
      const add_member = await page.waitForXPath(
        "//button[span[text()='Add Member']]",
      );
      await add_member.click();
      const userInput = await page.waitForXPath("//input[@id='email']");
      await userInput.type(disabletest.email);
      const submitBtn = await page.waitForXPath(
        "//button[span[text()='Submit']]",
      );
      await submitBtn.click();
      await page.waitForTimeout(3000);
    }

    //disable account using admin

    await page.goto(`${baseUrl}users`);

    await findDisabletestUser();

    await clickBtnInUser();

    const disableBtn = await page.waitForXPath(
      "//li[contains(@class,'ant-dropdown-menu-item') and text()='Disable Account']",
    );
    await disableBtn.click();

    const modalConfirmBtn = await page.waitForXPath(
      "//div[contains(@class,'ant-modal-confirm-btns')]/button[span[text()='OK']]",
    );
    await modalConfirmBtn.click();
    await page.waitForTimeout(3000);
    //check if projects in profile are removed
    await page.goto(`${baseUrl}users`);
    await findDisabletestUser();
    await clickBtnInUser();
    const profileBtn = await page.waitForXPath(
      "//li[contains(@class,'ant-dropdown-menu-item') and text()='Profile']",
    );
    await profileBtn.click();

    await page.waitForTimeout(3000);

    //no project name

    const projectName = await page.$x(
      "//h4[@class='ant-list-item-meta-title']",
    );

    expect(projectName.length).toBe(0);
  });
  it('8.1.7 When user is disabled and re-enabled again into the platform, user activity log should indicate both disabled and enabled activity && 8.1.8 When user is disabled, all the projects relation should be removed and enable of the user will not restore the project relationship', async () => {
    //enable user account
    await page.goto(`${baseUrl}users`);
    await findDisabletestUser();
    await page.waitForTimeout(3000);
    await clickBtnInUser();
    const enableBtn = await page.waitForXPath(
      "//li[contains(@class,'ant-dropdown-menu-item') and text()='Enable Account']",
    );
    await enableBtn.click();
    await page.goto(`${baseUrl}users`);
    await page.waitForTimeout(3000);

    //log in as user disabletest
    await logout(page);
    await page.waitForTimeout(6000);

    await login(page, 'disabletest');
    await page.goto(`${baseUrl}user-profile`);

    var lastPage = await page.$x(
      "//div[contains(@class,'UserProfile_activities__activity-log')]/div[contains(@class,'ant-list')]/div[@class='ant-list-pagination']/ul/li[@title='Next Page' and @aria-disabled='true']",
    );
    while (lastPage.length === 0) {
      console.log('loop!');
      var nextPage = await page.waitForXPath(
        "//div[contains(@class,'UserProfile_activities__activity-log')]/div[contains(@class,'ant-list')]/div[@class='ant-list-pagination']/ul/li[@title='Next Page'  and @aria-disabled='false']",
      );

      await nextPage.click();
      await page.waitForTimeout(3000);
      lastPage = await page.$x(
        "//div[contains(@class,'UserProfile_activities__activity-log')]/div[contains(@class,'ant-list')]/div[@class='ant-list-pagination']/ul/li[@title='Next Page' and @aria-disabled='true']",
      );
      console.log(lastPage.length);
    }
    if (lastPage.length == 1) {
      //in the last page,find logs
      const accountDisabledLog = await page.$x(
        "//div[contains(@class,'activity-item__action')]/div/div/div/span[text()='Account Disabled']",
      );
      const accountEnableLog = await page.$x(
        "//div[contains(@class,'activity-item__action')]/div/div/div/span[text()='Account Activated']",
      );

      expect(accountDisabledLog.length).toBeGreaterThan(0);
      expect(accountEnableLog.length).toBeGreaterThan(0);

      //first one is the recent attended one
      const removedProject = await page.waitForXPath(
        "//h4[@class='ant-list-item-meta-title' and text()='Test0411']",
        { hidden: true },
      );
      expect(removedProject).toBe(null);
    }
  });
});
