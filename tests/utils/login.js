const { admin, collaborator, disabletest, contributor } = require('../users');
const dotenv = require('dotenv');
/**
 * login
 * @param {*} getPage
 */

dotenv.config();
async function login(page, role) {
  const username =
    role === 'admin'
      ? admin.username
      : role === 'disabletest'
      ? disabletest.username
      : role == 'contributor'
      ? contributor.username
      : collaborator.username;
  const password =
    role === 'admin'
      ? admin.password
      : role === 'disabletest'
      ? disabletest.password
      : role == 'contributor'
      ? contributor.password
      : collaborator.password;

  try {
    await page.waitForSelector('.ant-btn.ant-btn-primary.ant-btn-sm', {
      timeout: 3000,
    });
    await page.click('.ant-btn.ant-btn-primary.ant-btn-sm');
  } catch (err) {
    console.log('no popup for cookie banner');
  }

  await page.waitForSelector('#auth_login_btn');
  await page.click('#auth_login_btn');

  await page.type('#username', username);
  await page.type('#password', password);
  await page.click('#kc-login');

  await page.waitForSelector('#header_username');
  const usernameDom = await page.$('#header_username');
  /* istanbul ignore next */
  const usernameDomText = await page.evaluate(
    (element) => element.textContent,
    usernameDom,
  );
  await expect(usernameDomText).toMatch(username);
}

async function logout(page) {
  const headerUsernameBtn = await page.waitForSelector('#header_username');
  if (headerUsernameBtn) {
    await page.$eval('#header_username', (ele) => {
      ele.click();
    });
  }
  const headerLogoutBtn = await page.waitForSelector('#header_logout');
  if (headerLogoutBtn) {
    await page.$eval('#header_logout', (ele) => {
      ele.click();
    });
  }
  await page.waitForSelector('.ant-modal-body .ant-btn.ant-btn-primary');
  await page.click('.ant-modal-body .ant-btn.ant-btn-primary');

  await page.waitForTimeout(3500);
  const url = new URL(await page.url());

  console.log(url);
  console.log(process.env.REACT_APP_PORTAL_PATH + '/login');
  console.log(process.env.REACT_APP_TEST_ENV === 'dev');
  console.log(url.pathname === process.env.REACT_APP_PORTAL_PATH + '/login');

  const pathname =
    process.env.REACT_APP_TEST_ENV === 'dev'
      ? url.pathname === process.env.REACT_APP_PORTAL_PATH ||
        url.pathname === '/'
      : url.pathname === process.env.REACT_APP_PORTAL_PATH ||
        url.pathname === process.env.REACT_APP_PORTAL_PATH + '/login';
  console.log(pathname);
  await expect(pathname).toBeTruthy();
}

module.exports = { login, logout };
