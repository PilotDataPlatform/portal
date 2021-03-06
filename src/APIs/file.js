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
  serverAxiosNoIntercept,
  serverAxios as axios,
  uploadAxios,
  serverAxios,
  downloadGRAxios,
} from './config';
import { objectKeysToSnakeCase, checkGreenAndCore } from '../Utility';
import _ from 'lodash';
import { keycloak } from '../Service/keycloak';
import { API_PATH, DOWNLOAD_GR, DOWNLOAD_CORE } from '../config';

function uploadFileApi2(data, sessionId, cancelToken) {
  return uploadAxios({
    url: `/v1/files/chunks`,
    method: 'POST',
    data,
    cancelToken,
    timeout: 30 * 1000,
    headers: {
      'Session-ID': sessionId,
    },
  });
}

function preUploadApi(data, sessionId) {
  return uploadAxios({
    url: `/v1/files/jobs`,
    method: 'POST',
    data,
    timeout: 10 * 60 * 1000,
    headers: {
      'Session-ID': sessionId,
    },
  });
}

function combineChunksApi(data, sessionId) {
  return uploadAxios({
    url: `/v1/files`,
    method: 'POST',
    data,
    headers: {
      'Session-ID': sessionId,
      'Refresh-token': keycloak.refreshToken,
    },
  });
}

function checkUploadStatus(projectCode, operator, sessionId) {
  return serverAxios({
    url: `/v1/files/actions/tasks?action=data_upload`,
    method: 'GET',
    headers: {
      'Session-ID': sessionId,
    },
    params: {
      project_code: projectCode,
      operator,
      session_id: sessionId,
    },
  });
}

function deleteUploadStatus(containerId, sessionId) {
  return axios({
    url: `/v1/upload/containers/${containerId}/upload-state`,
    method: 'DELETE',
    headers: {
      'Session-ID': sessionId,
    },
  });
}

function checkDownloadStatus(sessionId, projectCode, operator) {
  return axios({
    url: `/v1/files/actions/tasks?action=data_download`,
    method: 'GET',
    headers: {
      'Session-ID': `${sessionId}`,
    },
    params: {
      project_code: projectCode,
      operator,
      session_id: sessionId,
    },
  });
}

function deleteDownloadStatus(sessionId) {
  return downloadGRAxios({
    url: `/v1/download/status`,
    method: 'DELETE',
    headers: {
      'Session-ID': `${sessionId}`,
    },
  });
}

function deleteFileActionStatus(projectCode, sessionId) {
  return axios({
    url: `/v1/files/actions/tasks`,
    method: 'DELETE',
    data: {
      project_code: projectCode,
      session_id: sessionId,
    },
  });
}

/**
 * Get a list of files from the study
 *
 * @param {int} studyId studyId
 * @returns {array} files[]
 * @IRDP-436
 */
function getFilesAPI(datasetId) {
  return axios({
    //url: `/${studyId}/files`,
    url: `/v1/${datasetId}/files`,
    method: 'GET',
  });
}

function getFileManifestAttrs(geidsList, lineageView = false) {
  return serverAxiosNoIntercept({
    url: `/v1/file/manifest/query`,
    method: 'POST',
    data: {
      geid_list: geidsList,
      lineage_view: lineageView,
    },
  });
}

async function getRequestFiles(
  requestGeid,
  page,
  pageSize,
  orderBy,
  orderType,
  filters,
  partial,
  projectCode,
  parentId,
) {
  const params = {
    page,
    page_size: pageSize,
    order_by: orderBy,
    order_type: orderType,
    partial,
    query: _.omit(filters, ['tags']),
    request_id: requestGeid,
  };
  if (parentId) {
    params.parent_id = parentId;
  }
  let res;
  res = await axios({
    url: `/v1/request/copy/${projectCode}/files`,
    params: objectKeysToSnakeCase(params),
  });
  res.data.result.entities = res.data.result.data.map((item) => {
    res.data.result.approximateCount = res.data.total;
    let formatRes = {
      geid: item.entityId,
      key: item.entityId,
      archived: item.archived,
      createTime: item.uploadedAt,
      nodeLabel:
        item.entityType === 'folder'
          ? ['Greenroom', 'Folder']
          : ['Greenroom', 'File'],
      displayPath: item.displayPath,
      name: item.name,
      fileSize: item.fileSize,
      owner: item.uploadedBy,
      path: item.path,
      location: item.location,
      folderRelativePath: item.folderRelativePath,
      tags: [],
      reviewedAt: item.reviewedAt,
      reviewedBy: item.reviewedBy,
      reviewStatus: item.reviewStatus,
    };
    return formatRes;
  });
  res.data.result.routing = res.data.result.routing.map((item, ind) => {
    let formatRes = {
      name: item.name,
      labels:
        item.entityType === 'folder'
          ? ['Greenroom', 'Folder']
          : ['Greenroom', 'File'],
      globalEntityId: item.entityGeid,
      folderLevel: res.data.result.routing.length - ind,
    };
    return formatRes;
  });
  return res;
}

