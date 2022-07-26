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
import React, { useEffect, useCallback, useRef } from 'react';
import { List, message } from 'antd';
import { FilePanelItem } from '../../FilePanelItem/FilePanelItem';
import { EditOutlined } from '@ant-design/icons';
import { countStatus, parsePath, fetchFileOperations } from '../utility';
import { useSelector, useDispatch } from 'react-redux';

export function Rename(props) {
  const { geid } = props;
  const { rename: renameOperations } = useSelector(
    (state) => state.datasetFileOperations,
  );
  const dispatch = useCallback(useDispatch(), []);
  
  useEffect(() => {
    fetchFileOperations('rename', geid, dispatch);
  }, [geid, dispatch]);

  const [runningCount, errorCount, finishCount, initCount, cancelCount] =
    countStatus(renameOperations);

  return (
    <>
      <div className={'list-header'}>
        {initCount} waiting, {runningCount} running, {errorCount} error,{' '}
        {finishCount} finish, {cancelCount} cancelled
      </div>
      <List
        dataSource={renameOperations}
        renderItem={(record, index) => {
          const itemProps = {
            originalFullPath: parsePath(record.payload),
            status: record.status,
            icon: <EditOutlined />,
          };
          return <FilePanelItem {...itemProps} />;
        }}
      ></List>
    </>
  );
}
