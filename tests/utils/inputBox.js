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
