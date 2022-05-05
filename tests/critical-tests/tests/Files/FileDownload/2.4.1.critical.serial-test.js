const fs = require('fs');
const { login, logout } = require('../../../../utils/login.js');
const { admin } =require('../../../../users');
const { init } = require('../../../../utils/commonActions.js');
const { baseUrl } = require('../../../config');
const {
  uploadFile,
  waitForFileExplorer,
  folderName,
  fileName,
  createFolder,
  navigateInsideFolder,
  selectGreenroomFile,
  deleteFileFromGreenroom,
} = require('../../../../utils/greenroomActions.js');

describe('2.4 Folder Download', () => {
  let page;
  const projectId = 96722;
  const newFolder = 'Test Folder';
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

  it('Create folder and upload 1 file', async () => {
    await waitForFileExplorer(page, admin.username);
    await createFolder(page, newFolder);

    await navigateInsideFolder(page, newFolder);

    await waitForFileExplorer(page, newFolder);
    await uploadFile(page, folderName, fileName);
  });

  it('2.4.1 Folder contains only 1 file should also be downloaded as a zip file', async () => {
    await page._client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: './tests/downloads',
    });

    await waitForFileExplorer(page, admin.username);
    await selectGreenroomFile(page, newFolder);
    const downloadButton = await page.waitForXPath(
      '//div[contains(@class, "FileExplorer_file_explore_actions")]/descendant::span[contains(text(), "Download")]/parent::button',
    );
    await downloadButton.click();
    await page.waitForTimeout(10000);

    const [ downloadedFile ] = fs.readdirSync(`./tests/downloads/`);
    expect(downloadedFile.includes('.zip')).toBeTruthy();
    // remove file
    fs.unlinkSync(`./tests/downloads/${downloadedFile}`);
  });

  it('Cleanup greenroom', async () => {
    await deleteFileFromGreenroom(page, newFolder);
  });
});
