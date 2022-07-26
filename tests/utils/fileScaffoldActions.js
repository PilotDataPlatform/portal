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
/**
 * These actions are used to prepare / clean files for test cases
 * 1. prepare file and upload before the test cases is running
 * 2. clean file after the test cases is done
 */
const { selectGreenroomFile, deleteAction } = require('./greenroomActions');
const fs = require('fs');
const moment = require('moment-timezone');
const createFolder = async function (page, folderNamePara = null) {
  const folderName = folderNamePara ? folderNamePara : `${moment().unix()}`;
  await page.waitForSelector('#files_table > div > div > table > tbody > tr');
  const newFolderBtn = await page.waitForXPath(
    '//button//span[contains(text(), "New Folder")]',
  );
  await newFolderBtn.click();
  await page.type('#folderName', folderName);
  const createFolderBtn = await page.waitForXPath(
    '//div[@class="ant-modal-footer"]//button//span[contains(text(), "Create")]',
  );
  await createFolderBtn.click();
  await page.waitForTimeout(2000);
  try {
    const closeBtn = await page.waitForXPath(
      '//span[@class="ant-modal-close-x"]',
    );
    await closeBtn.click();
  } catch (e) {
    console.log('close btn not found');
  }
  return folderName;
};
const clickIntoFolder = async function (page, folderName) {
  const folderNameElm = await page.waitForXPath(
    `//table//td//span[text()="${folderName}"]`,
  );
  await folderNameElm.click();
};
const generateLocalFile = async function (sourcePath, sourceFile) {
  //get extension
  let fileArr = sourceFile.split('.');
  let ext = fileArr.length ? fileArr[fileArr.length - 1] : null;
  const destFileName = `${moment().unix()}${ext ? '.' + ext : ''}`;
  console.log('destFileName', destFileName);
  //copy file and rename
  try {
    await fs.copyFileSync(
      `${sourcePath}/${sourceFile}`,
      `${process.cwd()}/tests/uploads/temp/${destFileName}`,
    );
    return destFileName;
  } catch (err) {
    console.log(err);
    return null;
  }
};
const removeLocalFile = async function (fileName) {
  try {
    await fs.rmSync(`${process.cwd()}/tests/uploads/temp/${fileName}`);
  } catch (err) {
    console.log('no file found under temp directory : ' + fileName);
  }
};
const removeExistFile = async function (page, fileName) {
  await page.waitForTimeout(6000);
  let searchBtn = await page.waitForXPath(
    "//span[contains(@class,'search')]//parent::span",
  );
  await searchBtn.click();
  let nameInput = await page.waitForXPath(
    '//div[contains(@class, "ant-dropdown")]//input[@placeholder="Search name"]',
    { visible: true },
  );
  await nameInput.type(fileName);
  let searchFileBtn = await page.waitForXPath(
    '//div[contains(@class, "ant-dropdown")]//button[contains(@class, "ant-btn-primary")]',
    { visible: true },
  );
  await searchFileBtn.click();
  await page.waitForTimeout(2000);
  let fileInTable = await page.$x(
    `//td[@class='ant-table-cell']//span[text()='${fileName}']`,
  );

  if (fileInTable.length !== 0) {
    await selectGreenroomFile(page, fileName);
    await deleteAction(page);
  }
};

module.exports = {
  createFolder,
  clickIntoFolder,
  generateLocalFile,
  removeExistFile,
  removeLocalFile,
};
