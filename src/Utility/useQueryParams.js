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
import React from 'react';
import { useLocation } from 'react-router-dom';
import _ from 'lodash';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}


/**
 * get query params on the url.
 * @param {string[]} params the params' name
 * @returns {object} an object,with params' name as its key and the query value as its value
 */
export function useQueryParams(params) {
  if (!_.isArray(params)) {
    throw new TypeError('params should be an array of string');
  }
  const queryObj = useQuery();
  const query = {};
  for (const param of new Set(params)) {
      const res = queryObj.get(param);
      if(res){
        query[param] = res;
      }
      
  };
  return query;
}
