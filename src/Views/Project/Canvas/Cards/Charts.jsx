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
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { message, Spin } from 'antd';
import {
  FileTextOutlined,
  HddOutlined,
  CloudUploadOutlined,
  DownloadOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import HeatMapTabSwitcher from '../Charts/Card/HeatMapTabSwitcher';
import { StackedAreaPlot } from '../Charts/Card';
import { useTheme } from '../../../../Themes/theme';
import styles from './index.module.scss';
import {
  convertToFileSizeInUnit,
  setLabelsDate,
  getCurrentYear,
  getFileSize,
  curTimeZoneOffset,
  useCurrentProject,
} from '../../../../Utility';
import {
  getProjectStatistics,
  getProjectFileSize,
  getProjectActivity,
  getUserOnProjectAPI,
} from '../../../../APIs';

function Charts() {
  const theme = useTheme();
  const { t } = useTranslation(['errorMessages']);
  const [currentProject] = useCurrentProject();

  const [projectStats, setProjectStats] = useState([]);
  const [isProjectStatsLoading, setIsProjectStatsLoading] = useState(true);

  const [projectFileSize, setProjectFileSize] = useState([]);
  const [isProjectFileSizeLoading, setIsProjectFileSizeLoading] =
    useState(true);

  const [projectFileActivity, setProjectFileActivity] = useState({
    download: [],
    upload: [],
    delete: [],
    copy: [],
  });
  const [isProjectFileActivityLoading, setIsProjectFileActivityLoading] =
    useState(true);

  // formatter functions causes unnecessary re-render in StackedAreaPlot. Meta property in config is dependant on the data and must be reintialized when projectFileSize data is ready
  const SAPConfig = useMemo(
    () => ({
      meta: {
        size: {
          type: 'linear',
          formatter: (val) => convertToFileSizeInUnit(val),
        },
        date: {
          range: [0, 1],
          formatter: (val) => setLabelsDate(val, SAPCurrentYear),
        },
      },
    }),
    [projectFileSize],
  );
  const tzOffset = curTimeZoneOffset();

  const SAPDataField = {
    xField: 'date',
    yField: 'size',
    seriesField: 'source',
  };
  const SAPCurrentYear = getCurrentYear(projectFileSize);

  const heatMapDataField = {
    xField: 'week',
    yField: 'day',
    colorField: 'frequency',
  };

  const getStatAttrs = (meta, stat) => {
    switch (meta) {
      case 'totalCount':
        return {
          class: 'file-total',
          title: 'Total Files',
          icon: <FileTextOutlined />,
          stat,
        };
      case 'totalSize':
        return {
          class: 'file-size',
          title: 'Total File Size',
          icon: <HddOutlined />,
          stat: getFileSize(stat, { roundingLimit: 1 }),
        };
      case 'totalUsers':
        return {
          class: 'users-total',
          title: 'Project Members',
          icon: <TeamOutlined />,
          stat,
        };
      case 'todayUploaded':
        return {
          class: 'uploaded',
          title: 'Uploaded',
          icon: <CloudUploadOutlined />,
          stat,
        };
      case 'todayDownloaded':
        return {
          class: 'downloaded',
          title: 'Downloaded',
          icon: <DownloadOutlined />,
          stat,
        };
    }
  };

  useEffect(() => {
    async function fetchProjectStats() {
      if (currentProject?.code) {
        const params = { time_zone: tzOffset };
        try {
          const statsResults = await getProjectStatistics(
            params,
            currentProject.code,
          );

          const result = Object.keys(statsResults.data).map((stat) => ({
            [stat]: statsResults.data[stat],
          }));

          if (currentProject.permission === 'admin') {
            const usersResults = await getUserOnProjectAPI(currentProject.id, {
              page: 0,
              pageSize: 10,
              orderBy: 'time_created',
              orderType: 'desc',
            });
            // move user stat to second item in array
            result.splice(1, 0, {
              user: { totalUsers: usersResults.data.total },
            });
          }
          setProjectStats(result);
        } catch {
          message.error(t('errorMessages:projectMetaData:statistics:0'));
        }

        setIsProjectStatsLoading(false);
      }
    }
    fetchProjectStats();
  }, [currentProject]);

  useEffect(() => {
    async function fetchProjectFileSize() {
      if (currentProject?.code) {
        const toMonth = moment().endOf('month').format('YYYY-MM-DDTHH:mm:ss');
        const fromMonth = moment()
          .subtract(15, 'months')
          .startOf('month')
          .format('YYYY-MM-DDTHH:mm:ss');

        const params = {
          from: fromMonth,
          to: toMonth,
          group_by: 'month',
          time_zone: tzOffset,
        };
        try {
          const fileSizeResults = await getProjectFileSize(
            params,
            currentProject.code,
          );
          const plotData = fileSizeResults.data.data.datasets.reduce(
            (result, dataset) => {
              const datasetKeys = Object.keys(dataset);
              const label = dataset[datasetKeys[0]];
              const values = dataset[datasetKeys[1]];

              values.forEach((val, index) => {
                result.push({
                  [SAPDataField.seriesField]: label,
                  [SAPDataField.xField]: fileSizeResults.data.data.labels[index]
                    .split('-')
                    .reverse()
                    .join('-'),
                  [SAPDataField.yField]: val,
                });
              });

              return result;
            },
            [],
          );
          setProjectFileSize(plotData);
        } catch {
          message.error(t('errorMessages:projectMetaData:size:0'));
        }
        setIsProjectFileSizeLoading(false);
      }
    }

    fetchProjectFileSize();
  }, [currentProject]);

  useEffect(() => {
    async function fetchProjectFileActivity() {
      if (currentProject?.id) {
        const toMonth = moment().format('YYYY-MM-DDTHH:mm:ss');
        const fromMonth = moment()
          .subtract(5, 'months')
          .startOf('month')
          .format('YYYY-MM-DDTHH:mm:ss');

        const response = [];

        const activity = ['download', 'upload', 'delete'];
        if (currentProject.permission === 'admin') activity.push('copy');
        for (let act of activity) {
          const params = {
            from: fromMonth,
            to: toMonth,
            group_by: 'day',
            time_zone: tzOffset,
            type: act,
          };

          response.push(getProjectActivity(params, currentProject.code));
        }

        try {
          // response array of 4 api calls
          const activitiesResponse = await Promise.all(response);
          const activitiesResult = activitiesResponse.map((activity) => ({
            data: activity.data.data,
          }));
          const allActivities = {};
          // transform data property of each activity into an array of objects
          activitiesResult.forEach((activityData, index) => {
            const dataKey = Object.keys(activityData)[0];
            const activityObject = activityData[dataKey];
            const data = Object.keys(activityObject).map(
              (activityObjectKey) => {
                return {
                  [activityObjectKey]: activityObject[activityObjectKey],
                };
              },
            );

            allActivities[activity[index]] = { data };
          });
          // map a new array with objects to map with heatmap chart
          const result = {};
          for (let act in allActivities) {
            const data = allActivities[act].data.map((item) => {
              const key = Object.keys(item)[0];
              const date = moment(key, 'YYYY MM DD');
              const fullDate = date.format('dddd, MMMM Do YYYY');

              return {
                date: fullDate,
                day: parseInt(date.format('d')),
                week: date.format('w'),
                frequency: item[key],
              };
            });

            result[act] = data;
          }
          setProjectFileActivity(result);
        } catch {
          message.error(t('errorMessages:projectMetaData:activity:0'));
        }
        setIsProjectFileActivityLoading(false);
      }
    }
    fetchProjectFileActivity();
  }, [currentProject]);

  function sortProjectStats() {
    const stats = projectStats.map((item) => {
      const key = Object.keys(item)[0];
      return item[key];
    });

    const statMapping = [];
    for (let statsObj of stats) {
      const statKeys = Object.keys(statsObj);

      for (let stat of statKeys) {
        if (stat !== 'totalPerZone') {
          statMapping.push({ [stat]: statsObj[stat] });
        }
      }
    }

    return statMapping;
  }

  function appendProjectStats() {
    const statMapping = sortProjectStats();

    return statMapping.map((metaObj) => {
      const key = Object.keys(metaObj)[0];
      const attrs = getStatAttrs(key, metaObj[key]);

      return (
        <li className={styles[`meta__${attrs.class}`]}>
          <div>
            <span>{attrs.title}</span>
            <div className={styles['meta-stat']}>
              {attrs.icon}
              <span>{attrs.stat}</span>
            </div>
          </div>
        </li>
      );
    });
  }

  return (
    <div className={styles.charts}>
      <Spin spinning={isProjectStatsLoading}>
        <ul className={styles['charts__meta']}>{appendProjectStats()}</ul>
      </Spin>

      <div className={styles['charts__graphs']}>
        <div className={styles['graphs__container']}>
          <h4 className={styles['graphs__title']}>Projects File Size</h4>
          <Spin spinning={isProjectFileSizeLoading}>
            <StackedAreaPlot
              data={projectFileSize}
              xField={SAPDataField.xField}
              yField={SAPDataField.yField}
              seriesField={SAPDataField.seriesField}
              color={theme.charts.stackedAreaPlot}
              chartConfig={SAPConfig}
            />
          </Spin>
        </div>

        <div className={styles['graphs__container']}>
          <h4 className={styles['graphs__title']}>Project File Activity</h4>
          <Spin spinning={isProjectFileActivityLoading}>
            <HeatMapTabSwitcher
              downloadData={projectFileActivity.download}
              uploadData={projectFileActivity.upload}
              deleteData={projectFileActivity.delete}
              copyData={projectFileActivity.copy}
              dataMapping={heatMapDataField}
              role={currentProject.permission}
            />
          </Spin>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Charts);
