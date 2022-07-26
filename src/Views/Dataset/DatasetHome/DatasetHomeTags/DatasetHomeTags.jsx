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
import React, { useEffect, useState } from 'react';
import { Skeleton, Form, Tag, message } from 'antd';
import { CardExtra } from '../Components/CardExtra/CardExtra';
import { TagsInput } from '../Components/TagsInput/TagsInput';
import { DatasetCard as Card } from '../../Components/DatasetCard/DatasetCard';
import { validators } from '../../../DatasetLandingPage/Components/CreateDatasetPanel/createDatasetValidators';
import { useSelector } from 'react-redux';
export default function DatasetHomeTags(props) {
  const [form] = Form.useForm();
  const {
    loading,
    hasInit,
    basicInfo: { geid, tags },
  } = useSelector((state) => state.datasetInfo);

  useEffect(() => {
    if (hasInit) {
      form.setFieldsValue({ tags });
    }
  }, [hasInit, geid]);

  return (
    <Card title="Tags">
      <Skeleton loading={loading}>
        {' '}
        <Form form={form}>
          <Form.Item rules={validators.tags} name="tags">
            {tags?.map((tag) => (
              <Tag>{tag}</Tag>
            ))}
          </Form.Item>
        </Form>
      </Skeleton>
    </Card>
  );
}
