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
  SET_SELECTED_FILES,
  SET_SELECTED_FILES_KEYS,
  CLEAN_FILES_SELECTION,
  SET_FOLDER_ROUTING,
  SET_TABLE_RESET,
} from '../actionTypes';
import _ from 'lodash';
const init = {
  selFiles: [],
  selFilesKeys: [],
  folderRouting: {},
  tableResetMap: {},
};
export default function (state = init, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_SELECTED_FILES: {
      return { ...state, selFiles: payload };
    }
    case SET_SELECTED_FILES_KEYS: {
      return { ...state, selFilesKeys: payload };
    }
    case CLEAN_FILES_SELECTION: {
      return {
        ...state,
        selFilesKeys: [],
        selFiles: [],
      };
    }
    case SET_FOLDER_ROUTING: {
      return Object.assign(
        { ...state },
        { folderRouting: _.cloneDeep(payload) },
      );
    }
    case SET_TABLE_RESET: {
      let tableResetMap = { ...state.tableResetMap };
      if (tableResetMap[payload]) {
        tableResetMap[payload] = tableResetMap[payload] + 1;
      } else {
        tableResetMap[payload] = 1;
      }

      return Object.assign({ ...state }, { tableResetMap: tableResetMap });
    }
    default: {
      return state;
    }
  }
}
