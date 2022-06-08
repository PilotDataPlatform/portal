import { SET_VIRTUAL_FOLDER_OPERATION } from '../actionTypes';

const init = {operation: null, geid: null };
function virtualFolders(state = init, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_VIRTUAL_FOLDER_OPERATION: {
      return {...state, ...payload }
    }
    default: {
      return state;
    }
  }
}

export default virtualFolders;
