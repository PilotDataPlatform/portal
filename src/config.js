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
const BRANDING_PREFIX = process.env.REACT_APP_BRANDING_PATH || '';
const PORTAL_PREFIX = process.env.REACT_APP_PORTAL_PATH || '';
const DOWNLOAD_PREFIX_V2 = process.env.REACT_APP_DOWNLOAD_URL_V2 || '';
const DOWNLOAD_PREFIX_V1 = process.env.REACT_APP_DOWNLOAD_URL_V1 || '';
const DOWNLOAD_GR = process.env.REACT_APP_DOWNLOAD_GR || '';
const DOWNLOAD_CORE = process.env.REACT_APP_DOWNLOAD_CORE || '';
const KEYCLOAK_REALM = process.env.REACT_APP_KEYCLOAK_REALM;
const DEFAULT_AUTH_URL = process.env.REACT_APP_DEFAULT_AUTH_URL || '';
const API_PATH = process.env.REACT_APP_API_PATH || '';
const UPLOAD_URL = process.env.REACT_APP_UPLOAD_URL || '';
const PLATFORM = process.env.REACT_APP_PLATFORM || '';
const DOMAIN = process.env.REACT_APP_DOMAIN || '';
const SUPPORT_EMAIL = process.env.REACT_APP_SUPPORT_EMAIL || '';
const PROXY_ROUTE = process.env.REACT_APP_PROXY_ROUTE || '';
const XWIKI = process.env.REACT_APP_XWIKI || '';
const ORGANIZATION_PORTAL_DOMAIN =
  process.env.REACT_APP_ORGANIZATION_PORTAL_DOMAIN;
const PLATFORM_INTRODUCTION_URL =
  process.env.REACT_APP_PLATFORM_INTRODUCTION_URL;
const ORGANIZATION_DOMAIN = process.env.REACT_APP_ORGANIZATION_DOMAIN;

if (!KEYCLOAK_REALM) throw new Error(`keycloak realm is empty`);

module.exports = {
  BRANDING_PREFIX,
  PORTAL_PREFIX,
  DOWNLOAD_PREFIX_V2,
  DOWNLOAD_PREFIX_V1,
  DOWNLOAD_GR,
  DOWNLOAD_CORE,
  KEYCLOAK_REALM,
  DEFAULT_AUTH_URL,
  API_PATH,
  UPLOAD_URL,
  PLATFORM,
  DOMAIN,
  SUPPORT_EMAIL,
  PROXY_ROUTE,
  XWIKI,
  ORGANIZATION_PORTAL_DOMAIN,
  PLATFORM_INTRODUCTION_URL,
  ORGANIZATION_DOMAIN,
};
