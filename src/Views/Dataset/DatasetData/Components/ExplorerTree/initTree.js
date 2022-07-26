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
import { listDatasetFiles } from '../../../../../APIs';
import { datasetDataActions } from '../../../../../Redux/actions';
import { store } from '../../../../../Redux/store';
const page = 0,
  pageSize = 10000,
  orderBy = 'create_time',
  orderType = 'desc';

async function initTree() {
  const datasetInfo = store.getState().datasetInfo.basicInfo;
  const datasetGeid = datasetInfo.geid;

  const res = await listDatasetFiles(
    datasetGeid,
    null,
    page,
    pageSize,
    orderBy,
    orderType,
    {},
  );
  store.dispatch(datasetDataActions.resetTreeKey());
  store.dispatch(datasetDataActions.setTreeData(res?.data?.result?.data));
  store.dispatch(datasetDataActions.setTreeLoading(false));
}

export { initTree };
