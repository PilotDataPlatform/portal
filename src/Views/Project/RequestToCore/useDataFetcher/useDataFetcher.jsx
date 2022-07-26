/*
Copyright (C) 2022 Indoc Research

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
import { useSelector, useDispatch } from 'react-redux';
import { fileExplorerTableActions } from '../../../../Redux/actions';
import { useCurrentProject } from '../../../../Utility';
import { fetchTableData } from './dataFetcher';

export function useDataFetcher(reduxKey) {
  const dispatch = useDispatch();
  const fileExplorerTableState = useSelector(
    (state) => state.fileExplorerTable,
  );
  const { activeReq } = useSelector((state) => state.request2Core);
  const [currentDataset] = useCurrentProject();
  const projectCode = currentDataset?.code;
  if (!fileExplorerTableState[reduxKey]) {
    dispatch(fileExplorerTableActions.setAdd({ geid: reduxKey }));
  }

  const {
    data,
    loading,
    pageSize,
    page,
    total,
    columnsComponentMap,
    isSidePanelOpen,
    selection,
    currentPlugin,
    refreshNum,
    hardFreshKey,
    currentGeid,
    orderType,
    orderBy,
    filter,
  } = fileExplorerTableState[reduxKey] || {};

  return {
    goToRoute(geid, isRoot) {
      return fetchTableData(
        'request',
        isRoot,
        geid,
        0,
        10,
        'uploaded_at',
        'desc',
        {},
        projectCode,
        dispatch,
        reduxKey,
      );
    },
    init(geid) {
      return fetchTableData(
        'request',
        true,
        geid,
        page,
        pageSize,
        'uploaded_at',
        'desc',
        {},
        projectCode,
        dispatch,
        reduxKey,
      );
    },
    refresh(geid, isRoot) {
      return fetchTableData(
        'request',
        isRoot,
        geid,
        page,
        pageSize,
        orderType,
        orderBy,
        {},
        projectCode,
        dispatch,
        reduxKey,
      );
    },
    pageTo(geid, isRoot, page) {
      return fetchTableData(
        'request',
        isRoot,
        geid,
        page,
        pageSize,
        orderBy,
        orderType,
        filter,
        projectCode,
        dispatch,
        reduxKey,
      );
    },
    changeSorterAndPagination(geid, isRoot, page, sort, order, filter) {
      return fetchTableData(
        'request',
        isRoot,
        geid,
        page,
        pageSize,
        sort,
        order,
        filter,
        projectCode,
        dispatch,
        reduxKey,
      );
    },
    changePageSize(geid, isRoot, pageSize) {
      return fetchTableData(
        'request',
        isRoot,
        geid,
        page,
        pageSize,
        orderType,
        orderBy,
        {},
        projectCode,
        dispatch,
        reduxKey,
      );
    },
    goToFolder(geid) {
      return fetchTableData(
        'request',
        false,
        geid,
        0,
        10,
        'uploaded_at',
        'desc',
        {},
        projectCode,
        dispatch,
        reduxKey,
      );
    },
  };
}
