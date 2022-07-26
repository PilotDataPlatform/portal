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
import { DATASET_FILE_OPERATION } from '../actionTypes';
import _ from 'lodash';

const init = {
  import: [],
  rename: [],
  delete: [],
  move: [],
  loadingStatus: { import: false, rename: false, delete: false, move: false },
};

/**
 * for dataset file panel, not used yet but already program. keep here and see if it will be useful.
 * @param {*} state
 * @param {*} action
 * @returns
 */
export function datasetFileOperations(state = init, action) {
  const { type, payload } = action;
  switch (type) {
    case DATASET_FILE_OPERATION.SET_IMPORT: {
      const newState = _.cloneDeep(state);
      newState['import'] = payload;
      return newState;
    }

    case DATASET_FILE_OPERATION.SET_DELETE: {
      const newState = _.cloneDeep(state);
      newState['delete'] = payload;
      return newState;
    }

    case DATASET_FILE_OPERATION.SET_RENAME: {
      const newState = _.cloneDeep(state);
      newState['rename'] = payload;
      return newState;
    }

    case DATASET_FILE_OPERATION.SET_MOVE: {
      const newState = _.cloneDeep(state);
      newState['move'] = payload;
      return newState;
    }

    default: {
      return state;
    }
  }
}
