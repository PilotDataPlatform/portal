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
import { preUploadApi } from '../../APIs';
import { tokenManager } from '../../Service/tokenManager';
import { objectKeysToSnakeCase } from '../';
import { getPath } from './getPath';
/**
 * get the jobId the resumable_identifier from the backend before upload
 * @param {string} projectCode
 * @param {string} operator the uploader
 * @param {"AS_FOLDER" | "AS_FILE"} jobType
 * @param {string[]} folderTags
 * @param {file[]} fileList resumableFilename is the filename, resumableRelativePath is the path, with no slash(/) on the start, and also No ending with filename
 * @param {string} uploadMessage
 */
export function preUpload(
  projectCode,
  operator,
  jobType,
  folderTags,
  files,
  uploadMessage,
  toExistingFolder,
  folderPath,
) {
  let currentFolderName = '';
  const filesInfo = files.map((file) => {
    let relativePath = getPath(file.originFileObj.webkitRelativePath);
    currentFolderName = relativePath.split('/')[0];
    if (toExistingFolder) {
      if (relativePath === '') {
        relativePath = folderPath;
      } else {
        relativePath = folderPath + '/' + relativePath;
      }
    }
    const fileInfo = {
      resumableFilename: file.originFileObj.name,
      resumableRelativePath: relativePath,
    };
    return fileInfo;
  });
  let currentFolderNode = '';
  if (jobType === 'AS_FOLDER') {
    if (folderPath) {
      currentFolderNode = folderPath + '/' + currentFolderName;
    } else {
      currentFolderNode = currentFolderName;
    }
  }
  const param = {
    projectCode,
    operator,
    jobType,
    folderTags,
    data: filesInfo,
    uploadMessage,
    currentFolderNode,
  };

  const sessionId = tokenManager.getCookie('sessionId');
  return preUploadApi(objectKeysToSnakeCase(param), sessionId);
}
