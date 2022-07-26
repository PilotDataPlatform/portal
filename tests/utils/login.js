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
  const pathname =
    process.env.REACT_APP_TEST_ENV === 'dev'
      ? url.pathname === process.env.REACT_APP_PORTAL_PATH ||
        url.pathname === '/' ||
        url.pathname === '/login'
      : url.pathname === process.env.REACT_APP_PORTAL_PATH ||
        url.pathname === process.env.REACT_APP_PORTAL_PATH + '/login';

  await expect(pathname).toBeTruthy();
}

module.exports = { login, logout };
