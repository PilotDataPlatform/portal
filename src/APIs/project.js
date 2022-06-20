import { serverAxios, axios } from './config';
import { objectKeysToCamelCase, objectKeysToSnakeCase } from '../Utility';
import _, { result } from 'lodash';
import { keycloak } from '../Service/keycloak';

function getUserProjectActivitiesAPI(params) {
  return serverAxios({
    url: '/v1/user/events',
    method: 'GET',
    params,
  });
}

/**
 * Get all the projects
 *
 * @returns projects[]
 * @IRDP-432
 */
async function getDatasetsAPI(params = {}) {
  if (params['tags']) {
    params['tags'] = params['tags'].join(',');
  }
  const res = await serverAxios({
    url: '/v1/containers/',
    method: 'GET',
    params: objectKeysToSnakeCase(params),
  });
  if (res.data.result && res.data.result.length) {
    res.data.result = res.data.result.map((v) => {
      v.globalEntityId = v.id;
      return v;
    });
  }
  return res;
}

/**
 * Create a project
 *
 * @param {object} data
 * @param {{cancelFunction:()=>void}} cancelAxios the obj containns the function to cancel the serverAxios api calling
 * @returns success/fail
 * @IRDP-432
 */
function createProjectAPI(data, cancelAxios) {
  const CancelToken = axios.CancelToken;
  const url = `/v1/projects`;
  return serverAxios({
    url: url,
    method: 'POST',
    data,
    timeout: 60 * 1000,
    cancelToken: new CancelToken(function executor(c) {
      // An executor function receives a cancel function as a parameter
      cancelAxios.cancelFunction = c;
    }),
  });
}

/**
 * get children datasets
 *
 * @param {object} datasetId parent datset
 * @returns {array} child datasets
 * @IRDP-456
 */
function getChildrenAPI(datasetId) {
  return serverAxios({
    url: `/v1/containers/${datasetId}/relations/children`,
    method: 'GET',
  });
}

/**
 * query datasets with name, metadata, tags, etc
 * ticket-92
 *
 * @param {object} data
 */
function queryDatasetAPI(data) {
  return serverAxios({
    url: '/v1/containers/queries',
    method: 'POST',
    data,
  });
}

function getTagsAPI() {
  return serverAxios({
    url: `/v1/containers/?type=tag`,
  });
}

function getSystemTagsAPI(projectCode) {
  return serverAxios({
    url: `/v1/system-tags?project_code=${projectCode}`,
  });
}

function getMetadatasAPI() {
  return serverAxios({
    url: `/v1/containers/?type=metadata`,
  });
}

/**
 * change a user's role on a dataset, from old role to new role
 *
 * @param {string} username
 * @param {number} datasetId
 * @param {object} roles
 */
function changeUserRoleInDatasetAPI(username, projectGeid, roles) {
  return serverAxios({
    url: `/v1/containers/${projectGeid}/users/${username}`,
    data: roles,
    method: 'put',
  });
}

function addUserToProjectAPI(username, projectGeid, role) {
  return serverAxios({
    url: `/v1/containers/${projectGeid}/users/${username}`,
    data: { role },
    method: 'POST',
  });
}

/**
 * remove a user from a container
 *
 * @param {string} username
 * @param {number} datasetId
 */
function removeUserFromDatasetApi(username, projectGeid) {
  return serverAxios({
    url: `/v1/containers/${projectGeid}/users/${username}`,
    method: 'DELETE',
  });
}

/**
 * given the dataset id, get the children datasets
 *
 * @param {number} datasetId the dataset id
 */
function getChildrenDataset(datasetId) {
  return serverAxios({
    url: `/v1/containers/${datasetId}/relations/children`,
  });
}

/**
 *  get the the current user's personal dataset id
 * ticket-157
 * @param {number} username
 */
function getPersonalDatasetAPI(username) {
  return serverAxios({
    url: `/v1/users/${username}/default`,
  });
}

/**
 * create a personal dataset
 * ticket-157
 * @param {number} username
 */
function createPersonalDatasetAPI(username) {
  return serverAxios({
    url: `/v1/users/${username}/default`,
    method: 'POST',
  });
}

/**
 * This API allows the member to all files, containers and folders under specific container.
 * ticket-165
 * @param {number} containerId
 */
