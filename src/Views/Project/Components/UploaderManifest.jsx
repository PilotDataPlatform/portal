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
import React, { useEffect } from 'react';
import { Form, Select } from 'antd';
import ManifestForm from '../../../Components/Form/Manifest/ManifestForm';
import styles from './index.module.scss';
const { Option } = Select;
const UploaderManifest = function (props) {
  const [form] = Form.useForm();
  useEffect(() => {
    if (props.selManifest == null) {
      form.resetFields();
    }
  }, [props.selManifest]);

  return (
    <>
      <Form layout="vertical" form={form}>
        <Form.Item name="manifest" label="File Attribute">
          <Select
            className={styles.inputBorder}
            allowClear={true}
            style={{ width: 200 }}
            onChange={(value) => {
              if (!value) {
                props.setSelManifest(null);
                return;
              }
              const selM = props.manifestList.find((man) => man.id == value);
              props.setSelManifest(selM);
            }}
            value={props.selManifest ? props.selManifest.id : null}
          >
            {props.manifestList.map((man) => (
              <Option key={man.id}>{man.name}</Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
      {props.selManifest && (
        <div
          style={{
            margin: '0 -24px',
            padding: '30px 0',
            background: '#E6F5FF',
            maxHeight: 195,
            overflowY: 'scroll',
          }}
        >
          <ManifestForm
            manifest={props.selManifest}
            attrForm={props.attrForm}
            setAttrForm={props.setAttrForm}
          />
        </div>
      )}
    </>
  );
};
export default UploaderManifest;
