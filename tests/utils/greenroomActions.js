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
const fs = require('fs');

const fileName = 'test001.md';
const folderName = 'Test Files';
const coreFolderName = 'Test Folder';
const coreSubFolderName = 'Test Sub Folder';

const waitForFileExplorer = async (page, breadcrumb) => {
  await page.waitForXPath(
    `//span[contains(@class, 'ant-breadcrumb-link') and contains(text(), '${breadcrumb}')]`,
  );
};

const refreshFileExplorer = async (page) => {
  const refreshButton = await page.waitForXPath(
    '//div[contains(@class, "FileExplorer_file_explore_actions")]/descendant::span[contains(text(), "Refresh")]/parent::button',
  );
  await refreshButton.click();
};

const navigateToCore = async (page) => {
  await page.waitForXPath('//div[contains(@class, "FileExplorer_file_dir")]');
  const home = await page.$x(
    '//span[contains(text(), "Home") and contains(@class, "ant-tree-title")]',
  );
  await home[1].click();
  await page.waitForTimeout(5000);
};

const selectGreenroomFile = async (page, fileName) => {
  await page.waitForXPath(
    `//tr[contains(@class, 'ant-table-row')]/descendant::span[contains(text(), '${fileName}')]/ancestor::tr/descendant::input`,
  );
  // filter out checked box
  const fileCheckbox = await page.$x(
    `//tr[contains(@class, 'ant-table-row')]/descendant::span[contains(text(), '${fileName}')]/ancestor::tr/descendant::span[@class="ant-checkbox"]//input`,
  );
  // if checked already, this list will be empty
  if (fileCheckbox.length) {
    await fileCheckbox[0].click();
  }
};

const selectCoreFile = async (page, fileName) => {
  const fileCheckbox = await page.waitForXPath(
    `//div[contains(@class, 'ant-tabs-tabpane-active')]/descendant::span[contains(text(), '${fileName}')]/ancestor::tr/descendant::input`,
  );
  await fileCheckbox.click();
};

const selectFileProperties = async (page, fileName) => {
  await selectGreenroomFile(page, fileName);
  const actionsButton = await page.waitForXPath(
    `//tr[contains(@class, 'ant-table-row')]/descendant::span[contains(text(), '${fileName}')]/ancestor::tr//button[contains(@class, "ant-dropdown-trigger")]`,
  );
  await actionsButton.hover();
  const properties = await page.waitForXPath(
    '//ul[contains(@class, "ant-dropdown-menu")]/li[contains(text(), "Properties")]',
    { timeout: 15000 },
  );
  await properties.click();
};

const navigateInsideFolder = async (page, folderName) => {
  const folder = await page.waitForXPath(
    `//tr[contains(@class, 'ant-table-row')]/descendant::span[contains(text(), '${folderName}')]`,
  );
  await folder.click();
  await waitForFileExplorer(page, folderName);
};

const copyAction = async (page) => {
  await page.click('span[aria-label="copy"]');
  const confirmCopy = await page.waitForXPath(
    '//button/span[contains(text(), "Copy to Core")]/parent::button',
  );
  await confirmCopy.click();
};

