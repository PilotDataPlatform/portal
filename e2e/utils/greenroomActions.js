const navigateToCore = async (page) => {
  await page.waitForXPath('//div[contains(@class, "FileExplorer_file_dir")]');
  const home = await page.$x(
    '//span[contains(text(), "Home") and contains(@class, "ant-tree-title")]',
  );
  await home[1].click();
};

const selectGreenroomFile = async (page, fileName) => {
  const fileCheckbox = await page.waitForXPath(
    `//tr[contains(@class, 'ant-table-row')]/descendant::span[contains(text(), '${fileName}')]/ancestor::tr/descendant::input`,
  );
  await fileCheckbox.click();
};

const selectCoreFile = async (page, fileName) => {
  const fileCheckbox = await page.waitForXPath(
    `//div[contains(@class, 'ant-tabs-tabpane-active')]/descendant::span[contains(text(), '${fileName}')]/ancestor::tr/descendant::input`,
  );
  await fileCheckbox.click();
};

const copyFileToCore = async (page, fileName, username) => {
  await selectGreenroomFile(page, fileName);
  // click on copy
  await page.click('span[aria-label="copy"]');
  const confirmCopy = await page.waitForXPath(
    '//button/span[contains(text(), "Copy to Core")]/parent::button',
  );
  await confirmCopy.click();

  // type in verification code
  const xCode = await page.waitForXPath(
    '//div[contains(@class, "ant-modal-body")]/descendant::b',
  );
  const verificationCode = await page.evaluate(
    (xCode) => xCode.textContent,
    xCode,
  );
  await page.type('input[placeholder="Enter Code"]', verificationCode);

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

const deleteFileFromCore = async (page, fileName) => {
  await selectCoreFile(page, fileName);

  const [ellipsis] = await page.$x(
    '//div[contains(@class, "ant-tabs-tabpane-active")]/descendant::span[contains(@aria-label, "ellipsis")]/parent::button',
  );
  await ellipsis.hover();
  const deleteFile = await page.waitForXPath(
    '//div[contains(@class, "ant-dropdown FileExplorer_drop-down")]/descendant::span[contains(@aria-label, "delete")]/parent::button',
  );
  await deleteFile.click();
  await page.waitForSelector('.ant-modal-content');
  await page.click('.ant-modal-footer button.ant-btn-primary');
};

const deleteFileFromGreenroom = async (page, fileName) => {
  await selectGreenroomFile(page, fileName);

  const deleteButton = await page.waitForXPath(
    '//div[contains(@id, "rawTable-sidePanel")]/descendant::span[contains(text(), "Delete")]/parent::button',
  );
  await deleteButton.click();
  await page.waitForXPath(
    '//div[contains(@class, "ant-modal-title") and contains(text(), "Delete Files")]',
  );
  const modalConfirmButton = await page.waitForXPath(
    '//div[contains(@class, "ant-modal-footer")]/descendant::button/descendant::span[contains(text(), "OK")]/ancestor::button',
  );
  await modalConfirmButton.click();
};

module.exports = {
  navigateToCore,
  selectGreenroomFile,
  selectCoreFile,
  copyFileToCore,
  deleteFileFromCore,
  deleteFileFromGreenroom,
};
