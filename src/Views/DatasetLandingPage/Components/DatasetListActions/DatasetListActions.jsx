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
import { Menu, Dropdown, Button } from 'antd';
import {
  SortAscendingOutlined,
  DownOutlined,
  SearchOutlined,
  UpOutlined,
  PlusOutlined,
} from '@ant-design/icons';

export default function DatasetListActions(props) {
  const { ACTIONS, action, setAction } = props;

  const sortPanel = (
    <Menu onClick={() => {}}>
      <Menu.Item key="1" value="time-desc">
        Last created
      </Menu.Item>
      <Menu.Item id="uploadercontent_first_created" key="2" value="time-asc">
        First created
      </Menu.Item>
      <Menu.Item key="3" value="name-asc">
        Project name A to Z
      </Menu.Item>
      <Menu.Item key="4" value="name-desc">
        Project name Z to A
      </Menu.Item>
      <Menu.Item key="5" value="code-asc">
        Project code A to Z
      </Menu.Item>
      <Menu.Item key="6" value="code-desc">
        Project code Z to A
      </Menu.Item>
    </Menu>
  );

  if (action === ACTIONS.create) return null;

  return (
    <div>
      {/*       <span style={{ marginRight: '10px' }}>Sort by</span>
      <Dropdown overlay={sortPanel} placement="bottomRight">
        <Button style={{ borderRadius: '6px' }}>
          <SortAscendingOutlined />
          Sort
          <DownOutlined />
        </Button>
      </Dropdown>
      <Button onClick={() => {}}>
        <SearchOutlined />
        {action === ACTIONS.search ? <UpOutlined /> : <DownOutlined />}
      </Button> */}
      <Button
        type="link"
        onClick={() => {
          setAction(ACTIONS.create);
        }}
        style={{
          fontWeight: 500,
          fontSize: 16,
        }}
        icon={<PlusOutlined />}
      >
        Create New
      </Button>
    </div>
  );
}
