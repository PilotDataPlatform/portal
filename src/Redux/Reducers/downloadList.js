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
import { APPEND_DOWNLOAD_LIST, REMOVE_DOWNLOAD_LIST,CLEAR_DOWNLOAD_LIST, UPDATE_DOWNLOAD_ITEM, SET_DOWNLOAD_LIST } from '../actionTypes';

const init = [];
function downloadList(state = init, action) {
  const { type, payload } = action;
  switch (type) {
    case APPEND_DOWNLOAD_LIST: {
      return [...state, payload];
    }
    case REMOVE_DOWNLOAD_LIST: {
      const newDownloadList = state.filter(
        (item) => item.downloadKey !== payload,
      );
      return newDownloadList;
    }
    case CLEAR_DOWNLOAD_LIST:{
      return [];
    }
    case UPDATE_DOWNLOAD_ITEM: {
      const newDownloadList = state.map((el) => {
        if (el.downloadKey === payload.key) el.status = payload.status;
        
        return el;
      });

      return newDownloadList;
    }
    case SET_DOWNLOAD_LIST: {
      return payload;
    }
    default: {
      return state;
    }
  }
}

export default downloadList;
