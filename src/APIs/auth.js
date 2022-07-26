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
import { KEYCLOAK_REALM } from '../config';
import { serverAxios as axios } from './config';

function login(data) {
  return axios({
    url: '/users/auth',
    method: 'POST',
    data: { ...data, realm: KEYCLOAK_REALM },
  });
}

function refreshTokenAPI(data) {
  return axios({
    url: '/users/refresh',
    method: 'POST',
    data: { ...data, realm: KEYCLOAK_REALM },
  });
}

function resetPasswordAPI(data) {
  return axios({
    url: '/users/password',
    method: 'PUT',
    data: { ...data, realm: KEYCLOAK_REALM },
  });
}

/* send reset password email to user
 * @param {string} username
 */
function sendResetPasswordEmailAPI(username, cancelToken) {
  return axios({
    url: '/users/reset/send-email',
    method: 'POST',
    data: { ...username, realm: KEYCLOAK_REALM },
    cancelToken,
  });
}

/* send username through email
 * @param {string} email
 */
function sendUsernameEmailAPI(email, cancelToken) {
  return axios({
    url: '/users/reset/send-username',
    method: 'POST',
    data: { ...email, realm: KEYCLOAK_REALM },
    cancelToken,
  });
}

/* Update password
 * @param {object} data: should include token, password, password_confirm
 */
function resetForgottenPasswordAPI(data, cancelToken) {
  return axios({
    url: '/users/reset/password',
    method: 'POST',
    data: { ...data, realm: KEYCLOAK_REALM },
    cancelToken,
  });
}

/* Check reset token
 * @param {string} token
 */
function checkTokenAPI(token) {
  return axios({
    url: `/users/reset/check-token?token=${token}&realm=${KEYCLOAK_REALM}`,
    method: 'GET',
  });
}

function lastLoginAPI(username) {
  return axios({
    url: '/v1/users/lastlogin',
    method: 'PUT',
    data: {
      username,
    },
  });
}

export {
  login,
  refreshTokenAPI,
  resetPasswordAPI,
  sendResetPasswordEmailAPI,
  sendUsernameEmailAPI,
  resetForgottenPasswordAPI,
  checkTokenAPI,
  lastLoginAPI,
};
