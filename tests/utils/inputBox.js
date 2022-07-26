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
async function clearInput(page, selector) {
  try {
    const input = await page.waitForSelector(selector);
    const value = await page.$eval(selector, (input) => input.value);
    if (value === '') {
      return;
    }
    await input.click({ clickCount: 3 }); // selects entire input field
    await page.keyboard.press('Backspace');
  } catch (err) {
    console.log(err);
  }
}

async function clearSelector(page, selector) {
  try {
    await page.click(selector);
    const tagsLength = await page.evaluate((selector) => {
      const res = document.querySelectorAll(selector + ' .ant-tag').length;
      return res;
    }, selector);
    for (let i = 0; i < tagsLength; i++) {
      await page.keyboard.press('Backspace');
    }
  } catch (err) {
    console.log(err);
  }
}
module.exports = { clearInput, clearSelector };
