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
import React, { useState, useEffect } from 'react';
import { Input, Button, Select, Form } from 'antd';
const Option = Select.Option;

const defaultValues = (condition) => {
  if (condition.category === 'tags' && condition.keywords) {
    return condition.keywords
  } else {
    return []
  }
}

function TagsCondition({ condition, updateCondition, clearTrigger, form }) {
  useEffect(() => {
    if (clearTrigger) {
      form.resetFields(['tagsCondition', 'tagsKeyword']);
    }
  }, [clearTrigger]);
  const children = [];
  return (
    <>
      <Form.Item
        label="Condition"
        name="tagsCondition"
        style={{ width: '200px', marginRight: 18 }}
      >
        <Select defaultValue="contains" disabled showArrow={false}>
          <Option value="contain">Contains</Option>
        </Select>
      </Form.Item>
      <Form.Item
        label="Keyword"
        name="tagsKeyword"
        initialValue={defaultValues(condition)}
        rules={[
          {
            required: true,
          },
        ]}
        style={{ flex: 1, display: 'inline-block' }}
      >
        <Select
          mode="tags"
          style={{ width: '100%' }}
          onChange={(value) => {
            updateCondition(condition.cid, {
              keywords: value,
            });
          }}
        >
          {children}
        </Select>
      </Form.Item>
    </>
  );
}

export default TagsCondition;
