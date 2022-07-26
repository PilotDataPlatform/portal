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
import styles from './index.module.scss';
import { MANIFEST_ATTR_TYPE } from '../../../Views/Project/Settings/Tabs/manifest.values';
import { Form, Select, Input } from 'antd';
function ManifestForm(props) {
  function renderAttr(attr) {
    if (attr.type === MANIFEST_ATTR_TYPE.MULTIPLE_CHOICE) {
      return (
        <Form.Item
          key={attr.name}
          label={attr.name}
          name={attr.name}
          className={styles.custom_attr_form}
          rules={
            !attr.optional
              ? [
                  {
                    required: true,
                  },
                ]
              : []
          }
        >
          <Select
            allowClear={attr.optional}
            onChange={(e) => {
              const newVal = {
                ...props.attrForm,
              };
              newVal[attr.name] = e ? e : '';
              props.setAttrForm(newVal);
            }}
            getPopupContainer={() => document.getElementById('manifest-form')}
          >
            {attr.value.split(',').length
              ? attr.value.split(',').map((value) => (
                  <Select.Option key={value} value={value}>
                    {value}
                  </Select.Option>
                ))
              : null}
          </Select>
        </Form.Item>
      );
    }
    if (attr.type === MANIFEST_ATTR_TYPE.TEXT)
      return (
        <Form.Item
          key={attr.name}
          label={attr.name}
          name={attr.name}
          className={styles.custom_attr_form}
          rules={
            !attr.optional
              ? [
                  {
                    required: true,
                  },
                ]
              : []
          }
        >
          <Input
            placeholder="max. 100 characters"
            onChange={(e) => {
              const newVal = {
                ...props.attrForm,
              };
              newVal[attr.name] = e.target.value;
              props.setAttrForm(newVal);
            }}
          ></Input>
        </Form.Item>
      );
    return null;
  }

  return (
    <Form
      layout="horizontal"
      labelCol={{ span: 10 }}
      wrapperCol={{ span: 12 }}
      style={{ maxHeight: 195, position: 'relative' }}
      id="manifest-form"
    >
      {props.manifest.attributes.map((attr) => {
        return renderAttr(attr);
      })}
    </Form>
  );
}

export default ManifestForm;