const findUserFolderDestination = async (page, username) => {
  // navigate to user folders
  const [selectDestination] = await page.$x(
    '//button/span[contains(text(), "Select Destination")]/parent::button',
  );
  selectDestination.click();
  const coreFolder = 'span[title="Core"]';
  await page.waitForSelector(coreFolder);
  await page.click(coreFolder);

  // find correct folder
  let destinationFolder;
  while (!destinationFolder) {
    try {
      destinationFolder = await page.waitForXPath(
        `//span[contains(@title, '${username}')]`,
        { timeout: 5000 },
      );
      await destinationFolder.click();
    } catch (e) {
      // user not found, click on ellipsis to expand user list
      await page.click('span[title="..."');
    }
  }
};
const createFolder = async (page, folderName) => {
  await page.waitForXPath(
    `//div[contains(@class, 'FileExplorer_file_folder_path')]/span[2]`,
  );
  const newFolderBtn = await page.waitForXPath(
    '//button//span[contains(text(), "New Folder")]',
  );

  await newFolderBtn.click();
  await page.type('#folderName', folderName);
  const createFolderBtn = await page.waitForXPath(
    '//div[@class="ant-modal-footer"]//button//span[contains(text(), "Create")]',
  );
  await createFolderBtn.click();
  try {
    const closeBtn = await page.waitForXPath(
      '//span[@class="ant-modal-close-x"]',
    );
    await closeBtn.click();
  } catch (e) {
    console.log('close btn not found');
  }
  const newFolder = await page.waitForXPath(
    `//tr[contains(@class, 'ant-table-row')]/descendant::span[contains(text(), '${folderName}')]`,
    { timeout: 60000 },
  );
  expect(newFolder).toBeTruthy();
  return newFolder;
};
const copyFileToCore = async (page, username, fileName, folderName) => {
  await selectGreenroomFile(page, fileName);
  // click on copy
  await copyAction(page);
  // type in verification code
  const xCode = await page.waitForXPath(
    '//div[contains(@class, "ant-modal-body")]/descendant::b',
  );
  const verificationCode = await page.evaluate(
    (xCode) => xCode.textContent,
    xCode,
  );
  await page.type('input[placeholder="Enter Code"]', verificationCode);

  await findUserFolderDestination(page, username);

  if (folderName) {
    const coreFolder = await page.waitForXPath(
      `//div[contains(@class, "Copy2Core_copy_to_core_modal")]/descendant::span[contains(@class, "ant-tree-title") and contains(text(), "${folderName}")]`,
    );
    await coreFolder.click();
  }

  const [selectFolder] = await page.$x(
    '//span[contains(text(), "Select")]/parent::button',
  );
  await selectFolder.click();

  const confirmFolder = await page.waitForXPath(
    '//span[contains(text(), "Confirm")]/parent::button',
  );
  await confirmFolder.click();
  const closeButton = await page.waitForXPath(
    '//span[contains(text(), "Close")]/parent::button',
  );
  await closeButton.click();
};

const requestToCore = async (page, username, fileName, folderName) => {
  await selectGreenroomFile(page, fileName);
  // click on copy
  await page.click('span[aria-label="pull-request"]');

  // navigate to user folders
  const [selectDestination] = await page.$x(
    '//button/span[contains(text(), "Select Destination")]/parent::button',
  );
  selectDestination.click();
  const coreFolder = await page.waitForXPath(
    '//div[contains(@class, "ant-modal-content")]/descendant::span[contains(text(), "Core") and contains(@class, "ant-tree-title")]',
  );
  await coreFolder.click();

  // find correct folder
  let destinationFolder;
  while (!destinationFolder) {
    try {
      destinationFolder = await page.waitForXPath(
        `//span[contains(@title, '${username}')]`,
        { timeout: 5000 },
      );
      await destinationFolder.click();
    } catch (e) {
      // user not found, click on ellipsis to expand user list
      await page.click('span[title="..."');
    }
  }

  if (folderName) {
    const coreFolder = await page.waitForXPath(
      `//div[contains(@class, "Copy2Core_copy_to_core_modal")]/descendant::span[contains(@class, "ant-tree-title") and contains(text(), "${folderName}")]`,
    );
    await coreFolder.click();
  }

  const [selectFolder] = await page.$x(
    '//span[contains(text(), "Select")]/parent::button',
  );
  await selectFolder.click();

  await page.type('#notes', 'Test request to core');

  const confirmFolder = await page.waitForXPath(
    '//span[contains(text(), "Confirm")]/parent::button',
  );
  await confirmFolder.click();
};

const deleteAction = async (page) => {
  await clickFileAction(page, 'Delete');
  await page.waitForXPath(
    '//div[contains(@class, "ant-modal-title") and contains(text(), "Delete Files")]',
    {
      visible: true,
    },
  );
  const modalConfirmButton = await page.waitForXPath(
    '//div[contains(@class, "ant-modal-footer")]/descendant::button/descendant::span[contains(text(), "OK")]/ancestor::button',
  );
  await modalConfirmButton.click();
  await page.waitForTimeout(3000);
};

const toggleFilePanel = async (page) => {
  const fileLog = await page.waitForXPath(
    '//header/descendant::li/descendant::span[contains(@class, "Layout_badge")]',
  );
  await fileLog.click();
  await page.waitForSelector('.ant-popover-inner-content');
};

