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
import { COPY_REQUEST } from '../actionTypes';
import _ from 'lodash';
const init = {
  reqList: [],
  activeReq: null,
  status: 'pending',
  pageNo: 0,
  pageSize: 10,
  total: 0,
};
export default function (state = init, action) {
  const { type, payload } = action;
  switch (type) {
    case COPY_REQUEST.SET_STATUS: {
      return { ...state, status: payload };
    }
    case COPY_REQUEST.SET_REQ_LIST: {
      return { ...state, reqList: payload };
    }
    case COPY_REQUEST.SET_ACTIVE_REQ: {
      return {
        ...state,
        activeReq: payload,
      };
    }
    case COPY_REQUEST.SET_PAGINATION: {
      return {
        ...state,
        pageNo: payload.pageNo,
        pageSize: payload.pageSize,
        total: payload.total,
      };
    }
    default: {
      return state;
    }
  }
}
