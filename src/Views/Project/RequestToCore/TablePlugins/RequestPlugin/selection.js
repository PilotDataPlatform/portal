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
import { Checkbox } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';

export const selectionOptions = {
  renderCell: function (checked, record, index, originNode) {
    const { reviewStatus } = record;
    if (record.archived) {
      return <Checkbox disabled />;
    }
    if (reviewStatus === 'approved') {
      return <CheckOutlined style={{ color: '#5b8c00' }} />;
    }
    if (reviewStatus === 'denied') {
      return <CloseOutlined style={{ color: '#ff6d72' }} />;
    }

    return originNode;
  },
  getCheckboxProps: function (record) {
    if (
      record.archived ||
      record.reviewStatus === 'approved' ||
      record.reviewStatus === 'denied'
    ) {
      return {
        disabled: true,
      };
    }
  },
};
