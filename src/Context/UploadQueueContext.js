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
import queue from 'async/queue';
import React from 'react';
import {fileUpload} from '../Utility/fileUpload';
const filesConcurrency = 1;

// https://www.npmjs.com/package/async-q#queue
const q = queue(function (task, callback) {
  new Promise((resolve,reject)=>{
    fileUpload(task,resolve,reject);
  }).then(res=>{
    callback();
  }).catch(err=>{
    callback();
  })
}, filesConcurrency);

const UploadQueueContext = React.createContext(q);
export {UploadQueueContext,q};