async function getRequestFilesDetailByGeid(geids) {
  return axios({
    url: `/v1/files/bulk/detail`,
    method: 'POST',
    data: {
      ids: geids,
    },
  });
}

/**
 * ticket-1314
 * @param {string} parentPath the parent path of the request files
 * @param {string} parentId collection id if request virtual folder
 * @param {number} page the nth page. start from ?
 * @param {number} pageSize the number of items in each page
 * @param {string} orderBy order by which column. should be one of the column name
 * @param {"desc"|"asc"} orderType
 * @param {*} filters the query filter like {"name":"hello"}
 * @param {"Greenroom"|"Core"|"All"} zone if the sourceType is "Trash", the zone is All
 * @param {"project"|"folder"|"trash"|"collection"} sourceType The Folder are the folders inside file explorer.
 * @param {string[]} partial what queries should be partial search.
 */
async function getFiles(
  parentPath,
  parentId,
  page,
  pageSize,
  orderBy,
  orderType,
  filters,
  zone,
  sourceType,
  partial,
  panelKey,
  projectCode,
) {
  const archived = panelKey.toLowerCase().includes('trash') ? true : false;
  filters['archived'] = archived;
  filters = _.omit(filters, ['tags']);
  let url = `/v1/files/meta`;
  const params = {
    page,
    page_size: pageSize,
    order_by: orderBy,
    order_type: orderType,
    zone: zone.toLowerCase(),
    project_code: projectCode,
    parent_path: parentPath,
    source_type: sourceType,
    ...filters,
  };
  if (parentId) {
    params['parent_id'] = parentId;
  }
  let res;
  res = await axios({
    url,
    params: objectKeysToSnakeCase(params),
  });

  function generateLabels(item) {
    const labels = [];
    if (item.zone === 'greenroom') {
      labels.push('Greenroom');
    }
    if (item.zone === 'core') {
      labels.push('Core');
    }
    if (item.archived) {
      labels.push('TrashFile');
    }
    if (item.type === 'folder' || item.type === 'name_folder') {
      labels.push('Folder');
    } else {
      labels.push('File');
    }
    return labels;
  }
  const objFormatted = {
    entities: res.data.result,
    approximateCount: res.data.total,
  };
  let parentPath4Routing = parentPath;
  let parentId4Routing;
  let parentZone = objFormatted.entities[0] && objFormatted.entities[0].zone;
  objFormatted.entities = objFormatted.entities.map((item) => {
    parentId4Routing = item.parent;
    const tags =
      item.extended.extra &&
      item.extended.extra.tags &&
      item.extended.extra.tags.length
        ? item.extended.extra.tags
        : [];
    const systemTags =
      item.extended.extra &&
      item.extended.extra.systemTags &&
      item.extended.extra.systemTags.length
        ? item.extended.extra.systemTags
        : [];
    let formatRes = {
      guid: item.id,
      geid: item.id,
      archived: item.archived,
      attributes: {
        createTime: item.createdTime,
        nodeLabel: generateLabels(item),
        displayPath: item.parentPath,
        fileName: item.name,
        fileSize: item.size,
        owner: item.owner,
        location: item.storage.locationUri,
      },
      labels: tags.length || systemTags.length ? tags.concat(systemTags) : [],
    };
    return formatRes;
  });
  res.data.result = objFormatted;

  const routingArr = parentPath4Routing ? parentPath4Routing.split('.') : [];
  const routingFormated = [];
  for (let i = 0; i < routingArr.length; i++) {
    routingFormated.push({
      folderLevel: i,
      name: routingArr[i],
      displayPath: routingFormated.map((v) => v.name).join('.'),
      labels: parentZone ? [_.capitalize(parentZone)] : [],
    });
  }
  res.data.result.routing = routingFormated;
  if (routingFormated && routingFormated.length) {
    res.data.result.routing[routingFormated.length - 1].globalEntityId =
      parentId4Routing;
  }
  return res;
}

