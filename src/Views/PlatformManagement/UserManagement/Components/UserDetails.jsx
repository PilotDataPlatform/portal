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
import { Descriptions } from 'antd';
import { timeConvert, partialString } from '../../../../Utility';

function UserDetails(props) {
  const { record } = props;

  return (
    <div style={{ paddingBottom: '16px' }}>
      <Descriptions size="small" column={1}>
        <Descriptions.Item label="User Name">{record.name}</Descriptions.Item>
        {record.role === 'admin' ? (
          <Descriptions.Item label="Role">
            Platform Administrator
          </Descriptions.Item>
        ) : null}
        <Descriptions.Item label="Email">{record.email}</Descriptions.Item>
        <Descriptions.Item label="First Name">
          {record.firstName && record.firstName.length > 40
            ? partialString(record.firstName, 40, true)
            : record.firstName}
        </Descriptions.Item>
        <Descriptions.Item label="Last Name">
          {record.lastName && record.lastName.length > 40
            ? partialString(record.lastName, 40, true)
            : record.lastName}
        </Descriptions.Item>
        <Descriptions.Item label="Join Date">
          {record.timeCreated && timeConvert(record.timeCreated, 'datetime')}
        </Descriptions.Item>
        <Descriptions.Item label="Last Login Time">
          {record.lastLogin && timeConvert(record.lastLogin, 'datetime')}
        </Descriptions.Item>
        <Descriptions.Item label="Status">{record.status}</Descriptions.Item>
      </Descriptions>
    </div>
  );
}

export default UserDetails;