const deleteFileFromCore = async (page, fileName) => {
  await selectCoreFile(page, fileName);
  await deleteAction(page);

  await page.waitForTimeout(2000);
  await toggleFilePanel(page);
  await checkFilePanelStatus(page, fileName);

  const deletedFile = await page.waitForXPath(
    `//tr[contains(@class, 'ant-table-row')]/descendant::span[contains(text(), '${fileName}')]`,
    { timeout: 15000, hidden: true },
  );
  expect(deletedFile).toBeNull();
};

const deleteFileFromGreenroom = async (page, fileName) => {
  await selectGreenroomFile(page, fileName);
  await deleteAction(page);

  await page.waitForTimeout(2000);
  await toggleFilePanel(page);
  await checkFilePanelStatus(page, fileName);
  // await page.waitForTimeout(2000);
  // await clickFileAction(page,'Refresh');

  const deletedFile = await page.waitForXPath(
    `//tr[contains(@class, 'ant-table-row')]/descendant::span[contains(text(), '${fileName}')]`,
    { timeout: 15000, hidden: true },
  );
  expect(deletedFile).toBeNull();
};

const waitForTimeHash = async (page, fileName) => {
  const xDuplicateFile = `//div[contains(@class, 'ant-tabs-tabpane-active')]/descendant::span[contains(text(), '${fileName}_')]`;
  await page.waitForXPath(xDuplicateFile, { timeout: 15000, visible: true });
  const [copiedFile] = await page.$x(xDuplicateFile);
  const timeHash = await page.evaluate(
    (ele) => ele.textContent.split('_')[1],
    copiedFile,
  );

  return timeHash;
};

const checkFilePanelStatus = async (page, fileName) => {
  let isActionFailed;
  let failedMessage;
  try {
    isActionFailed = await page.waitForXPath(
      `//div[contains(@class, "ant-popover-content")]/descendant::div[contains(@class, "ant-list-item-meta-content")]/descendant::span[contains(text(), "${fileName}")]/descendant::span[contains(text(), 'Failed')]`,
      { timeout: 2000 },
    );
    failedMessage = await isActionFailed.evaluate((ele) => ele.textContent);
  } catch {}
  if (isActionFailed) {
    return console.log(`${failedMessage}: ${fileName}`);
  }

  return new Promise((resolve) => {
    let fileActionComplete;
    const interval = setInterval(async () => {
      console.log(`Pending: "${fileName}"...`); // if the api service fails, this will interval will run forever. Console log provides feedback should that happen
      if (fileActionComplete === null) {
        resolve();
        clearInterval(interval);
      }
      try {
        fileActionComplete = await page.waitForXPath(
          // resolves to null when element is hidden
          `//div[contains(@class, "ant-popover-content")]/descendant::div[contains(@class, "ant-tabs-tabpane-active")]/descendant::div[contains(@class, "ant-list-item-meta-content")]/descendant::span[contains(text(), "${fileName}")]`,
          { hidden: true, timeout: 1000 },
        );
      } catch {}
    }, 15000);
  });
};

const cleanupGreenroom = async (page) => {
  // wait for file explorer to load
  await page.waitForXPath(
    `//div[contains(@class, 'FileExplorer_file_folder_path')]/span[2]`,
  );
  const files = await page.$x(
    '//div[contains(@class, "ant-table-content")]/descendant::tbody/descendant::tr/td[3]/descendant::span',
  );
  const fileNames = await Promise.all(
    files.map(
      async (file) => await page.evaluate((ele) => ele.innerText, file),
    ),
  );

  const selectAllGreenRoomFiles = await page.waitForXPath(
    '//div[contains(@id, "rawTable-sidePanel")]/descendant::thead/descendant::div[contains(@class, "ant-table-selection")]/descendant::input[not(@disabled)]',
    { visible: true },
  );
  await selectAllGreenRoomFiles.click();
  await deleteAction(page);
  await page.waitForTimeout(2000);

  await toggleFilePanel(page);
  const filesDeleting = [];
  for (let file of fileNames) {
    filesDeleting.push(checkFilePanelStatus(page, file));
  }
  await Promise.all(filesDeleting);

  for (let file of fileNames) {
    const deletedFile = await page.waitForXPath(
      `//tr[contains(@class, 'ant-table-row')]/descendant::span[contains(text(), '${file}')]`,
      { timeout: 15000, hidden: true },
    );
    expect(deletedFile).toBeNull();
  }
};

