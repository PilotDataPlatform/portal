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
import _ from 'lodash';

const countStatus = (fileActions) => {
  let runningCount = 0;
  let errorCount = 0;
  let finishCount = 0;
  let initCount = 0;
  let cancelCount = 0;

  for (const fileAction of fileActions) {
    switch (fileAction.status) {
      case 'RUNNING': {
        runningCount++;
        break;
      }
      case 'ERROR': {
        errorCount++;
        break;
      }
      case 'FINISH': {
        finishCount++;
        break;
      }
      case 'INIT': {
        initCount++;
        break;
      }
      case 'CANCELLED': {
        cancelCount++;
        break;
      }
      default: {
      }
    }
  }

  return [runningCount, errorCount, finishCount, initCount, cancelCount];
};

const parsePath = (payload) => {
  let location = payload.location;
  let res = '';
  if (location) {
    location = _.replace(location, 'minio://', '');
    const url = new URL(location);
    const pathName = url.pathname;
    let pathArr = _.trimStart(pathName, '/').split('/');
    pathArr = pathArr.slice(2);
    res = decodeURIComponent(pathArr.join('/'));
  } else {
    const relativePath = _.trimStart(payload.folderRelativePath, '/');
    let pathArr = relativePath.split('/');
    pathArr = pathArr.slice(1);
    res = decodeURIComponent(pathArr.join('/') + '/' + payload.name);
  }
  return _.trimStart(res, '/');
};

export { fetchFileOperations } from '../../DatasetData/Components/DatasetDataExplorer/utility';

export { countStatus, parsePath };
