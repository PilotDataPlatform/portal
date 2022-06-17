import { SET_CANVAS_PAGE } from '../actionTypes';

const init = { page: 'greenroom-home' };
function canvasPage(state = init, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_CANVAS_PAGE: {
      return payload;
    }
    default: {
      return state;
    }
  }
}

export default canvasPage;