function traverseFoldersContainersAPI(containerId) {
  return serverAxios({
    url: `/v1/files/folders`,
    params: { container_id: containerId, trash_can: true },
  });
}

async function listUsersContainersPermission(username, data) {
  const res = await serverAxios({
    url: `/v1/users/${username}/containers`,
    method: 'POST',
    data,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });
  if (res.data.results && res.data.results.length) {
    res.data.results = res.data.results.map((v) => {
      v.globalEntityId = v.id;
      return v;
    });
  }
  return res;
}

function updateDatasetInfoAPI(projectGeid, data) {
  return serverAxios({
    url: `/v1/containers/${projectGeid}`,
    method: 'PUT',
    data,
  });
}

function updateDatasetIcon(projectGeid, base64Img) {
  if (base64Img && base64Img.split(',').length > 1)
    return serverAxios({
      url: `/v1/containers/${projectGeid}`,
      method: 'PUT',
      data: {
        icon: base64Img.split(',')[1],
      },
    });
}

function updateVirtualFolder(
  projectGeid,
  username,
  projectCode,
  collectionList,
) {
  return serverAxios({
    url: `/v1/project/${projectGeid}/collections`,
    method: 'PUT',
    data: {
      owner: username,
      container_code: projectCode,
      collections: collectionList,
    },
  });
}

async function listAllVirtualFolder(projectCode, username) {
  const res = await serverAxios({
    url: `/v1/collections?project_code=${projectCode}&owner=${username}`,
    method: 'GET',
  });
  return res;
}

// TODO: might not be needed
async function listVirtualFolderFiles(collection_geid, pageSize = 10) {
  const res = await serverAxios({
    url: `/v1/collections/${collection_geid}/files?page=0&page_size=${pageSize}&order_by=time_created&order_type=desc`,
    method: 'GET',
  });
  return res;
}

function createVirtualFolder(projectCode, collectionName, username) {
  return serverAxios({
    url: `/v1/collections`,
    method: 'POST',
    data: {
      project_code: projectCode,
      name: collectionName,
      username: username,
    },
  });
}

function deleteVirtualFolder(collectionGeid) {
  return serverAxios({
    url: `/v1/collections/${collectionGeid}`,
    method: 'DELETE',
  });
}

async function listAllCopy2CoreFiles(projectCode, sessionId) {
  const res = await serverAxios({
    url: `/v1/files/actions/tasks?action=data_transfer&project_code=${projectCode}&session_id=${sessionId}`,
    method: 'GET',
  });
  return [...res.data.result];
}

function loadDeletedFiles(projectCode, sessionId) {
  return serverAxios({
    url: `/v1/files/actions/tasks?action=data_delete&project_code=${projectCode}&session_id=${sessionId}`,
    method: 'GET',
  });
}

async function getProjectManifestList(projectCode) {
  const res = await serverAxios({
    url: `/v1/data/manifests?project_code=${projectCode}`,
    method: 'GET',
  });
  res.data.result = res.data.result.map((v) => {
    v.globalEntityId = v.id;
    v.attributes = v.attributes.map((attr) => {
      if (attr.type === 'multiple_choice') {
        attr.value = attr.options.join(',');
      }
      return attr;
    });
    return v;
  });
  return res;
}

/**
 * ticket-921
 * @param {number} manifestId
 */
function getManifestById(manifestId) {
  return serverAxios({
    url: `/v1/data/manifest/${manifestId}`,
  });
}

/**
 * update the manifest attribute for a specified file
 * ticket-947
 * @param {string} geid file's geid
 * @param {object} attributes all the attributes {name:value}
 */
function updateFileManifestAPI(geid, attributes) {
  return serverAxios({
    url: `/v1/file/${geid}/manifest`,
    method: 'PUT',
    data: {
      ...attributes,
    },
  });
}

function addNewManifest(name, projectCode, attributes) {
  return serverAxios({
    url: `/v1/data/manifests`,
    method: 'POST',
    data: {
      name: name,
      project_code: projectCode,
      attributes,
    },
  });
}
function updateManifest(manifestId, name, projectCode) {
  return serverAxios({
    url: `/v1/data/manifest/${manifestId}`,
    method: 'PUT',
    data: {
      name: name,
      project_code: projectCode,
    },
  });
}
function deleteManifest(manifestId) {
  return serverAxios({
    url: `/v1/data/manifest/${manifestId}`,
    method: 'DELETE',
  });
}

