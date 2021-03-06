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
import { combineReducers } from 'redux';
import datasetList from './datasetList';
import userList from './userList';
import { tags } from './tags';
import { metadatas } from './metadatas';
import { personalDatasetId } from './personalDatasetId';
import containersPermission from './containersPermission';
import role from './role';
import uploadList from './uploadList';
import newUploadIndicator from './newUploadIndicator';
import { USER_LOGOUT } from '../actionTypes';
import tokenAutoRefresh from './tokenAutoRefresh';
import downloadList from './downloadList';
import clearId from './clearId';
import username from './username';
import isLogin from './isLogin';
import successNum from './successNum';
import downloadClearId from './downloadClearId';
import panelActiveKey from './panelActiveKey';
import project from './currentProject';
import email from './userEmail';
import copy2CoreList from './copy2CoreList';
import events from './events';
import isKeycloakReady from './isKeycloakReady';
import isReleaseNoteShown from './isReleaseNoteShown';
import deletedFileList from './deletedFileList';
import uploadFileManifest from './uploadFileManifest';
import fileExplorer from './fileExplorer';
import serviceRequestRedDot from './serviceRequest';
import user from './user';
import { datasetData } from './datasetData';
import { myDatasetList } from './myDatasetList';
import { datasetInfo } from './datasetInfo';
import { datasetFileOperations } from './datasetFileOperations';
import { schemaTemplatesInfo } from './schemaTemplatesInfo';
import { fileExplorerTable } from './fileExplorerTable';
import request2Core from './request2Core';
import notifications from './notification';
import canvasPage from './canvasPage';
import virtualFolders from './virtualFolders';


const appReducer = combineReducers({
  datasetList,
  userList,
  tags,
  metadatas,
  personalDatasetId,
  containersPermission,
  role,
  uploadList,
  newUploadIndicator,
  tokenAutoRefresh,
  project,
  copy2CoreList,
  downloadList,
  clearId,
  isLogin,
  username,
  successNum,
  downloadClearId,
  panelActiveKey,
  email,
  events,
  isKeycloakReady,
  isReleaseNoteShown,
  deletedFileList,
  uploadFileManifest,
  fileExplorer,
  serviceRequestRedDot,
  user,
  datasetData,
  myDatasetList,
  datasetInfo,
  datasetFileOperations,
  schemaTemplatesInfo,
  fileExplorerTable,
  request2Core,
  notifications,
  canvasPage,
  virtualFolders
});

const rootReducer = (state, action) => {
  if (action.type === USER_LOGOUT) {
    state = {};
  }
  return appReducer(state, action);
};

export default rootReducer;
