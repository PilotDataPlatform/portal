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
import { DATASET_DATA } from '../actionTypes';

export const EDIT_MODE = {
  DISPLAY: 'display',
  EIDT_INDIVIDUAL: 'edit_individual',
};
const init = {
  treeData: [],
  selectedData: [],
  selectedDataPos: [],
  mode: EDIT_MODE.DISPLAY,
  hightLighted: null,
  previewFile: {},
  treeLoading: false,
  treeKey: 1,
};

export function datasetData(state = init, action) {
  const { type, payload } = action;

  switch (type) {
    case DATASET_DATA.SET_TREE_DATA: {
      return { ...state, treeData: payload };
    }
    case DATASET_DATA.SET_SELECTED_DATA: {
      return { ...state, selectedData: payload };
    }
    case DATASET_DATA.SET_SELECTED_DATA_POS: {
      return { ...state, selectedDataPos: payload };
    }
    case DATASET_DATA.SET_HIGHLIGHTED: {
      return { ...state, hightLighted: payload };
    }

    case DATASET_DATA.CLEAR_DATA: {
      return init;
    }
    case DATASET_DATA.SET_MODE: {
      return { ...state, mode: payload };
    }

    case DATASET_DATA.SET_PREVIEW_FILE: {
      return { ...state, previewFile: payload };
    }

    case DATASET_DATA.SET_TREE_LOADING: {
      return { ...state, treeLoading: payload };
    }
    case DATASET_DATA.RESET_TREE_KEY: {
      return { ...state, treeKey: state.treeKey + 1 };
    }
    default:
      return state;
  }
}
