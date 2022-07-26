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
export const initStates = {
  loading: false,
  currentPlugin: '',
  route: [], // current geid can be found in the last item of the array,
  page: 0,
  total: 0,
  pageSize: 10,
  sortBy: 'createTime',
  sortOrder: 'desc',
  filter: {},
  columnsComponentMap: null,
  dataOriginal: [],
  data: [],
  selection: [],
  propertyRecord: null,
  isSidePanelOpen: false,
  refreshNum: 0,
  sourceType: 'Project', //"Project"|"Folder"|"TrashFile"
  currentGeid: '',
  hardFreshKey: 0,
};
