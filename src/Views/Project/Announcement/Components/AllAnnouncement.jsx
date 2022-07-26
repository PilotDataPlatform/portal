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
import React, { useState } from 'react';
import { Card, Tabs, DatePicker } from 'antd';
import { Today, All, LastSevenDays } from './Tabs';
import styles from '../index.module.scss';
const { TabPane } = Tabs;
export default function AllAnnouncement({ currentProject,indicator }) {
  const [dateString, setDateString] = useState('');
  const [currentTab, setCurrentTab] = useState('today');
  return (
    <Card title="All announcements">
      <Tabs
        className={styles.announcement_tabs}
        onChange={(key) => {
          setCurrentTab(key);
        }}
        style={{ margin: -18 }}
        activeKey={currentTab}
        tabBarExtraContent={
          currentTab === 'all' && (
            <DatePicker
              style={{
                margin: '10px 18px 0',
              }}
              onChange={(date, dateString) => {
                setDateString(dateString);
              }}
            />
          )
        }
      >
        <TabPane tab="Today" key="today">
          <Today indicator={indicator} currentProject={currentProject} />
        </TabPane>
        <TabPane tab="Last 7 days" key="lastSevenDays">
          <LastSevenDays indicator={indicator} currentProject={currentProject} />
        </TabPane>
        <TabPane tab="All" key="all">
          <All indicator={indicator} currentProject={currentProject} dateString={dateString} />
        </TabPane>
      </Tabs>
    </Card>
  );
}
