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
  getRequestFiles,
  getFileManifestAttrs,
  getRequestFilesDetailByGeid,
} from '../../../../APIs';
import { fileExplorerTableActions } from '../../../../Redux/actions';
import _ from 'lodash';
import { message } from 'antd';
class RequestDataSource {
  fetchRoot(
    requstGeid,
    page,
    pageSize,
    order,
    orderType,
    filter,
    partial,
    projectCode,
  ) {
    return getRequestFiles(
      requstGeid,
      page,
      pageSize,
      order,
      orderType,
      filter,
      partial,
      projectCode,
      null,
    );
  }
  fetchFolder(
    requstGeid,
    page,
    pageSize,
    order,
    orderType,
    filter,
    partial,
    projectCode,
    parentId,
  ) {
    return getRequestFiles(
      requstGeid,
      page,
      pageSize,
      order,
      orderType,
      filter,
      partial,
      projectCode,
      parentId,
    );
  }
}

const convertSortKey = (sortKey) => {
  const sortKeyMap = {
    fileName: 'name',
    fileSize: 'file_size',
    createTime: 'uploaded_at',
    owner: 'uploaded_by',
  };
  return sortKeyMap[sortKey] || sortKey;
};

export const fetchTableData = async (
  sourceType,
  isRoot,
  geid,
  page,
  pageSize,
  order,
  orderType,
  filter,
  projectId,
  dispatch,
  reduxKey,
) => {
  order = convertSortKey(order);
  orderType = orderType === 'ascend' ? 'asc' : 'desc';
  dispatch(
    fileExplorerTableActions.setLoading({ geid: reduxKey, param: true }),
  );
  let res;
  let files, total;
  try {
    if (sourceType === 'request') {
      const dataSource = new RequestDataSource();
      if (isRoot) {
        res = await dataSource.fetchRoot(
          geid,
          page,
          pageSize,
          order,
          orderType,
          filter,
          [],
          projectId,
          null,
        );
      } else {
        const requestGeid = reduxKey.split('-').slice(1).join('-');
        res = await dataSource.fetchFolder(
          requestGeid,
          page,
          pageSize,
          order,
          orderType,
          filter,
          [],
          projectId,
          geid,
        );
      }

      files = res.data?.result?.entities;
      total = res.data?.result?.approximateCount;
      const filesWithDetail = [];
      try {
        const fileDetailRes = await getRequestFilesDetailByGeid(
          files.map((file) => file['geid']),
        );

        for (let i = 0; i < fileDetailRes.data.result.length; i++) {
          const file = files[i];
          const detail = _.find(
            fileDetailRes.data.result,
            (detail) => detail.globalEntityId === file.geid,
          );
          filesWithDetail.push(_.assign(file, detail));
        }
      } catch (error) {
        if (error.response?.status !== 400) {
          message.error(`Failed to get file detail`);
        }
      }

      dispatch(
        fileExplorerTableActions.setData({
          geid: reduxKey,
          param: filesWithDetail,
        }),
      );
      dispatch(
        fileExplorerTableActions.setTotal({ geid: reduxKey, param: total }),
      );

      const routes = res.data?.result?.routing;
      if (routes) {
        dispatch(
          fileExplorerTableActions.setRoute({ geid: reduxKey, param: routes }),
        );
      } else {
        dispatch(
          fileExplorerTableActions.setRoute({ geid: reduxKey, param: [] }),
        );
      }
    }
  } catch (e) {
    console.log(e);
  } finally {
    dispatch(
      fileExplorerTableActions.setLoading({ geid: reduxKey, param: false }),
    );
    if (res) return res;
  }
};