const cleanupCore = async (page) => {
  // wait for file explorer to load
  await page.waitForXPath(
    `//div[contains(@class, 'FileExplorer_file_folder_path')]/span[2]`,
  );
  const files = await page.$x(
    '//div[contains(@class, "ant-table-content")]/descendant::tbody/descendant::tr/td[3]/descendant::span',
  );
  const fileNames = await Promise.all(
    files.map(
      async (file) => await page.evaluate((ele) => ele.innerText, file),
    ),
  );

  const selectAllCoreFiles = await page.waitForXPath(
    `//div[contains(@role, 'tabpanel') and contains(@style, 'visibility: visible')]/descendant::div[contains(@id, "rawTable-sidePanel")]/descendant::thead/descendant::div[contains(@class, "ant-table-selection")]/descendant::input[not(@disabled)]`,
  );
  await selectAllCoreFiles.click();
  // unselect test folder
  await deleteAction(page);
  await page.waitForTimeout(2000);

  await toggleFilePanel(page);
  const filesDeleting = [];
  for (let file of fileNames) {
    filesDeleting.push(checkFilePanelStatus(page, file));
  }
  await Promise.all(filesDeleting);

  for (let file of fileNames) {
    const deletedFile = await page.waitForXPath(
      `//tr[contains(@class, 'ant-table-row')]/descendant::span[contains(text(), '${file}')]`,
      { timeout: 15000, hidden: true },
    );
    expect(deletedFile).toBeNull();
  }
};

const uploadAction = async (page) => {
  await clickFileAction(page, 'Upload');
};

const uploadFile = async (page, folderName, fileName) => {
  // wait for file explorer actions to load
  await page.waitForXPath(
    `//div[contains(@class, 'FileExplorer_file_folder_path')]/span[2]`,
  );
  await uploadAction(page);
  const uploadInputField = await page.waitForSelector('#form_in_modal_file');
  await uploadInputField.uploadFile(
    `${process.cwd()}/tests/uploads/${folderName}/${fileName}`,
  );
  await page.click('#file_upload_submit_btn');

  await toggleFilePanel(page);
  await checkFilePanelStatus(page, fileName);

  const uploadedFile = await page.waitForXPath(
    `//tr[contains(@class, 'ant-table-row')]/descendant::span[contains(text(), '${fileName}')]`,
    { timeout: 60000 },
  );
  expect(uploadedFile).toBeTruthy();
};

const uploadMultipleFiles = async (page, filePaths, fileNames) => {
  await page.waitForXPath(
    `//div[contains(@class, 'FileExplorer_file_folder_path')]/span[2]`,
  );

  await uploadAction(page);
  const uploadInputField = await page.waitForSelector('#form_in_modal_file');
  await uploadInputField.uploadFile(...filePaths);
  await page.click('#file_upload_submit_btn');

  const pendingUploads = [];
  for (let file of fileNames) {
    pendingUploads.push(checkFilePanelStatus(page, file));
  }
  await toggleFilePanel(page);

  await Promise.all(pendingUploads);

  const filePromises = [];
  for (let file of fileNames) {
    filePromises.push(
      page.waitForXPath(
        `//tr[contains(@class, 'ant-table-row')]/descendant::span[contains(text(), '${file}')]`,
        { timeout: 15000 },
      ),
    );
  }
  const expectedFiles = await Promise.all(filePromises); // waitForXPath will throw error if file not found
  expect(expectedFiles.length).toBe(filePaths.length);
};

