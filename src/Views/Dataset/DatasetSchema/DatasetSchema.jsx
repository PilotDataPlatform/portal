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
import { useSelector, useDispatch } from 'react-redux';
import { message } from 'antd';
import styles from './DatasetSchema.module.scss';
import DatasetSchemaExisting from './DatasetSchemaExisting/DatasetSchemaExisting';
import DatasetSchemaTemplates from './DatasetSchemaTemplates/DatasetSchemaTemplates';
import { schemaTemplatesActions } from '../../../Redux/actions';
import {
  getDatasetSchemaListAPI,
  getDatasetDefaultSchemaTemplateListAPI,
  getDatasetCustomSchemaTemplateListAPI,
} from '../../../APIs/index';
import { ESSENTIAL_TPL_NAME } from './GlobalDefinition';
import { useTranslation } from 'react-i18next';

export default function DatasetData(props) {
  const datasetInfo = useSelector((state) => state.datasetInfo.basicInfo);
  const dispatch = useDispatch();
  const { t } = useTranslation(['errormessages', 'success']);

  // get datasetSchemaList
  const getDatasetSchemaList = async () => {
    try {
      const res = await getDatasetSchemaListAPI(datasetInfo.geid);
      dispatch(schemaTemplatesActions.updateDefaultSchemaList(res.data.result));
      return res.data.result;
    } catch (error) {
      message.error(t('errormessages:datasetSchemaList.default.0'));
    }
  };

  // get dataset schema templates list
  const getSchemaTemplates = async () => {
    try {
      const res = await getDatasetDefaultSchemaTemplateListAPI();
      const resCustom = await getDatasetCustomSchemaTemplateListAPI(
        datasetInfo.geid,
      );
      dispatch(
        schemaTemplatesActions.updateDefaultSchemaTemplateList([
          ...res.data.result,
          ...resCustom.data.result,
        ]),
      );
      return res.data.result;
    } catch (error) {
      message.error(t('errormessages:datasetSchemaTemplateList.default.0'));
    }
  };

  useEffect(() => {
    async function initData() {
      dispatch(schemaTemplatesActions.setSchemaTypes('Default'));
      dispatch(schemaTemplatesActions.clearDefaultOpenTab());
      const schemasTemplates = await getSchemaTemplates();
      const schemas = await getDatasetSchemaList();
      const essentialTpl = schemasTemplates.find(
        (el) => el.name === ESSENTIAL_TPL_NAME,
      );
      const essentialSchema = schemas.find(
        (el) => el.tplGeid === essentialTpl.geid,
      );
      if (essentialSchema) {
        dispatch(
          schemaTemplatesActions.addDefaultOpenTab({
            title: essentialTpl.name,
            key: essentialSchema.geid,
            tplKey: essentialSchema.tplGeid,
            systemDefined: essentialSchema.systemDefined,
            standard: essentialSchema.standard,
          }),
        );
        dispatch(
          schemaTemplatesActions.setDefaultActiveKey(essentialSchema.tplGeid),
        );
      }
    }
    if (datasetInfo.geid) {
      initData();
    }
  }, [datasetInfo.geid]);

  return (
    <div className={styles['container']}>
      <div className={styles['existing-schema']}>
        <DatasetSchemaExisting />
      </div>
      <div className={styles['blank-templates']}>
        <DatasetSchemaTemplates />
      </div>
    </div>
  );
}