/**
 * check multiple files bulk download status in container
 * @param {number} containerId
 * @param {number} path
 * @param {number} fileName
 */
function checkDownloadStatusAPI(
  taskId,
  hashCode,
  namespace,
  updateDownloadItemDispatch,
  setSuccessNumDispatcher,
  successNum,
) {
  return downloadGRAxios({
    url: `/v1/download/status/${hashCode}`,
    method: 'GET',
  })
    .then((res) => {
      const { status } = res.data.result;
      if (status === 'READY_FOR_DOWNLOADING') {
        const namespaceUrl =
          namespace.toLowerCase() === 'greenroom' ? 'gr' : 'core';
        updateDownloadItemDispatch({ key: taskId, status: 'success' });
        const hashCode = res.data.result?.payload?.hashCode;
        let url;
        if (namespaceUrl === 'gr') {
          url = DOWNLOAD_GR + `/v1/download/${hashCode}`;
        }
        if (namespaceUrl === 'core') {
          url = DOWNLOAD_CORE + `/v1/download/${hashCode}`;
        }
        // Start to download zip file
        window.open(url, '_blank');
        setTimeout(() => {
          setSuccessNumDispatcher(successNum + 1);
        }, 3000);
      } else if (status === 'CANCELLED') {
        updateDownloadItemDispatch({ key: taskId, status: 'error' });
      } else if (status === 'error') {
        // Stop check status
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

/**
 * download the file in container
 * @param {number} containerId
 * @param {number} path
 * @param {number} fileName
 * @returns {string} url string
 */
async function downloadFilesAPI(
  containerId,
  files,
  appendDownloadListCreator,
  projectCode,
  operator,
  namespace,
  requestId, // only for request to core table
) {
  const options = {
    url: `/v2/download/pre`,
    method: 'post',
    headers: { 'Refresh-token': keycloak.refreshToken },
    data: {
      files,
      container_type: 'project',
      container_code: projectCode,
      operator: operator,
    },
  };
  if (requestId) {
    options.data['approval_request_id'] = requestId;
  }

  return axios(options).then((res) => {
    let fileName = decodeURIComponent(res.data.result.source);
    const status = res.data.result.status;
    fileName = fileName.indexOf('?') !== -1 ? fileName.split('?')[0] : fileName;
    const fileNamesArr = fileName.split('/') || [];
    fileName = fileNamesArr.length && fileNamesArr[fileNamesArr.length - 1];
    const namespaceUrl =
      namespace.toLowerCase() === 'greenroom' ? 'gr' : 'core';

    if (status === 'READY_FOR_DOWNLOADING') {
      const hashCode = res.data.result.payload.hashCode;
      let url;
      if (namespaceUrl === 'gr') {
        url = DOWNLOAD_GR + `/v1/download/${hashCode}`;
      }
      if (namespaceUrl === 'core') {
        url = DOWNLOAD_CORE + `/v1/download/${hashCode}`;
      }
      return url;
    }

    let item = {
      downloadKey: res.data.result['jobId'],
      container: res.data.result.projectCode,
      projectCode: res.data.result.projectCode,
      status: 'pending',
      filename: fileName,
      projectId: containerId,
      hashCode: res.data.result.payload.hashCode,
      namespace,
      createdTime: Date.now(),
    };

    appendDownloadListCreator(item);

    return null;
  });
}

/**
 * check the file status in the backend after all chunks uploaded
 * @param {number} containerId
 * @param {number} taskId
 */
function checkPendingStatusAPI(containerId, taskId) {
  return axios({
    url: `/v1/upload/containers/${containerId}/status`,
    method: 'GET',
    params: objectKeysToSnakeCase({
      taskId,
    }),
  });
}

/**
 * Get total number of the raw files and processed files
 *
 * @param {int} containerId containerId
 */
/**
 * Add new tags to existed file entities
 *
 * @param {int} containerId containerId
 * @param {dict} data data
 */
function updateProjectTagsAPI(geid, data) {
  return axios({
    url: `/v2/${geid}/tags`,
    method: 'POST',
    data,
  });
}

function batchTagsAPI(data) {
  return axios({
    url: '/v2/entity/tags',
    method: 'POST',
    data,
  });
}

/**
 * Delete new tags to existed file entities
 *
 * @param {int} containerId containerId
 * @param {str} tag tag
 * @param {array} taglist taglist
 * @param {str} guid
 */
function deleteProjectTagsAPI(containerId, params) {
  return axios({
    url: `/v2/files/containers/${containerId}/files/tags`,
    method: 'DELETE',
    data: params,
  });
}

function fileLineageAPI(key, typeName, direction) {
  return axios({
    url: `/v1/lineage`,
    method: 'GET',
    params: { item_id: key, direction, type_name: typeName },
  });
}

function addToVirtualFolder(collectionGeid, geids) {
  return axios({
    url: `/v1/collections/${collectionGeid}/files`,
    method: 'POST',
    data: {
      item_ids: geids,
    },
  });
}

/**
 * ticket-1499
 * @param {string} collectionGeid the vfolder geid
 * @param {string} geids the files/folders geid
 * @returns
 */
function removeFromVirtualFolder(collectionGeid, geids) {
  return axios({
    url: `/v1/collections/${collectionGeid}/files`,
    method: 'DELETE',
    data: {
      item_ids: geids,
    },
  });
}

function getZipContentAPI(fileGeid, projectGeid) {
  return serverAxiosNoIntercept({
    url: '/v1/archive',
    params: {
      project_geid: projectGeid,
      file_id: fileGeid,
    },
  });
}

function deleteFileAPI(data) {
  return axios({
    url: '/v1/files/actions',
    method: 'DELETE',
    headers: { 'Refresh-token': keycloak.refreshToken },
    data,
  });
}

function validateRepeatFiles(
  targets,
  destination,
  operator,
  operation,
  projectGeid,
  sessionId,
) {
  let payload = {
    targets,
  };
  if (destination) {
    payload.destination = destination;
  }
  return axios({
    url: `/v1/files/repeatcheck`,
    method: 'POST',
    headers: {
      'Session-ID': sessionId,
    },
    data: {
      payload,
      operator,
      operation,
      project_geid: projectGeid,
      session_id: sessionId,
    },
  });
}

function commitFileAction(
  payload,
  operator,
  operation,
  projectCode,
  sessionId,
) {
  return axios({
    url: `/v1/files/actions`,
    method: 'POST',
    headers: {
      'Session-ID': sessionId,
      'Refresh-token': keycloak.refreshToken,
    },

    data: {
      payload,
      operator,
      operation,
      project_code: projectCode,
      session_id: sessionId,
    },
  });
}
function reviewAllRequestFiles(
  projectCode,
  requestId,
  reviewStatus,
  sessionId,
) {
  return axios({
    url: `/v1/request/copy/${projectCode}/files`,
    method: 'PUT',
    headers: {
      'Session-ID': sessionId,
    },
    data: {
      request_id: requestId,
      review_status: reviewStatus,
      session_id: sessionId,
    },
  });
}
function reviewSelectedRequestFiles(
  projectCode,
  requestId,
  geids,
  reviewStatus,
  sessionId,
  source,
) {
  return axios({
    url: `/v1/request/copy/${projectCode}/files`,
    method: 'PATCH',
    headers: {
      'Session-ID': sessionId,
    },
    data: {
      request_id: requestId,
      entity_ids: geids,
      review_status: reviewStatus,
      session_id: sessionId,
      source,
    },
  });
}

export {
  getFilesAPI,
  downloadFilesAPI,
  checkDownloadStatusAPI,
  checkPendingStatusAPI,
  preUploadApi,
  uploadFileApi2,
  combineChunksApi,
  checkUploadStatus,
  deleteUploadStatus,
  updateProjectTagsAPI,
  batchTagsAPI,
  deleteProjectTagsAPI,
  fileLineageAPI,
  checkDownloadStatus,
  deleteDownloadStatus,
  addToVirtualFolder,
  removeFromVirtualFolder,
  getZipContentAPI,
  deleteFileAPI,
  getFileManifestAttrs,
  getFiles,
  getRequestFiles,
  validateRepeatFiles,
  commitFileAction,
  reviewSelectedRequestFiles,
  reviewAllRequestFiles,
  getRequestFilesDetailByGeid,
  deleteFileActionStatus,
};
