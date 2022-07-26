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
import { useSelector, useDispatch } from 'react-redux';
import { schemaTemplatesActions } from '../../../../../Redux/actions';
import { JsonMonacoEditor } from '../../../DatasetData/Components/DatasetDataPreviewer/JSON/JsonMonacoEditor/JsonMonacoEditor';
import { CloseOutlined } from '@ant-design/icons';
import { getSchemaDataDetail } from '../../../../../APIs';
import variables from '../../../../../Themes/base.scss';
export function OpenMindsPreviewer(props) {
  const dispatch = useDispatch();
  const schemas = useSelector((state) => state.schemaTemplatesInfo.schemas);
  const schemaPreviewGeid = useSelector(
    (state) => state.schemaTemplatesInfo.schemaPreviewGeid,
  );
  const selSchema = schemas.find((s) => s.geid === schemaPreviewGeid);
  const datasetInfo = useSelector((state) => state.datasetInfo.basicInfo);
  const datasetGeid = datasetInfo.geid;
  const [json, setJson] = useState(null);
  useEffect(() => {
    async function loadSchemaDetail() {
      const res = await getSchemaDataDetail(datasetGeid, schemaPreviewGeid);
      if (res?.data?.result?.content) {
        const schemaDataJSON = res?.data?.result?.content;
        setJson(schemaDataJSON);
      }
    }
    if (schemaPreviewGeid) {
      loadSchemaDetail();
    }
  }, [schemaPreviewGeid]);
  return selSchema ? (
    <div>
      <div
        style={{
          background: '#E6F5FF',
          color: variables.primaryColorLight1,
          fontSize: 14,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '5px 30px',
          marginBottom: 10,
        }}
      >
        <span>{selSchema.name}</span>
        <CloseOutlined
          style={{ color: '#818181' }}
          onClick={(e) => {
            dispatch(schemaTemplatesActions.setPreviewSchemaGeid(null));
          }}
        />
      </div>
      {json ? (
        <JsonMonacoEditor key={schemaPreviewGeid} json={json} format={true} />
      ) : null}
    </div>
  ) : null;
}
