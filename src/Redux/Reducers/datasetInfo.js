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
import { DATASET_INFO } from '../actionTypes';

const init = {
  basicInfo: {
    timeCreated: '',
    creator: '',
    title: '',
    authors: [],
    type: '',
    modality: [],
    collectionMethod: [],
    license: '',
    code: '',
    projectGeid: '',
    size: 0,
    totalFiles: 0,
    description: '',
    geid: '',
    tags: [],
    bidsLoading: false,
  },
  currentVersion: '',
  projectName: '',
  loading: false,
  hasInit: false,
};

export function datasetInfo(state = init, action) {
  const { type, payload } = action;
  switch (type) {
    case DATASET_INFO.SET_BASIC_INFO: {
      return { ...state, basicInfo: payload };
    }
    case DATASET_INFO.SET_PROJECT_NAME: {
      return { ...state, projectName: payload };
    }
    case DATASET_INFO.SET_LOADING: {
      return { ...state, loading: payload };
    }
    case DATASET_INFO.SET_HAS_INIT: {
      return { ...state, hasInit: payload };
    }
    case DATASET_INFO.SET_VERSION: {
      return { ...state, currentVersion: payload };
    }
    default:
      return state;
  }
}
