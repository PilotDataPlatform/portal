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
const userAuthLogout = {
  RECEIVED_LOGOUT: 'RECEIVED_LOGOUT',
  RECEIVED_LOGIN: 'RECEIVED_LOGIN',
  TOKEN_EXPIRATION: 'TOKEN_EXPIRATION',
  LOGOUT_REFRESH_MODAL:'LOGOUT_REFRESH_MODAL',
  LOGOUT_HEADER:'LOGOUT_HEADER',
  KEYCLOAK_LOGOUT:"KEYCLOAK_LOGOUT",
  LOADING_TIMEOUT:"LOADING_TIMEOUT",
};

Object.entries(userAuthLogout).forEach(([key, value]) => {
  userAuthLogout[key] = 'USER_AUTH_' + value;
});

export { userAuthLogout };
