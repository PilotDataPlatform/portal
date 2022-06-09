import { SET_CANVAS_PAGE } from '../actionTypes';

const init = 'Green Home';
function canvasPage(state = init, action) {
  const { type, payload } = action;
  console.log('reducers');
  console.log(payload);
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