const uploadFolder = async (page, folderName) => {
  // wait for file explorer actions to load
  await page.waitForXPath(
    `//div[contains(@class, 'FileExplorer_file_folder_path')]/span[2]`,
  );
  await createFolder(page, folderName);

  const uploadedFolder = await page.waitForXPath(
    `//tr[contains(@class, 'ant-table-row')]/descendant::span[contains(text(), '${folderName}')]`,
    { timeout: 60000 },
  );
  expect(uploadedFolder).toBeTruthy();
  await uploadedFolder.click();
  await page.waitForTimeout(3000);

  const folderFiles = fs.readdirSync(
    `${process.cwd()}/tests/uploads/${folderName}`,
  );
  const uploadPromises = [];
  for (let fileUpload of folderFiles) {
    await uploadAction(page);
    const uploadInputField = await page.waitForSelector('#form_in_modal_file');
    await uploadInputField.uploadFile(
      `${process.cwd()}/tests/uploads/${folderName}/${fileUpload}`,
    );

    await page.click('#file_upload_submit_btn');
    uploadPromises.push(checkFilePanelStatus(page, fileUpload));
  }
  // wait for files to be uploaded from file log
  await toggleFilePanel(page);
  await Promise.all(uploadPromises);

  const filePromises = [];
  for (let file of folderFiles) {
    filePromises.push(
      page.waitForXPath(
        `//tr[contains(@class, 'ant-table-row')]/descendant::span[contains(text(), '${file}')]`,
        { timeout: 15000 },
      ),
    );
  }
  const expectedFiles = await Promise.all(filePromises); // waitForXPath will throw error if file not found
  expect(expectedFiles.length).toBe(folderFiles.length);
};

const clickFileAction = async (page, actionText) => {
  await page.waitForXPath(
    '//div[contains(@class, "FileExplorer_file_explore_actions")]',
  );
  const actionBtnOutside = await page.$x(
    '//div[contains(@class, "FileExplorer_file_explore_actions")]//button//span[text()="' +
      actionText +
      '"]//parent::button',
  );
  console.log(
    '//div[contains(@class, "FileExplorer_file_explore_actions")]//button//span[text()="' +
      actionText +
      '"]//parent::button',
  );

  if (actionBtnOutside.length) {
    const showOutSide = await actionBtnOutside[0].evaluate((element) => {
      const style = window.getComputedStyle(element);
      return style && style.display !== 'none';
    });
    if (showOutSide) {
      // await actionBtnOutside[0].click();
      await actionBtnOutside[0].evaluate((ele) => ele.click());
      return;
    }
  }
  const moreBtn = await page.waitForXPath(
    '//div[contains(@class, "file_explorer_header_bar")]//button//span[contains(@class,"anticon-ellipsis")]//parent::button',
  );
  await moreBtn.click();
  const actionBtn = await page.waitForXPath(
    '//li[contains(@class,"ant-dropdown-menu-item")]//button//span[text()="' +
      actionText +
      '"]//parent::button',
  );
  await actionBtn.click();
};

const navigatePaginationAndFind = async (page, file) => {
  let targetFile;
  const nextPageLink = await page.waitForXPath(
    '//ul[contains(@class, "ant-pagination")]/li[@title="Next Page"]/a',
  );
  while (!targetFile) {
    console.log(`navigating through pagination and searching for ${file}`);
    try {
      targetFile = await page.waitForXPath(
        `//tr[contains(@class, 'ant-table-row')]/descendant::span[contains(text(), '${file}')]`,
        { timeout: 7500 },
      );
    } catch {
      await nextPageLink.click();
      await page.waitForXPath(
        '//div[contains(@class, "FileExplorer_files_raw_table")]/descendant::div[contains(@class, "ant-spin-blur")]',
        { hidden: true },
      );
    }
  }
  return targetFile;
};

module.exports = {
  waitForFileExplorer,
  refreshFileExplorer,
  toggleFilePanel,
  checkFilePanelStatus,
  navigateToCore,
  navigateInsideFolder,
  selectGreenroomFile,
  selectCoreFile,
  selectFileProperties,
  findUserFolderDestination,
  createFolder,
  copyAction,
  copyFileToCore,
  requestToCore,
  deleteAction,
  deleteFileFromCore,
  deleteFileFromGreenroom,
  cleanupGreenroom,
  cleanupCore,
  waitForTimeHash,
  fileName,
  folderName,
  coreFolderName,
  coreSubFolderName,
  uploadAction,
  uploadFile,
  uploadMultipleFiles,
  uploadFolder,
  clickFileAction,
  navigatePaginationAndFind,
};
