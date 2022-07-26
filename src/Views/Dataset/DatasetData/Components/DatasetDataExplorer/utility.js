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
import { getFileOperationsApi, listDatasetFiles } from '../../../../../APIs';
import {
  datasetFileOperationsCreators,
  datasetDataActions,
} from '../../../../../Redux/actions';
import { store } from '../../../../../Redux/store';
import { tokenManager } from '../../../../../Service/tokenManager';

/**
 *
 * @param {"move"|"rename"|"delete"|"import"} type
 * @param {string} datasetCode
 * @param {*} dispatch
 */
async function fetchFileOperations(type, datasetCode, dispatch) {
  dispatch(datasetFileOperationsCreators.setLoadingStatus(type, true));
  const operator = store.getState().username;
  const sessionId = tokenManager.getCookie('sessionId');
  try {
    const res = await getFileOperationsApi(
      type,
      datasetCode,
      sessionId,
      operator,
    );
    const result = res.data.result;
    dispatch(datasetFileOperationsCreators[`set${_.capitalize(type)}`](result));
  } catch (err) {
    console.error(err);
  } finally {
    dispatch(datasetFileOperationsCreators.setLoadingStatus(type), false);
  }
}

async function fetchDatasetFiles(datasetGeid, dispatch) {
  const page = 0,
    pageSize = 10000,
    orderBy = 'create_time',
    orderType = 'desc';

  const res = await listDatasetFiles(
    datasetGeid,
    null,
    page,
    pageSize,
    orderBy,
    orderType,
    {},
  );
  dispatch(datasetDataActions.setTreeData(res?.data?.result?.data));
}

function onRenameFinish(payload, oldTreeData, dispatch) {
  const newTreeData = _.cloneDeep(oldTreeData);
  const targetNode = findNodeWithGeid(
    { children: newTreeData },
    payload?.source?.id,
  );

  if (targetNode) {
    //payload.payload is the new node
    //payload.payload is the old node
    targetNode['name'] = payload.payload.name;
    targetNode['globalEntityId'] = payload.payload.id;
    dispatch(datasetDataActions.setTreeData(newTreeData));
  }
}

function onImportFinish(payload, oldTreeData, dispatch) {
  const newTreeData = _.cloneDeep(oldTreeData);
  const newImport = payload?.payload;
  if (!newTreeData.find((x) => x.id === newImport.id)) {
    newTreeData.unshift(newImport);
  }
  dispatch(datasetDataActions.setTreeData(newTreeData));
}

const findNodeWithGeid = (obj, target) => {
  if (!target || !_.isString(target))
    throw new Error('target geid should not be empty');
  if (!obj) return null;

  if (obj.globalEntityId === target) {
    return obj;
  }

  if (!_.isArray(obj.children)) return null;

  for (let i = 0; i < obj.children.length; i++) {
    const child = obj.children[i];
    const childRes = findNodeWithGeid(child, target);
    if (childRes) {
      return childRes;
    }
  }

  return null;
};

const deleteNodeWithGeids = (treeNodes, geids) => {
  return treeNodes
    .map((node) => {
      if (geids.indexOf(node.globalEntityId) !== -1) {
        return null;
      }

      if (node.children) {
        return {
          ...node,
          children: deleteNodeWithGeids(node.children, geids),
        };
      }

      return node;
    })
    .filter((v) => !!v);
};

export {
  fetchFileOperations,
  deleteNodeWithGeids,
  onRenameFinish,
  onImportFinish,
  fetchDatasetFiles,
};
