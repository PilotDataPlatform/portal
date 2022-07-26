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
import React, { useState, useEffect, Fragment } from 'react';
import { Form, Space, Input, Checkbox, Select, Tag } from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import styles from './SchemaItem.module.scss';
import { getValidator } from './validators';
import _ from 'lodash';

const display = (value) => {
  if (_.isArray(value)) {
    return (
      <>
        {value.map((item) => (
          <Tag>{item}</Tag>
        ))}{' '}
      </>
    );
  }
  return <span className={styles['display']}>{value}</span>;
};

const typeOptions = {
  text: { label: 'Text', value: 'text' },
  'multiple-choice': { label: 'Multiple Choice', value: 'multiple-choice' },
  numeric: { label: 'Numeric', value: 'numeric' },
  'date-picker': { label: 'Date Picker', value: 'date-picker' },
};

export default function SchemaItem(props) {
  const { key, name, fieldKey, ...restField } = props.field;
  const { remove, form, templateManagerMode } = props;
  const [, reRender] = useState(Math.random());
  const [isEdit, setIsEdit] = useState(
    !Boolean(form.getFieldValue(['templateItems', name])),
  );
  const [cache, setCache] = useState(
    form.getFieldValue(['templateItems', name]),
  );
  const onChange = (value) => {
    reRender(Math.random());
    form.setFields([
      { name: ['templateItems', name, 'value'], value: undefined },
    ]);
  };

  const onConfirm = async () => {
    try {
      await form.validateFields([['templateItems', name, 'type']]);
      await form.validateFields([['templateItems', name, 'title']]);
      await form.validateFields([['templateItems', name, 'value']]);
      await form.validateFields([['templateItems', name, 'optional']]);

      setCache(form.getFieldValue(['templateItems', name]));
      setIsEdit(false);
    } catch (err) {
      console.log(err, 'err on confirm');
    }
  };

  const getField = () => {
    switch (form.getFieldValue(['templateItems', name, 'type'])) {
      case 'text':
        return null;
      case 'multiple-choice':
        return (
          <Select
            disabled={Boolean(cache) && templateManagerMode === 'update'}
            style={{ minWidth: 182 }}
            mode="tags"
          ></Select>
        );
      case 'numeric':
        return null;
      case 'date-picker':
        return null;
      default:
        return null;
    }
  };

  return (
    <Fragment>
      <Form.Item
        className={styles['column-1']}
        {...restField}
        name={[name, 'type']}
        fieldKey={[fieldKey, 'type']}
        rules={
          getValidator(
            form,
            form.getFieldValue(['templateItems', name, 'type']),
            isEdit,
          ).type
        }
      >
        {isEdit ? (
          <Select
            getPopupContainer={(triggerNode) => triggerNode.parentElement}
            options={[
              typeOptions.text,
              typeOptions['multiple-choice'],
              typeOptions.numeric,
              typeOptions['date-picker'],
            ]}
            disabled={Boolean(cache) && templateManagerMode === 'update'}
            onChange={onChange}
            style={{ width: 120 }}
          ></Select>
        ) : (
          display(
            typeOptions[form.getFieldValue(['templateItems', name, 'type'])]
              ?.label,
          )
        )}
      </Form.Item>

      <Form.Item
        className={styles['column-2']}
        {...restField}
        name={[name, 'title']}
        fieldKey={[fieldKey, 'title']}
        rules={getValidator(form, name, isEdit).title}
      >
        {isEdit ? (
          <Input
            disabled={Boolean(cache) && templateManagerMode === 'update'}
            placeholder="title"
            className={styles['input']}
          />
        ) : (
          display(form.getFieldValue(['templateItems', name, 'title']))
        )}
      </Form.Item>

      <Form.Item
        className={styles['column-3']}
        {...restField}
        fieldKey={[fieldKey, 'value']}
        name={[name, 'value']}
        rules={getValidator(form, name, isEdit).value}
      >
        {isEdit
          ? getField()
          : display(form.getFieldValue(['templateItems', name, 'value']))}
      </Form.Item>

      <Form.Item
        className={styles['column-4']}
        {...restField}
        fieldKey={[fieldKey, 'optional']}
        name={[name, 'optional']}
        valuePropName="checked"
      >
        <Checkbox className={styles['checkbox']} disabled={!isEdit}></Checkbox>
      </Form.Item>
      <Form.Item className={`${styles['column-5']} ${styles['action']}`}>
        {isEdit ? (
          <Space size="middle">
            <CheckOutlined
              className={styles['confirm-icon']}
              onClick={onConfirm}
            />
            <CloseOutlined
              className={styles['close-icon']}
              onClick={() => {
                if (!cache) {
                  remove(name);
                } else {
                  form.setFields([
                    { name: ['templateItems', name], value: cache },
                  ]);
                }
                setIsEdit(false);
              }}
            />
          </Space>
        ) : (
          <Space size="middle">
            <DeleteOutlined onClick={() => remove(name)} />
            <EditOutlined onClick={() => setIsEdit(true)} />
          </Space>
        )}
      </Form.Item>
    </Fragment>
  );
}
