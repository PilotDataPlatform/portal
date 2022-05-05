import { SET_TOKEN_AUTO_REFRESH } from '../actionTypes';

const init = false;
function tokenAutoRefresh(state = init, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_TOKEN_AUTO_REFRESH: {
      return payload;
    }
    default: {
      return state;
    }
  }
}

export default tokenAutoRefresh;
