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
import { Input, Button, Select, Form } from 'antd';
const Option = Select.Option;

const defaultKeyWords = (condition) => {
  if (condition.category === 'file_name' && condition.keywords) {
    return condition.keywords
  } else {
    return ''
  }
}

function FileNameCondition({ condition, updateCondition, clearTrigger, form }) {
  useEffect(() => {
    if (clearTrigger) {
      form.resetFields(['fileNameCondition', 'fileNameKeyword']);
    }
  }, [clearTrigger]);

  return (
    <>
      <Form.Item
        label="Condition"
        name="fileNameCondition"
        style={{ width: '200px', marginRight: 18 }}
      >
        <Select
          value={condition.condition}
          defaultValue="contain"
          onChange={(value) => {
            updateCondition(condition.cid, {
              condition: value,
            });
          }}
        >
          <Option value="contain">Contains</Option>
          <Option value="equal">Equals</Option>
        </Select>
      </Form.Item>
      <Form.Item
        label="Keyword"
        initialValue={defaultKeyWords(condition)}
        name="fileNameKeyword"
        rules={[
          {
            required: true,
          },
        ]}
        style={{ flex: 1, display: 'inline-block' }}
      >
        <Input
          onChange={(e) => {
            updateCondition(condition.cid, {
              keywords: e.target.value,
            });
          }}
        />
      </Form.Item>
    </>
  );
}

export default FileNameCondition;
