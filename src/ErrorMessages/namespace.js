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
const common = {
  // for app.js
  getDataset: 'common.getDataset',
  listUsersContainersPermission: 'common.listUsersContainersPermission',
  emailFileList: 'common.emailFileList',
  logout: 'common.logout',
};
const login = {
  auth: 'login.auth',
  refresh: 'login.refresh',
  parseInviteHashAPI: 'login.parseInviteHashAPI',
  forgotPassword: 'login.forgotPassword',
  resetForgottenPassword: 'login.resetForgottenPassword',
  checkToken: 'login.checkToken',
  forgotUsername: 'login.forgotUsername',
};
const landing = {
  createProject: 'landing.createProject',
};

const project = {
  files: {
    uploadFileApi: 'project.files.uploadFileApi',
    uploadRequestFail: 'project.files.uploadRequestFail',
    getChildrenDataset: 'project.files.getChildrenDataset',
    traverseFoldersContainersAPI: 'project.files.traverseFoldersContainersAPI',
    getFilesByTypeAPI: 'project.files.getFilesByTypeAPI',
    downloadFilesAPI: 'project.files.downloadFilesAPI',
    processingFile: 'project.files.processingFile',
    preUpload: 'project.files.preUpload',
    combineChunk: 'project.files.combineChunks',
  },
};
const dataset = {
  files: {
    downloadFilesAPI: 'dataset.files.downloadFilesAPI',
  },
};

const selfRegister = {
  selfRegistration: 'selfRegister.selfRegistration',
};

const teams = {
  checkEmailExistAPI: 'teams.checkEmailExistAPI',
  inviteUser: 'teams.inviteUser',
  addUsertoDataSet: 'team.addUsertoDataSet',
  getUsersOnDataset: 'teams.getUsersOnDataset',
  changeRoleInDataset: 'teams.changeRoleInDataset',
  removeUserFromDataset: 'teams.removeUserFromDataset',
  restoreUserFromDataset: 'teams.restoreUserFromDataset',
  checkUserPlatformRole: 'teams.checkUserPlatformRole',
};

const contactUs = {
  contactUsAPI: 'contactUs.contactUsAPI',
};

const userManagement = {
  inviteUserApi: 'userManagement.inviteUserApi',
  getPortalUsers: 'userManagement.getPortalUsers',
  updateUserStatusAPI: 'userManagement.updateUserStatusAPI',
  getInvitationsAPI: 'userManagement.getInvitationsAPI',
  getServiceRequestAPI: 'userManagement.getServiceRequestAPI',
};

const announcement = {
  getAnnouncementApi: 'announcement.getAnnouncementApi',
  getUserAnnouncementApi: 'announcement.getUserAnnouncementApi',
};

const manifest = {
  getManifestById: 'manifest.getManifestById',
};

const fileExplorer = {
  createFolder: 'fileExplorer.createFolder',
};

export default {
  common,
  login,
  landing,
  project,
  dataset,
  selfRegister,
  teams,
  contactUs,
  userManagement,
  announcement,
  manifest,
  fileExplorer,
};
