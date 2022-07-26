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
import { TRIGGER_EVENT } from '../actionTypes';

const init = {
  LOAD_COPY_LIST: 0,
  LOAD_DELETED_LIST: 0,
  LOAD_UPLOAD_LIST: 0
};
function events(state = init, action) {
  const { type, payload } = action;
  switch (type) {
    case TRIGGER_EVENT: {
      if (typeof state[payload] !== 'undefined') {
        state[payload] = state[payload] + 1;
      }
      return state;
    }
    default: {
      return state;
    }
  }
}

export default events;
