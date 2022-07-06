import React, { useState, useEffect } from 'react';
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
import HeatMapTabSwitcher from '../Charts/Card/HeatMapTabSwitcher';
import { StackedAreaPlot } from '../Charts/Card';
import { useTheme } from '../../../../Themes/theme';
import styles from './index.module.scss';
import {
  convertToFileSizeInUnit,
  setLabelsDate,
  getCurrentYear,
  getFileSize,
} from '../../../../Utility';
import {
  getProjectStatistics,
  getProjectFileSize,
  getProjectActivity,
  getUserOnProjectAPI,
} from '../../../../APIs';

function Charts() {
  const theme = useTheme();
  const { project, role } = useSelector((state) => state);

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

  const tzOffset = moment().utcOffset() / 60 + ':00';

  const SAPDataField = {
    xField: 'date',
    yField: 'size',
    seriesField: 'source',
  };
  const SAPCurrentYear = getCurrentYear(projectFileSize);
  const SAPConfig = {
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
  };

  const heatMapDataField = {
    xField: 'week',
    yField: 'day',
    colorField: 'frequency',
  };

  const getStatAttrs = (meta, stat) => {
    switch (meta) {
      case 'total_count':
        return {
          class: 'file-total',
          title: 'Total Files',
          icon: <FileTextOutlined />,
          stat,
        };
      case 'total_size':
        return {
          class: 'file-size',
          title: 'Total File Size',
          icon: <HddOutlined />,
          stat: getFileSize(stat, { roundingLimit: 1 }),
        };
      case 'total_users':
        return {
          class: 'users-total',
          title: 'Project Members',
          icon: <TeamOutlined />,
          stat,
        };
      case 'today_uploaded':
        return {
          class: 'uploaded',
          title: 'Uploaded',
          icon: <CloudUploadOutlined />,
          stat,
        };
      case 'today_downloaded':
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
      if (project.profile?.id) {
        const params = { time_zone: tzOffset };
        try {
          // let statsResults = await getProjectStatistics(
          //   params,
          //   project.profile.code,
          // );
          const statsResults = {
            files: {
              total_count: 226,
              total_size: 16000000000,
            },
            activity: {
              today_uploaded: 100,
              today_downloaded: 150,
            },
          };

          const result = Object.keys(statsResults).map((stat) => ({
            [stat]: statsResults[stat],
          }));

          if (role === 'admin') {
            const usersResults = await getUserOnProjectAPI(project.profile.id, {
              page: 0,
              pageSize: 10,
              orderBy: 'time_created',
              orderType: 'desc',
            });
            // move user stat to second item in array
            result.splice(1, 0, {
              user: { total_users: usersResults.data.total },
            });
          }
          setProjectStats(result);
        } catch {
          message.error(
            'Something went wrong while retrieving project statistics',
          );
        }

        setIsProjectStatsLoading(false);
      }
    }
    fetchProjectStats();
  }, [project?.profile]);

  useEffect(() => {
    async function fetchProjectFileSize() {
      if (project.profile?.id) {
        const toMonth = moment().startOf('month').format('YYYY-MM-DDTHH:mm:ss');
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
          // const fileSizeResults = await getProjectFileSize(params, project.profile.id);
          const fileSizeResults = {
            data: {
              labels: ['2022-01', '2022-02', '2022-03'],
              datasets: [
                {
                  label: 0, // Will be mapped to "greenroom" in bff
                  values: [536870912, 715827882, 920350134],
                },
                {
                  label: 1, // Will be mapped to "core" in bff
                  values: [107374182, 143165576, 184070026],
                },
              ],
            },
          };

          const plotData = fileSizeResults.data.datasets.reduce(
            (result, dataset) => {
              const datasetKeys = Object.keys(dataset);
              const label = dataset[datasetKeys[0]];
              const values = dataset[datasetKeys[1]];

              values.forEach((val, index) => {
                result.push({
                  // to remove when API is live, labels will have proper names
                  [SAPDataField.seriesField]:
                    label === 0 ? 'Greenroom' : 'Core',
                  [SAPDataField.xField]: fileSizeResults.data.labels[index]
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
          message.error(
            'Something went wrong while retrieving project file size',
          );
        }

        setIsProjectFileSizeLoading(false);
      }
    }

    fetchProjectFileSize();
  }, [project?.profile]);

  useEffect(() => {
    const mockAPI = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              '2022-01-01': 1,
              '2022-01-02': 0,
              '2022-01-03': 10,
              '2022-01-04': 23,
              '2022-01-05': 40,
              '2022-01-06': 10,
              '2022-01-07': 39,
              '2022-01-08': 22,
              '2022-01-09': 33,
              '2022-01-10': 18,
              '2022-01-11': 38,
              '2022-01-12': 19,
              '2022-01-13': 27,
              '2022-01-14': 38,
              '2022-01-15': 17,
              '2022-01-16': 27,
              '2022-01-17': 42,
              '2022-01-18': 41,
              '2022-01-19': 27,
              '2022-01-20': 15,
              '2022-01-21': 8,
              '2022-01-22': 4,
              '2022-01-23': 3,
              '2022-01-24': 27,
              '2022-01-25': 2,
              '2022-01-26': 0,
              '2022-01-27': 49,
              '2022-01-28': 38,
              '2022-01-29': 14,
              '2022-01-30': 17,
              '2022-01-31': 19,
              '2022-02-01': 3,
              '2022-02-02': 14,
              '2022-02-03': 23,
              '2022-02-04': 43,
              '2022-02-05': 12,
              '2022-02-06': 22,
              '2022-02-07': 32,
              '2022-02-08': 33,
              '2022-02-09': 23,
              '2022-02-10': 13,
              '2022-02-11': 13,
              '2022-02-12': 43,
              '2022-02-13': 23,
              '2022-02-14': 3,
              '2022-02-15': 37,
              '2022-02-16': 7,
              '2022-02-17': 27,
              '2022-02-18': 47,
              '2022-02-19': 50,
              '2022-02-20': 1,
              '2022-02-21': 13,
              '2022-02-22': 31,
              '2022-02-23': 33,
              '2022-02-24': 43,
              '2022-02-25': 32,
              '2022-02-26': 3,
              '2022-02-27': 23,
              '2022-02-28': 13,
            },
          });
        }, 3000);
      });
    };

    async function fetchProjectFileActivity() {
      if (project?.profile?.id) {
        const toMonth = moment().startOf('month').format('YYYY-MM-DDTHH:mm:ss');
        const fromMonth = moment()
          .subtract(6, 'months')
          .startOf('month')
          .format('YYYY-MM-DDTHH:mm:ss');

        const params = {
          from: fromMonth,
          to: toMonth,
          group_by: 'day',
          time_zone: tzOffset,
        };
        const response = [];

        const activity = ['download', 'upload', 'delete', 'copy'];
        for (let act of activity) {
          params.activity = act;
          response.push(mockAPI(params, project.profile.id));
          // response.push(getProjectActivity(params, project.profile.id));
        }

        try {
          // response array of 4 api calls
          const activitiesResponse = await Promise.all(response);
          const allActivities = {};
          // transform data property of each activity into an array of objects
          activitiesResponse.forEach((activityData, index) => {
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
          for (let activity in allActivities) {
            const data = allActivities[activity].data.map((item) => {
              const key = Object.keys(item)[0];
              const date = moment(key, 'YYYY MM DD');

              return {
                day: parseInt(date.format('d')),
                week: date.format('W'),
                frequency: item[key],
              };
            });

            result[activity] = data;
          }
          setProjectFileActivity(result);
          setIsProjectFileActivityLoading(false);
        } catch {
          message.error(
            'Something went wrong while retreiving project file activity',
          );
        }
      }
    }
    fetchProjectFileActivity();
  }, [project?.profile]);

  function sortProjectStats() {
    const stats = projectStats.map((item) => {
      const key = Object.keys(item)[0];
      return item[key];
    });

    const statMapping = [];
    for (let statsObj of stats) {
      const statKeys = Object.keys(statsObj);

      for (let stat of statKeys) {
        statMapping.push({ [stat]: statsObj[stat] });
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
      <ul className={styles['charts__meta']}>
        {isProjectStatsLoading ? (
          <Spin spinning={isProjectStatsLoading} />
        ) : (
          appendProjectStats()
        )}
      </ul>

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
            />
          </Spin>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Charts);
