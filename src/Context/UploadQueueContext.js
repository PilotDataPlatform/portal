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