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
import { Card, message, Skeleton } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import styles from './DatasetHeader.module.scss';
import DatasetHeaderLeft from '../DatasetHeaderLeft/DatasetHeaderLeft';
import DatasetHeaderRight from '../DatasetHeaderRight/DatasetHeaderRight';
import { useHistory, useParams } from 'react-router-dom';
import {
  getDatasetByDatasetCode,
  getProjectInfoAPI,
  getDatasetVersionsAPI,
  getBidsResult,
} from '../../../../APIs';
import { useDispatch, useSelector } from 'react-redux';
import { datasetInfoCreators } from '../../../../Redux/actions';
import { useTranslation } from 'react-i18next';

export default function DatasetHeader(props) {
  const { setDatasetDrawerVisibility } = props;
  const history = useHistory();
  const { datasetCode } = useParams();
  const dispatch = useDispatch();
  const { loading, basicInfo } = useSelector((state) => state.datasetInfo);
  const { t } = useTranslation(['errormessages']);

  const getDatasetVersions = async () => {
    const res = await getDatasetVersionsAPI(basicInfo.geid);
    if (res.data.result.length > 0) {
      // do the update dataset current version logic
      dispatch(
        datasetInfoCreators.setDatasetVersion(res.data.result[0].version),
      );
    }
  };

  useEffect(() => {
    if (basicInfo.geid) {
      getDatasetVersions();
    }
  }, [basicInfo.geid]);

  useEffect(() => {
    init();
  }, [datasetCode]);

  async function getProjectInfo(projectGeid) {
    try {
      const res = await getProjectInfoAPI(projectGeid);
      const projectInfo = res.data.result;
      dispatch(datasetInfoCreators.setProjectName(projectInfo.name));
    } catch (error) {
      message.error('Failed to get project name');
    }
  }

  const init = async () => {
    dispatch(datasetInfoCreators.setLoading(true));

    try {
      const {
        data: { result: basicInfo },
      } = await getDatasetByDatasetCode(datasetCode);

      if (basicInfo.geid) {
        const bidsResult = await getBidsResult(basicInfo.geid);
        if (
          bidsResult.status === 200 &&
          bidsResult.data.result.validateOutput
        ) {
          basicInfo['bidsResult'] = bidsResult.data.result.validateOutput;
          basicInfo['bidsUpdatedTime'] = bidsResult.data.result.updatedTime;
          basicInfo['bidsCreatedTime'] = bidsResult.data.result.createdTime;
          basicInfo['bidsLoading'] = false;
        }
      }
      dispatch(datasetInfoCreators.setDatasetVersion(''));
      dispatch(datasetInfoCreators.setBasicInfo(basicInfo));
      dispatch(datasetInfoCreators.setHasInit(true));

      if (basicInfo?.projectGeid) {
        await getProjectInfo(basicInfo.projectGeid);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        history.push('/error/404');
      } else if (error.response?.status === 403) {
        history.push('/error/403');
      } else {
        message.error(t('errormessages:getDatasetInfo.default.0'));
      }
    } finally {
      dispatch(datasetInfoCreators.setLoading(false));
    }
  };

  const goBack = () => {
    history.push('/datasets');
  };

  return (
    <Card className={styles['dataset-header-card']}>
      <Skeleton loading={loading}>
        <div className={styles['back-button']}>
          <LeftOutlined onClick={goBack} />
        </div>

        <div className={styles['left']}>
          <DatasetHeaderLeft
            setDatasetDrawerVisibility={setDatasetDrawerVisibility}
          />
        </div>

        <div className={styles['right']}>
          <DatasetHeaderRight />
        </div>
      </Skeleton>
    </Card>
  );
}
