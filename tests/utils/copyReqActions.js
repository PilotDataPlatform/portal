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
exports.prepareActions = async (page, file = false, emptyFolder = false) => {
  let checkBox;
  if (file) {
    checkBox = await page.waitForXPath(
      '//span[@class="anticon anticon-file"]//ancestor::tr//span[@class="ant-checkbox"]',
    );
  } else {
    if (emptyFolder) {
      checkBox = await page.waitForXPath(
        '//span[text()="test-empty-folder"]//ancestor::tr//span[@class="ant-checkbox"]',
      );
    } else {
      checkBox = await page.waitForXPath(
        '//span[text()="test-folder-files"]//ancestor::tr//span[@class="ant-checkbox"]',
      );
    }
  }
  await checkBox.click();
};
exports.checkFile = async (page, fileName = null) => {
  let checkBox;
  if (!fileName) {
    checkBox = await page.waitForXPath(
      '//span[@class="anticon anticon-file"]//ancestor::tr//span[@class="ant-checkbox"]',
    );
  } else {
    checkBox = await page.waitForXPath(
      '//span[text()="' +
        fileName +
        '"]//ancestor::tr//span[@class="ant-checkbox"]',
    );
  }
  await checkBox.click();
};

exports.submitCopyRequest = async (page) => {
  const copyToRequestBtn = await page.waitForXPath(
    '//button[@type="button" and contains(span[2], "Request to Core")]/span[2]',
  );
  await copyToRequestBtn.click();
  const selectDestinationBtn = await page.waitForXPath(
    '//button[@data-id="select_detination_btn"]',
  );
  await selectDestinationBtn.click();
  const corePath = await page.waitForXPath('//span[@title="Core"]');
  await corePath.click();
  const adminPath = await page.waitForXPath('//span[@title="admin"]');
  await adminPath.click();
  const testFolder = await page.waitForXPath(
    '//span[@title="admin"]//ancestor::div[contains(@class,"ant-tree-treenode")]//following-sibling::div[1]//span[@class="ant-tree-title"]',
  );
  await testFolder.click();
  const selectBtn = await page.waitForXPath(
    '//button[@data-id="select_path_btn"]',
  );
  await selectBtn.click();
  await page.type('.request2core_modal #notes', 'This is a test note');
  const btnConfirm = await page.waitForSelector(
    '.request2core_modal #btn_confirm',
  );
  await btnConfirm.click();
  await page.waitForTimeout(3000);
};
