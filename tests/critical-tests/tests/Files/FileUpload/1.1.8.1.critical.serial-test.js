const { login, logout } = require('../../../../utils/login.js');
const { admin } =require('../../../../users');
const { init } = require('../../../../utils/commonActions.js');
const { baseUrl } = require('../../../config');
const {
  waitForFileExplorer,
  toggleFilePanel,
  checkFilePanelStatus,
  folderName,
  fileName,
  uploadAction,
  deleteFileFromGreenroom,
  navigatePaginationAndFind,
} = require('../../../../utils/greenroomActions.js');

describe('1.8 Upload files in generate project', () => {
  let page;
  const projectId = 3411;
  const idText = 'ATO-1234';
  const fileNameWithId = `${idText}_${fileName}`;
  jest.setTimeout(7000000); //sets timeout for entire test suite

  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await login(page, 'admin');
    await init(page);
  });

  beforeEach(async () => {
    await page.setCacheEnabled(false);
    await page.goto(`${baseUrl}project/${projectId}/canvas`);
  });

  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });

  it('1.8.1 - Need to project the generate id that follow the format “XXX-0000”', async () => {
    await waitForFileExplorer(page, admin.username);
    await uploadAction(page);
    await page.type('#form_in_modal_gid', idText);
    await page.type('#form_in_modal_gid_repeat', idText);
    const uploadInputField = await page.waitForSelector('#form_in_modal_file');
    await uploadInputField.uploadFile(
      `${process.cwd()}/tests/uploads/${folderName}/${fileName}`,
    );
    await page.click('#file_upload_submit_btn');

    await toggleFilePanel(page);
    await checkFilePanelStatus(page, fileName);

    const uploadedFile = await navigatePaginationAndFind(page, fileNameWithId);
    expect(uploadedFile).toBeTruthy();

    const fileGenerateId = await page.waitForXPath(
      `//tr[contains(@class, 'ant-table-row')]/descendant::span[contains(text(), '${fileNameWithId}')]/ancestor::tr/descendant::td[contains(text(), '${idText}')]`,
      { timeout: 15000 },
    );
    expect(fileGenerateId).toBeTruthy();
  });

  it('Cleanup greenroom', async () => {
    await waitForFileExplorer(page, admin.username);
    await navigatePaginationAndFind(page, fileNameWithId)
    await deleteFileFromGreenroom(page, fileNameWithId);
  });
});