function addNewAttrToManifest(manifestId, name, projectCode, attributes) {
  return serverAxios({
    url: `/v1/data/manifest/${manifestId}`,
    method: 'PUT',
    data: {
      name: name,
      project_code: projectCode,
      attributes: attributes,
    },
  });
}

function attachManifest(projectCode, manifestId, geids, attributes) {
  return serverAxios({
    url: `/v1/file/attributes/attach`,
    method: 'POST',
    data: {
      project_code: projectCode,
      manifest_id: manifestId,
      item_ids: geids,
      attributes: attributes,
      inherit: true,
    },
  });
}

function getProjectInfoAPI(projectGeid) {
  return serverAxios({
    url: `/v1/project/${projectGeid}`,
    method: 'GET',
  });
}

/**
 * get project by project code. It's used to check the uniqueness of project code
 * @param {string} projectCode the project code
 */
function getDatasetByCode(projectCode) {
  return serverAxios({
    url: '/v1/project/code/' + projectCode,
  });
}

/**
 * import a manifest from json file
 * @param {*} manifest the manifest object, ticket-922
 */
function importManifestAPI(manifest) {
  return serverAxios({
    url: '/v1/import/manifest',
    data: manifest,
    method: 'POST',
  });
}

/**
 * ticket-1006
 * startDate: 2021-02-22
 * endDate:2021-02-22
 * version: 1614027879010
 * page: by default 0, return the newest
 * pageSize: by default 10
 * order: by default 'desc' by time
 * @param {{projectCode:string,startDate:string,endDate:string,version:string,page:string,pageSize:string,order:'asc'|'desc'}} param0
 */
function getAnnouncementApi({
  projectCode,
  startDate,
  endDate,
  version,
  page,
  pageSize,
  order,
}) {
  return serverAxios({
    url: `/v1/announcements`,
    params: {
      project_code: projectCode,
      start_date: startDate,
      end_date: endDate,
      version,
      page,
      page_size: pageSize,
      order: order || 'desc',
    },
  });
}

/**
 * ticket-1006
 * @param {{projectCode:string,content:string}} param0
 */
function addAnnouncementApi({ projectCode, content }) {
  return serverAxios({
    method: 'post',
    url: `/v1/announcements`,
    data: {
      project_code: projectCode,
      content,
    },
  });
}

/**
 * ticket-1006
 * get user's announcement information. So that we can know which announcement the user has read.
 * @param {string} username
 */
function getUserAnnouncementApi(username) {
  return serverAxios({
    url: `/v1/users/${username}`,
  });
}

/**
 * ticket-1006
 * update the user's announcement information. Add the read announcement id to it.
 */
function putUserAnnouncementApi(username, projectCode, announcementId) {
  return serverAxios({
    method: 'put',
    url: `/v1/users/${username}`,
    data: { [`announcement_${projectCode}`]: announcementId },
  });
}

/**
 * @param {{projectId:string,query:object}} param0
 */
function getAuditLogsApi(projectGeid, paginationParams, query) {
  return serverAxios({
    method: 'get',
    url: `/v1/audit-logs/${projectGeid}`,
    params: {
      ...paginationParams,
      query,
    },
  });
}

/**
 * ticket-1431
 * get the the project's workbench info.
 */
async function getWorkbenchInfo(projectGeid) {
  const res = serverAxios({
    method: 'get',
    url: `/v1/${projectGeid}/workbench`,
  });
  return res;
}

/**
 * ticket-1431
 * deploy a workbench for a project.
 */
function deployWorkbenchAPI(projectGeid, workbench) {
  return serverAxios({
    method: 'post',
    url: `/v1/${projectGeid}/workbench`,
    data: {
      workbench_resource: workbench,
    },
  });
}

function createDatasetFolderAPI(datasetGeid, folderName) {
  return serverAxios({
    method: 'POST',
    url: `/v1/dataset/${datasetGeid}/folder`,
    data: { folder_name: folderName },
  });
}

