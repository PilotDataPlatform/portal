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
  SET_CURRENT_PROJECT_PROFILE,
  SET_CURRENT_PROJECT_SYSTEM_TAGS,
  SET_CURRENT_PROJECT_TREE,
  SET_CURRENT_PROJECT_TREE_VFOLDER,
  SET_CURRENT_PROJECT_TREE_GREEN_ROOM,
  SET_CURRENT_PROJECT_ACTIVE_PANE,
  SET_CURRENT_PROJECT_TREE_CORE,
  CLEAR_CURRENT_PROJECT,
  SET_PROJECT_WORKBENCH,
} from '../actionTypes';

const init = {
  workbenchDeployedCounter: 0,
};
export default function (state = init, action) {
  const { type, payload } = action;
  switch (type) {
    case CLEAR_CURRENT_PROJECT: {
      return {
        workbenchDeployedCounter: 0,
      };
    }
    case SET_CURRENT_PROJECT_PROFILE: {
      return { ...state, profile: payload };
    }
    case SET_PROJECT_WORKBENCH: {
      return {
        ...state,
        workbenchDeployedCounter: state.workbenchDeployedCounter + 1,
      };
    }
    case SET_CURRENT_PROJECT_SYSTEM_TAGS: {
      return { ...state, manifest: payload };
    }
    case SET_CURRENT_PROJECT_TREE: {
      return {
        ...state,
        tree: {
          ...state.tree,
          ...payload,
        },
      };
    }
    case SET_CURRENT_PROJECT_TREE_VFOLDER: {
      return {
        ...state,
        tree: {
          ...state.tree,
          vfolders: payload,
        },
      };
    }
    case SET_CURRENT_PROJECT_TREE_GREEN_ROOM: {
      return {
        ...state,
        tree: {
          ...state.tree,
          greenroom: payload,
        },
      };
    }
    case SET_CURRENT_PROJECT_TREE_CORE: {
      return {
        ...state,
        tree: {
          ...state.tree,
          core: payload,
        },
      };
    }
    case SET_CURRENT_PROJECT_ACTIVE_PANE: {
      return {
        ...state,
        tree: {
          ...state.tree,
          active: payload,
        },
      };
    }
    default: {
      return state;
    }
  }
}
