const { login } = require('../../../utils/login.js');
const { init } = require('../../../utils/commonActions.js');
const { admin } = require('../../../users');
const { baseUrl } = require('../../../config');
const {
  copyFileToCore,
  selectGreenroomFile,
  navigateToCore,
  deleteFileFromCore,
} = require('../../../utils/greenroomActions.js');

/*
this test covers 9.2.3 to 9.2.5 and 9.2.22
*/
describe('9.2 File Copy', () => {
  let page;
  const fileName = 'tinified.zip';
  const projectId = 61268;
  jest.setTimeout(700000); //sets timeout for entire test suite

  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await login(page, 'admin');
    await init(page); 
  });
  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });

  beforeEach(async () => {
    await page.setCacheEnabled(false);
    await page.goto(`${baseUrl}project/${projectId}/canvas`);
  });

  //TODO: upload a file prior to running the tests below - save a dummy file in project and upload that one

  it('9.2.3, 9.2.4, 9.2.12, 9.2.22 - Greenroom raw copied files displayed in core', async () => {
    // click on checkbox of tinified.zip
    await copyFileToCore(page, fileName, admin.username);

    // navigate to core and find copied file
    await navigateToCore(page);

    const xCopiedFile = `//div[contains(@class, 'ant-tabs-tabpane-active')]/descendant::span[contains(text(), '${fileName}')]/ancestor::tr`;
    await page.waitForXPath(xCopiedFile, { timeout: 120000, visible: true });
    const copiedFile = await page.$x(xCopiedFile);

    expect(copiedFile.length).toBe(1);
  });

  it('9.2.5 - check for copy tag of recently copied', async () => {
    await selectGreenroomFile(page, fileName);
    await page.click('span[aria-label="copy"]');

    let tag;
    let tagText;
    try {
      tag = await page.waitForXPath(
        `//tr[contains(@class, 'ant-table-row')]/descendant::span[contains(text(), '${fileName}')]/preceding::span[contains(@class, 'ant-tag')]`,
        { timeout: 2500 },
      );
      tagText = await tag.evaluate((el) => el.textContent);
    } catch (e) {
      console.log(e);
    }

    expect(tagText).toBe('copied-to-core');
  });

  it('Cleanup - delete copied file', async () => {
    // navigate to core
    await navigateToCore(page);
    await page.waitForXPath('//div[contains(@class, "FileExplorer_file_dir")]');
    const home = await page.$x(
      '//span[contains(text(), "Home") and contains(@class, "ant-tree-title")]',
    );
    await home[1].click();
    await deleteFileFromCore(page, fileName);

    // TODO: delete original file after upload function is complete
  });
});