/**
 * ticket-1435
 * @param {string} folderName
 * @param {string} destinationGeid
 * @param {string} projectCode
 * @param {string} uploader
 * @param {"greenroom | Core"} zone No longer used
 */
function createSubFolderApi(
  folderName,
  parentPath,
  projectCode,
  uploader,
  zone,
  projectGeid,
) {
  return serverAxios({
    url: `/v1/containers/${projectGeid}/folder`,
    method: 'POST',
    data: {
      folder_name: folderName,
      parent_path: parentPath,
      project_code: projectCode,
      // uploader,
      // tags: [],
      zone: _.lowerCase(zone),
    },
  });
}

function requestToCoreAPI(
  projectCode,
  entityId,
  destinationId,
  sourceId,
  sourcePath,
  destinationPath,
  requestNote,
  userName,
) {
  return serverAxios({
    url: `/v1/request/copy/${projectCode}`,
    method: 'POST',
    data: {
      entity_ids: entityId,
      destination_id: destinationId,
      source_id: sourceId,
      source_path: sourcePath,
      destination_path: destinationPath,
      note: requestNote,
      submitted_by: userName,
    },
  });
}

function addToDatasetsAPI(datasetGeid, payLoad) {
  return serverAxios({
    url: `/v1/dataset/${datasetGeid}/files`,
    method: 'PUT',
    headers: { 'Refresh-token': keycloak.refreshToken },
    data: payLoad,
  });
}

async function getDatasetsListingAPI(username, payload) {
  const res = await serverAxios({
    url: `/v1/users/${username}/datasets`,
    method: 'POST',
    data: payload,
  });
  if (res.data.result && res.data.result.length) {
    res.data.result = res.data.result.map((v) => {
      v.globalEntityId = v.id;
      return v;
    });
  }
  return res;
}

function listAllCopyRequests(projectCode, status, pageNo, pageSize) {
  return serverAxios({
    url: `/v1/request/copy/${projectCode}`,
    method: 'get',
    params: {
      status: status,
      page: pageNo,
      page_size: pageSize,
    },
  });
}

// activeReq.projectGeid passed (result from listAllCopyRequests)
function requestPendingFilesAPI(projectCode, requestId) {
  return serverAxios({
    url: `/v1/request/copy/${projectCode}/pending-files`,
    method: 'GET',
    params: {
      request_id: requestId,
    },
  });
}

// activeReq.projectGeid passed (result from listAllCopyRequests)
function requestCompleteAPI(projectCode, requestId, status, reviewNotes) {
  return serverAxios({
    url: `/v1/request/copy/${projectCode}`,
    method: 'PUT',
    data: {
      request_id: requestId,
      status,
      review_notes: reviewNotes,
    },
  });
}
export {
  getUserProjectActivitiesAPI,
  getDatasetsAPI,
  createProjectAPI,
  queryDatasetAPI,
  getTagsAPI,
  getMetadatasAPI,
  changeUserRoleInDatasetAPI,
  addUserToProjectAPI,
  getChildrenDataset,
  getChildrenAPI,
  getPersonalDatasetAPI,
  createPersonalDatasetAPI,
  traverseFoldersContainersAPI,
  removeUserFromDatasetApi,
  updateDatasetInfoAPI,
  updateDatasetIcon,
  getSystemTagsAPI,
  createVirtualFolder,
  listAllVirtualFolder,
  listVirtualFolderFiles,
  updateVirtualFolder,
  deleteVirtualFolder,
  listUsersContainersPermission,
  listAllCopy2CoreFiles,
  getProjectInfoAPI,
  getDatasetByCode,
  getProjectManifestList,
  addNewManifest,
  addNewAttrToManifest,
  deleteManifest,
  loadDeletedFiles,
  updateManifest,
  attachManifest,
  importManifestAPI,
  getManifestById,
  addAnnouncementApi,
  getAuditLogsApi,
  updateFileManifestAPI,
  getAnnouncementApi,
  getUserAnnouncementApi,
  putUserAnnouncementApi,
  getWorkbenchInfo,
  deployWorkbenchAPI,
  createSubFolderApi,
  addToDatasetsAPI,
  getDatasetsListingAPI,
  requestToCoreAPI,
  listAllCopyRequests,
  requestPendingFilesAPI,
  requestCompleteAPI,
  createDatasetFolderAPI,
};
