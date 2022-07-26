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
  SET_UPLOAD_LIST,
  APPEND_UPLOAD_LIST,
  UPDATE_UPLOAD_LIST_ITEM,
} from "../actionTypes";

const init = [];
function uploadList(state = init, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_UPLOAD_LIST: {
      return payload.list;
    }
    case APPEND_UPLOAD_LIST: {
      const { appendContent } = payload;
      if (appendContent instanceof Array) {
        return [...state, ...appendContent];
      } else {
        return [...state, appendContent];
      }
    }
    // update status of upload item eg.,('pending', 'uploading', 'error')
    case UPDATE_UPLOAD_LIST_ITEM: {
      const { item } = payload;
      const currentItem = state.find((ele) => {
        return ele.jobId === item.jobId;
      });
      if(!currentItem){
        return state;
      }
      if (currentItem.status === "error" || currentItem.status === "success")
        return [...state];
      currentItem["progress"] = item["progress"];
      currentItem["status"] = item["status"];
      currentItem['uploadedTime'] = item["uploadedTime"]
      return [...state];
    }
    default: {
      return state;
    }
  }
}

export default uploadList;
