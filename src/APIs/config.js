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
import axios from 'axios';
import { message } from 'antd';
import _ from 'lodash';
import camelcaseKeys from 'camelcase-keys';
import { activeManager } from '../Service/activeManager';
import { keycloak } from '../Service/keycloak';
import { API_PATH, PORTAL_PREFIX, UPLOAD_URL, DOWNLOAD_GR } from '../config';

/**
 * For axios to handle the success response
 * @param {AxiosResponse} response
 */
function successHandler(response) {
  const url = _.get(response, 'config.url');
  if (url && url !== '/users/refresh') {
    activeManager.activate();
  }
  return camelcaseKeys(response, { deep: true });
}

const useHeader = (item) => {
  item.interceptors.request.use((request) => {
    request.headers['Authorization'] = 'Bearer ' + keycloak.token;
    return request;
  });
};

/**
 *
 * @param {AxiosError} error
 */
function errorHandler(error) {
  if (error.response) {
    const { data, status } = error.response;

    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx

    switch (status) {
      case 401: {
        if (data.result === 'Permission Denied') {
          message.warning('User permission denied.');
        } else if (window.location.pathname !== PORTAL_PREFIX + '/') {
          console.log('logout in config.js since 401');
        }

        break;
      }
      default: {
      }
    }
  } else if (error.request) {
    if (error.request.status === 0) {
    }
  } else {
    // If caused by axios canceltoken, it will have an error message.
    if (error.message) {
      message.error(error.message || 'The request has been cancelled');
    } else {
      // Else, print the vague message.
      message.error('Error Network: please check your network connection');
    }
  }
  return new Promise((resolve, reject) => reject(error));
}
console.log('REACT_APP_', process.env);
let kongAPI = API_PATH;
let devOpServerUrl = API_PATH + '/dataops';

const serverAxios = axios.create({
  baseURL: kongAPI,
});

// serverAxios.defaults.withCredentials = true;
serverAxios.defaults.headers.post['Content-Type'] = 'application/json';
serverAxios.defaults.timeout = 100000;

const CancelToken = axios.CancelToken;

//Adding a interceptor to axios, so it handles expire issue before .then and .error
serverAxios.interceptors.response.use(successHandler, errorHandler);
useHeader(serverAxios);

const serverAxiosNoIntercept = axios.create({
  baseURL: kongAPI,
});
serverAxiosNoIntercept.defaults.headers.post['Content-Type'] =
  'application/json';
serverAxiosNoIntercept.defaults.timeout = 100000;
useHeader(serverAxiosNoIntercept);
/**
 * executes the api calling function
 * and returns both the cancel object of the axios call and the promise.
 * you can cancel this API request by calling source.cancel()
 * @param {(...arg)=>AxiosPromise<any>} requestFunction the api function that return.
 * @param {any[]} arg other payloads of the request function
 * @returns {{request:(...arg:any[],source:CancelTokenSource)=>AxiosPromise<any>,source:CancelTokenSource}}   request: the axios result, source: the axios cancellation object
 */
function cancelRequestReg(requestFunction, ...arg) {
  const source = CancelToken.source();
  return {
    request: requestFunction(...arg, source.token),
    source,
  };
}

const uploadAxios = axios.create({ baseURL: UPLOAD_URL });
uploadAxios.defaults.headers.post['Content-Type'] = 'application/json';
uploadAxios.defaults.timeout = 10000;
useHeader(uploadAxios);
uploadAxios.interceptors.response.use(successHandler, errorHandler);

const downloadGRAxios = axios.create({ baseURL: DOWNLOAD_GR });
downloadGRAxios.defaults.headers.post['Content-Type'] = 'application/json';
downloadGRAxios.defaults.timeout = 10000;
useHeader(downloadGRAxios);
downloadGRAxios.interceptors.response.use(successHandler, errorHandler);

export {
  axios,
  serverAxios,
  serverAxiosNoIntercept,
  cancelRequestReg,
  devOpServerUrl,
  kongAPI,
  uploadAxios,
  downloadGRAxios,
};
