const { login } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { collaborator } = require('../../../../users');
const { baseUrl, dataConfig, mailHogHost, mailHogPort } = require('../../../config');
const {
  requestToCore,
  fileName,
  folderName,
  uploadFile,
  uploadFolder,
  waitForFileExplorer,
} = require('../../../../utils/greenroomActions.js');
const mailhog = require('mailhog')({
  host: mailHogHost,
  port: mailHogPort,
});

const { collaboratorProjectId } = dataConfig.fileCopy;

describe('9.2 File Copy', () => {
  let page;

  const projectId = collaboratorProjectId;
  const fileName = '3.png';
  jest.setTimeout(700000); //sets timeout for entire test suite

  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1080 });
    await login(page, 'collaborator');
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

  it('9.2.2 - File copy from raw to VRE core requires confirmation from Project Admin', async () => {
    const projectTitle = await page.waitForXPath(
      '//span[contains(@class, "ant-page-header-heading-title")]/descendant::span',
    );
    const projectName = await page.evaluate(
      (ele) => ele.innerText,
      projectTitle,
    );
    await waitForFileExplorer(page, collaborator.username);
    await requestToCore(page, collaborator.username, fileName);
    await page.waitForTimeout(5000);

    const result = await mailhog.messages(0, 1);
    const emailConfirmation = result.items.find((item) => {
      const hasSubject = item.subject
        .replace(/_/g, ' ')
        .includes('A new request to copy data to Core needs your approval');
      console.log('hasSubject' + hasSubject);
      const hasContent =
        item.html.includes(`b>Project:</b> ${projectName}`) &&
        item.html.includes(`<b>Requested by:</b> ${collaborator.username}`);
      console.log('hasContent' + hasContent);

      if (hasSubject && hasContent) {
        return item;
      }
    });

    expect(emailConfirmation).toBeTruthy();
    await mailhog.deleteMessage(emailConfirmation.ID);
  });
});
