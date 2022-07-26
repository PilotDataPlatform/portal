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
import { Tabs } from 'antd';
import {
  SyncOutlined,
  SwapOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import styles from './DatasetFilePanelContent.module.scss';
import { DatasetCard as Card } from '../DatasetCard/DatasetCard';
import { Import } from './Import/Import';
import { Delete } from './Delete/Delete';
import { Move } from './Move/Move';
import { Rename } from './Rename/Rename';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { tokenManager } from '../../../../Service/tokenManager';

import _ from 'lodash';

const { TabPane } = Tabs;

const getTabTitle = (action) => {
  switch (action) {
    case 'Import':
      return (
        <div style={{ color: '#1c5388' }}>
          <SyncOutlined />
          <span>Import</span>
        </div>
      );
    case 'Move':
      return (
        <div style={{ color: '#1c5388' }}>
          <SwapOutlined />
          <span>Move</span>
        </div>
      );
    case 'Rename':
      return (
        <div style={{ color: '#1c5388' }}>
          <EditOutlined />
          <span>Rename</span>
        </div>
      );
    case 'Delete':
      return (
        <div style={{ color: '#1c5388' }}>
          <DeleteOutlined />
          <span>Delete</span>
        </div>
      );
    default:
      return null;
  }
};

const title = (
  <>
    <span>Dataset Status</span>
  </>
);

const DatasetFilePanelContent = (props) => {
  const username = useSelector((state) => state.username);

  const sessionId = tokenManager.getCookie('sessionId');
  const geid = useSelector((state) => state.datasetInfo.basicInfo.geid);
  const filePaneProps = {
    operator: username,
    sessionId,
    geid,
  };

  return (
    <div className={styles.panel_popover_content}>
      <Card title={title} className={styles['panel_content_card']}>
        <Tabs className={styles.tab} tabPosition={'left'} tabBarGutter={1}>
          <TabPane
            className={styles['tab-pane']}
            tab={getTabTitle('Import')}
            key="Import"
          >
            <Import {...filePaneProps} />
          </TabPane>
          <TabPane
            className={styles['tab-pane']}
            tab={getTabTitle('Move')}
            key="Move"
          >
            <Move {...filePaneProps} />
          </TabPane>
          <TabPane
            className={styles['tab-pane']}
            tab={getTabTitle('Rename')}
            key="Rename"
          >
            <Rename {...filePaneProps} />
          </TabPane>
          <TabPane
            className={styles['tab-pane']}
            tab={getTabTitle('Delete')}
            key="Delete"
          >
            <Delete {...filePaneProps} />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default DatasetFilePanelContent;
