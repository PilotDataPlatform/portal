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
import { ADD_DATASET_LIST,CLEAN_DATASET_LIST, SET_DATASET_LIST, UPDATE_DATASET_LIST } from "../actionTypes";
//const _ = require('lodash');


export default function (state = [], action) {
  switch (action.type) {
    case ADD_DATASET_LIST: {
      const { datasetList, title } = action.payload;
      if (!state.length) {
        return [
          {
            datasetList,
            title: "All Projects",
            key: 0,
          },
        ];
      } else {
        const newState = state.slice(0);

        newState.push({
          datasetList,
          key: state[newState.length - 1].key + 1,
          title: title || `query${state[newState.length - 1].key + 1}`,
        });
        return newState;
      }
      //if we will change anything inside programsList, we may need deepClone
    }
    case UPDATE_DATASET_LIST: {
      const { datasetList, title } = action.payload;
      const newState = [];

      if (state.length) {  
        for (const item of state) {
          if (item.title === title) {
            item.datasetList = datasetList;
          }
          newState.push(item);
        }
      }

      return newState;
    }
    case CLEAN_DATASET_LIST:{
      return [];
    }
    case  SET_DATASET_LIST:{
      const {  allDatasetLists} = action.payload;
      return  allDatasetLists;
    }
    default:
      return state;
  }
}
