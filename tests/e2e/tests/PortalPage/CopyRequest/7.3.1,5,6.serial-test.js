const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { baseUrl, dataConfig } = require('../../../config');
const { submitCopyRequest } = require('../../../../utils/copyReqActions.js');
const {
  uploadFile,
  deleteFileFromGreenroom,
  createFolder,
} = require('../../../../utils/greenroomActions');
jest.setTimeout(700000);
const folderName = 'temp-folder';
const fileName = 'tinified.zip';
const projectId = dataConfig.copyReq.projectId;

describe('CopyRequest', () => {
  let page;
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1920, height: 1280 });
    await login(page, 'collaborator');
    await init(page, { closeBanners: false });
  });
  afterAll(async () => {
    await page.goto(`${baseUrl}project/${projectId}/canvas`);
    await deleteFileFromGreenroom(page, folderName);
    await page.waitForTimeout(30 * 1000);
    await logout(page);
    await login(page, 'admin');
    await page.goto(`${baseUrl}project/${projectId}/requestToCore`);
    await page.waitForTimeout(3000);
    await cleanReqCreated();
  });
  async function cleanReqCreated() {
    let i = 1;
    while (i <= 5) {
      const req = await page.waitForXPath(
        `//ul//li[contains(@class, "NewRequestsList_list_item") and position()=1]`,
      );
      await req.click();
      await page.waitForTimeout(3000);
      const firstItemNameNode = await page.$x(
        `//table//tbody[contains(@class,"ant-table-tbody")]//tr//span[contains(text(),"${folderName}")]`,
        {
          visible: true,
        },
      );
      if (firstItemNameNode.length) {
        const closeReqBtn = await page.waitForXPath(
          '//button[contains(span, "Close Request & Notify User")]',
        );
        await closeReqBtn.click();
        await page.waitForTimeout(1000);
        await page.type('textarea#notes', 'Automation test');
        const confirmBtn = await page.waitForXPath(
          '//div[contains(@class, "ant-modal-footer")]//button//span[contains(text(), "Confirm")]',
        );
        await confirmBtn.click();
        await page.waitForTimeout(3000);
      }
      i++;
    }
  }
  async function clickIntoFirstFolder() {
    const firstItemNameNode = await page.waitForXPath(
      '//div[contains(@class, "RequestToCore_request_content")]//tbody[contains(@class,"ant-table-tbody")]//tr[position()=1]//td[position()=3]//span',
      {
        visible: true,
      },
    );
    await firstItemNameNode.click();
    await page.waitForTimeout(5000);
  }
  it('7.3.1 If a folder has been sent to request, any new added file into the folder after the request was made will not be part of the request.', async () => {
    await page.goto(`${baseUrl}project/${projectId}/canvas`);
    await page.waitForSelector(
      '#files_table > div > div > table > tbody > tr > td.ant-table-cell.ant-table-selection-column > label > span > input',
    );

    await page.waitForTimeout(2000);
    await createFolder(page, folderName);
    const checkBox = await page.waitForXPath(
      `//tr//span[contains(text(),"${folderName}")]//ancestor::tr//span[@class="ant-checkbox"]`,
    );
    await checkBox.click();
    await submitCopyRequest(page);
    await page.waitForTimeout(5000);
    const firstItemNameNode = await page.waitForXPath(
      `//table//tbody[contains(@class,"ant-table-tbody")]//tr//span[contains(text(),"${folderName}")]`,
      {
        visible: true,
      },
    );
    await firstItemNameNode.click();
    await page.waitForTimeout(2000);
    await uploadFile(page, 'Test Files', fileName);
    await page.waitForTimeout(3000);
    await page.goto(`${baseUrl}project/${projectId}/requestToCore`);
    await clickIntoFirstFolder();
    await page.waitForTimeout(3000);
    const fileList = await page.$x(
      '//div[contains(@class, "RequestToCore_request_content")]//tbody[contains(@class,"ant-table-tbody")]//tr//td[position()=3]',
    );
    expect(fileList.length).toBe(0);
  });
  it('7.3.5 After a folder/file has been sent in a request, if it has been deleted, in the request it will be marked as not available (grey out), no approve/deny action can be executed on it.', async () => {
    await page.goto(`${baseUrl}project/${projectId}/canvas`);
    await page.waitForSelector(
      '#files_table > div > div > table > tbody > tr > td.ant-table-cell.ant-table-selection-column > label > span > input',
    );

    // submit copy request

    const checkBox = await page.waitForXPath(
      `//tr//span[contains(text(),"${folderName}")]//ancestor::tr//span[@class="ant-checkbox"]`,
    );
    await checkBox.click();
    await submitCopyRequest(page);

    // delete file inside
    const firstItemNameNode = await page.waitForXPath(
      `//table//tbody[contains(@class,"ant-table-tbody")]//tr//span[contains(text(),"${folderName}")]`,
      {
        visible: true,
      },
    );
    await firstItemNameNode.click();
    await deleteFileFromGreenroom(page, fileName);
    await page.waitForTimeout(60 * 1000);
    // check it is deleted
    await page.goto(`${baseUrl}project/${projectId}/requestToCore`);
    await clickIntoFirstFolder();
    await page.waitForTimeout(3000);
    const deletedFileList = await page.$x(
      '//td[@class="ant-table-cell"]//span[text()="- Deleted"]',
    );
    expect(deletedFileList.length).toBe(1);
  });
  it('7.3.6 Greyed out file/folder can be reviewed of metadata in Properties, but can NOT be downloaded or zip previewed.', async () => {
    const actionButton = await page.waitForXPath(
      '//button[contains(@class, "ant-dropdown-trigger")]',
    );
    await actionButton.click();
    const downloadBtn = await page.$x(
      '//li[contains(@class, "ant-dropdown-menu-item") and text()="Download"]',
    );
    expect(downloadBtn.length).toBe(0);
    const previewBtn = await page.$x(
      '//li[contains(@class, "ant-dropdown-menu-item") and text()="Preview"]',
    );
    expect(previewBtn.length).toBe(0);
    const propsBtn = await page.$x(
      '//li[contains(@class, "ant-dropdown-menu-item") and text()="Properties"]',
    );
    expect(propsBtn.length).toBe(1);
  });
});
