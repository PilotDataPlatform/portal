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
import React, { useState, useEffect } from 'react';
import { Card, Space, Button } from 'antd';
import {
  DownloadOutlined,
  EditOutlined,
  ImportOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import styles from './ExplorerActions.module.scss';
import { EDIT_MODE } from '../../../../../Redux/Reducers/datasetData';
import { Move } from './Actions/Move/Move';
import CreateFolder from './Actions/CreateDatasetFolder/CreateDatasetFolderPlugin';
import BidsValidator from './Actions/BidsValidator/BidsValidator';

export function ExplorerActions(props) {
  const editorMode = useSelector((state) => state.datasetData.mode);
  const selectedData = useSelector((state) => state.datasetData.selectedData);
  const basicInfo = useSelector((state) => state.datasetInfo.basicInfo);
  const moveCondition =
    selectedData.length !== 0 && editorMode !== EDIT_MODE.EIDT_INDIVIDUAL;
  return (
    <div className={styles['actions']}>
      <Space>
        {' '}
        {/* 
        <Button
          disabled={!hasData}
          className={hasData && styles['button-enable']}
          type="link"
          icon={<DownloadOutlined />}
        >
          Download
        </Button>{' '} */}
        {/* <Button
          disabled={!hasData}
          className={hasData && styles['button-enable']}
          type="link"
          icon={<EditOutlined />}
        >
          Edit
        </Button>{' '}
        <Button
          type="link"
          className={styles['button-enable']}
          icon={<ImportOutlined />}
        >
          Import Data
        </Button>{' '} */}
        <Move />
        <CreateFolder />
      </Space>
      { basicInfo.type && basicInfo.type === 'BIDS' && <BidsValidator />}
    </div>
  );
}
