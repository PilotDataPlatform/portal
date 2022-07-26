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
import { fileUpload, uploadStarter } from './fileUpload';
import reduxActionWrapper from './reduxActionWrapper';
import { objectKeysToCamelCase, objectKeysToSnakeCase } from './caseConvert';
import getChildrenTree from './getChildrenTree';
import protectedRoutes from './protectedRoutes';
import { getTags } from './tagsDisplay';
import { validateEmail } from './tokenRefresh';
import {
  sleep,
  getFileSize,
  trimString,
  currentBrowser,
  toFixedNumber,
} from './common';
import { useCurrentProject, withCurrentProject } from './useCurrentProject';
import { usePrevious } from './usePrevious';
import { useIsMount } from './useIsMount';
import { validateTag } from './validateTag';
import { formatRole, convertRole } from './roleConvert';
import {
  convertUTCDateToLocalDate,
  formatDate,
  timeConvert,
  timezone,
  curTimeZoneOffset,
} from './timeCovert';
import { partialString } from './column';
import { displayTitle, nestedLoop } from './fileTree';
import { fileNameOrPathDisplay } from './fileNameOrPathDisplay';
import { getHighlightedText, hightLightCaseInsensitive } from './highlight';

import {
  checkIsVirtualFolder,
  checkUserHomeFolder,
  checkRootFolder,
  checkGreenAndCore,
} from './panelKey';

import { convertToFileSizeInUnit, setLabelsDate, getCurrentYear } from './cavasCharts';
export { useQueryParams } from './useQueryParams';
export {
  fileUpload,
  uploadStarter,
  reduxActionWrapper,
  objectKeysToCamelCase,
  objectKeysToSnakeCase,
  getChildrenTree,
  protectedRoutes,
  validateEmail,
  useCurrentProject,
  withCurrentProject,
  sleep,
  getFileSize,
  useIsMount,
  validateTag,
  formatRole,
  convertRole,
  convertUTCDateToLocalDate,
  curTimeZoneOffset,
  timeConvert,
  formatDate,
  timezone,
  trimString,
  partialString,
  fileNameOrPathDisplay,
  displayTitle,
  nestedLoop,
  getHighlightedText,
  hightLightCaseInsensitive,
  currentBrowser,
  toFixedNumber,
  checkIsVirtualFolder,
  checkUserHomeFolder,
  checkRootFolder,
  checkGreenAndCore,
  getTags,
  usePrevious,
  convertToFileSizeInUnit,
  setLabelsDate,
  getCurrentYear,
};
export { randomTxt } from './randomTxt';
export { logout, refresh, login } from './keycloakActions';
export {
  actionType,
  broadcastAction,
  keepAlive,
  debouncedBroadcastAction,
} from './triggerAction';
