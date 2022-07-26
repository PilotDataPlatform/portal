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
import React, { useEffect, useCallback } from 'react';
import { ExplorerActions } from '../ExplorerActions/ExplorerActions';
import { ExplorerTree } from '../ExplorerTree/ExplorerTree';
import { DatasetCard as Card } from '../../../Components/DatasetCard/DatasetCard';
import styles from './DatasetDataExplorer.module.scss';
import { io } from 'socket.io-client';
import {
  fetchFileOperations,
  onImportFinish,
  onRenameFinish,
  deleteNodeWithGeids,
} from './utility';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { objectKeysToCamelCase } from '../../../../../Utility';
import { store } from '../../../../../Redux/store';
import { datasetDataActions } from '../../../../../Redux/actions';
import { initTree } from '../ExplorerTree/initTree';
import { DOMAIN } from '../../../../../config';

export default function DatasetDataExplorer(props) {
  const dispatch = useDispatch();

  const fetchFileOperationsThrottled = useCallback(
    _.throttle(fetchFileOperations, 5 * 1000, {
      leading: true,
      trailing: true,
    }),
    [],
  );

  const basicInfo = useSelector((state) => state.datasetInfo?.basicInfo);
  const geid = basicInfo.geid;

  const onDeleteFinish = (payload, treeData) => {
    let newTreeData = _.cloneDeep(treeData);
    if (newTreeData && payload?.source?.globalEntityId) {
      newTreeData = deleteNodeWithGeids(newTreeData, [
        payload?.source?.globalEntityId,
      ]);
      dispatch(datasetDataActions.setTreeData(newTreeData));
    }
  };

  let socketIoUrl = `${process.env['REACT_APP_SOCKET_PROTOCOL']}://${DOMAIN}`;

  useEffect(() => {
    if (geid) {
      const socket = io(`${socketIoUrl}/${geid}`);
      socket.on('DATASET_FILE_NOTIFICATION', (data) => {
        console.log(data);
        const { payload } = objectKeysToCamelCase(data);
        const actionType = _.replace(payload.action, 'dataset_file_', '');
        const { treeData } = store.getState().datasetData;
        if (payload.status === 'FINISH') {
          switch (actionType) {
            case 'import': {
              onImportFinish(payload, treeData, dispatch);
              break;
            }
            case 'rename': {
              onRenameFinish(payload, treeData, dispatch);
              break;
            }
            case 'delete': {
              onDeleteFinish(payload, treeData);
              break;
            }
            case 'move': {
              initTree();
              break;
            }
            default: {
            }
          }
        }

        fetchFileOperationsThrottled(actionType, geid, dispatch);
      });
      return () => {
        socket.close();
      };
    }
  }, [geid, dispatch, geid, fetchFileOperationsThrottled]);

  return (
    <Card className={styles['card']} title="Explorer">
      <ExplorerActions />
      <ExplorerTree />
    </Card>
  );
}
