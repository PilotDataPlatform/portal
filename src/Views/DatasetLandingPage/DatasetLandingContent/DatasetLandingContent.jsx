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
import React, { useState } from 'react';
import { Tabs } from 'antd';
import MyDatasetsList from '../Components/MyDatasetList/MyDatasetsList';
import styles from './index.module.scss';
import DatasetListActions from '../Components/DatasetListActions/DatasetListActions';
import CreateDatasetPanel from '../Components/CreateDatasetPanel/CreateDatasetPanel';

const { TabPane } = Tabs;

const ACTIONS = { default: 'default', search: 'search', create: 'create' };

function DatasetLandingContent(props) {
  const [action, setAction] = useState(ACTIONS.default);

  return (
    <div className={styles.tab}>
      <Tabs
        tabBarExtraContent={
          <DatasetListActions
            ACTIONS={ACTIONS}
            action={action}
            setAction={setAction}
          />
        }
      >
        <TabPane tab="My Datasets" key="My Datasets">
          {action === ACTIONS.create && (
            <CreateDatasetPanel
              ACTIONS={ACTIONS}
              action={action}
              setAction={setAction}
            />
          )}
          <MyDatasetsList />
        </TabPane>
        {/* <TabPane tab="All Datasets" key="All Datasets">
        All Datasets
      </TabPane> */}
      </Tabs>
    </div>
  );
}

export default DatasetLandingContent;
