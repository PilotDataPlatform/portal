/*
Copyright (C) 2022 Indoc Research

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
import React, { useState, useEffect,useContext } from 'react';
import { useSelector } from 'react-redux';
import {useDispatch} from 'react-redux'

/**
 *
 * @param {string} key the key of this file explorer instance, to get data from redux
 */
function useFetch(key,contextObject) {
    
  const fileExplorerTableState = useSelector(
    (state) => state.fileExplorerTable,
  );
  const dispatch = useDispatch();
  const {
    data,
    loading,
    pageSize,
    page,
    total,
    columnsComponentMap,
    isSidePanelOpen,
    selection,
    currentPlugin,
    refreshNum,
    hardFreshKey,
    currentGeid,
    orderType,
    orderBy,
  } = fileExplorerTableState[key] || {};


  const toPage = (page)=>{
    //disPatch the page to redux
    // call the API
    contextObject.toPage();
  }
  const changePageSize = (pageSize)=>{
      //dispatch the new page size to redux
      // call the API 
  }

  const refresh = ()=>{
      //pure refresh, without changing any parameter
  };

  const hardRefresh = ()=>{
      // reset all parameter and refresh the table
  }

  // this method will only used by customized plugins
  const customizeFetch = (paramsObject)=>{
      // call the API with this params object
      // fetch.customizedFetch({page,pageSize, ...others})
  };

  const fetcher = {
      toPage,
      changePageSize,
      refresh,
      hardRefresh,
      customizeFetch
  }
  return fetcher;
};


// usage
const fetcher = useFetch('1234');

const onChange = (page)=>{
    onEvent({type:'changePage'},null);
    
}
