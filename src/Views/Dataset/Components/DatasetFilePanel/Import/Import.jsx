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
import { List } from 'antd';
import { FilePanelItem } from '../../FilePanelItem/FilePanelItem';
import { SyncOutlined } from '@ant-design/icons';
import { countStatus, parsePath, fetchFileOperations } from '../utility';
import { useSelector, useDispatch } from 'react-redux';

export function Import(props) {
  const { geid } = props;

  const { import: importOperations } = useSelector(
    (state) => state.datasetFileOperations,
  );
  const dispatch = useCallback(useDispatch(), []);

  useEffect(() => {
    fetchFileOperations('import', geid, dispatch);
  }, [geid, dispatch]);

  const [runningCount, errorCount, finishCount, initCount, cancelCount] =
    countStatus(importOperations);

  return (
    <>
      <div className={'list-header'}>
        {' '}
        {initCount} waiting, {runningCount} running, {errorCount} error,{' '}
        {finishCount} finish, {cancelCount} cancelled
      </div>
      <List
        dataSource={importOperations}
        renderItem={(record, index) => {
          const itemProps = {
            originalFullPath: record.payload.name,
            status: record.status,
            icon: <SyncOutlined />,
          };
          return <FilePanelItem {...itemProps} />;
        }}
      ></List>
    </>
  );
}
