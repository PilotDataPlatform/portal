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
import reduxActionWrapper from '../reduxActionWrapper';
import {
  appendUploadListCreator,
  updateUploadItemCreator,
  triggerEvent,
} from '../../Redux/actions';
import { preUpload } from './preUpload';
import { message } from 'antd';
import { FILE_OPERATIONS } from '../../Views/Project/Canvas/Charts/FileExplorer/FileOperationValues';
import { ErrorMessager, namespace } from '../../ErrorMessages';
import { getPath } from './getPath';
const [appendUploadListDispatcher, updateUploadItemDispatcher, triggerEventDispatcher] =
  reduxActionWrapper([
    appendUploadListCreator,
    updateUploadItemCreator,
    triggerEvent,
  ]);

/**
 * start the upload process
 * @param {object} data the data from the upload modal form, with the fileList and datasetId, uploader, etc.
 * @param {Async.queue} q the async queue object
 */
const uploadStarter = async (data, q) => {
  const timeStamp = Date.now();
  const fileList = data.fileList;

  preUpload(
    data.projectCode,
    data.uploader,
    data.jobType,
    data.tags,
    fileList,
    '',
    data.toExistingFolder,
    data.folderPath,
  )
    .then((res) => {
      const result = res.data.result;
      if (result?.length > 0) {
        // map array files to be uploaded and dispatch to store
        const fileActions = fileList.map((item, index) => {
          const file = item.originFileObj;
          const relativePath = getPath(file.webkitRelativePath);
          const resFile = result[index];

          return {
            status: 'waiting',
            progress: null,
            projectId: data.dataset,
            fileName: relativePath
              ? data.folderPath + '/' + relativePath + '/' + file.name
              : data.folderPath + '/' + file.name,
            projectName: data.projectName,
            projectCode: data.projectCode,
            createdTime: Date.now(),
            jobId: resFile.jobId,
          };
        });
        appendUploadListDispatcher(fileActions);
        triggerEventDispatcher('LOAD_UPLOAD_LIST');

        // map array of files to be uploaded and push to queue
        const newFileList = fileList.map((item, index) => {
          const resFile = result[index];

          return {
            file: item.originFileObj,
            datasetId: data.dataset,
            uploader: data.uploader,
            projectCode: data.projectCode,
            tags: data.tags,
            manifest: data.manifest,
            createdTime: Date.now(),
            sessionId: resFile.sessionId,
            resumableIdentifier: resFile.payload.resumableIdentifier,
            jobId: resFile.jobId,
            toExistingFolder: data.toExistingFolder,
            folderPath: data.folderPath,
          };
        });

        q.push(newFileList);
      } else {
        throw new Error('Failed to get identifiers from response');
      }
    })
    .catch((err) => {
      if (err.response?.status === 409) {
        for (const file of err.response?.data?.result) {
          const { name, relative_path } = file;
          const errorMessager = new ErrorMessager(
            namespace?.project?.files?.preUpload,
          );
          errorMessager.triggerMsg(err?.response?.status, null, {
            fileName: (relative_path ? relative_path + '/' : '') + name,
          });
        }
      } else {
        const errorMessager = new ErrorMessager(
          namespace?.project?.files?.preUpload,
        );
        errorMessager.triggerMsg(err?.response?.status, null);
      }
      for (const file of fileList) {
        updateUploadItemDispatcher({
          status: 'error',
          uploadedTime: Date.now(),
          projectCode: data.projectCode,
        });
      }
    });

  q.error((err, task) => {
    console.log(`task ${task} error`);
  });
};
export default uploadStarter;
