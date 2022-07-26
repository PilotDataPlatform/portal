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
import {
  updateClearIdCreator,
  setContainersPermissionCreator,
  cleanDatasetCreator,
  clearDownloadListCreator,
  setMetadatasCreator,
  setNewUploadIndicator,
  setPersonalDatasetIdCreator,
  setRefreshModal,
  setUserRoleCreator,
  setTagsCreator,
  setUploadListCreator,
  setUserListCreator,
} from '../Redux/actions';
import reduxActionWrapper from './reduxActionWrapper';

const [
  updateClearIdDispatcher,
  setContainersPermissionDispatcher,
  cleanDatasetDispatcher,
  clearDownloadListDispatcher,

  setMetadatasDispatcher,
  setNewUploadIndicatorDispatcher,
  setPersonalDatasetIdDispatcher,
  setRefreshModalDispatcher,
  setUserRoleDispatcher,
  setTagsDispatcher,
  setUploadListDispatcher,
  setUserListDispatcher,
] = reduxActionWrapper([
  updateClearIdCreator,
  setContainersPermissionCreator,
  cleanDatasetCreator,
  clearDownloadListCreator,
  setMetadatasCreator,
  setNewUploadIndicator,
  setPersonalDatasetIdCreator,
  setRefreshModal,
  setUserRoleCreator,
  setTagsCreator,
  setUploadListCreator,
  setUserListCreator,
]);
/**
 * reset all redux states to the init
 * @param {boolean} shouldClearUsername if true, clean the username. by default true. only if login different account in another tab will set this false;
 */
function resetReduxState() {
  updateClearIdDispatcher('');
  setContainersPermissionDispatcher(null);
  cleanDatasetDispatcher();
  clearDownloadListDispatcher();
  setMetadatasDispatcher({ metadatas: null });
  setNewUploadIndicatorDispatcher(0);
  setPersonalDatasetIdDispatcher(null);
  setRefreshModalDispatcher(false);
  setUserRoleDispatcher(null);
  setTagsDispatcher(null);
  setUploadListDispatcher([]);
  setUserListDispatcher(null);
}

export { resetReduxState };
