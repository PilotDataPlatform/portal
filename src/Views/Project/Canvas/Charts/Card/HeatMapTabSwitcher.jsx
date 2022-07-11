import React, { useMemo } from 'react';
import moment from 'moment';

import { TabSwitcher } from '../../../Components/TabSwitcher';
import HeatMap from './HeatMap';
import { useTheme } from '../../../../../Themes/theme';

const DOWNLOAD = 'downloads';
const UPLOAD = 'upload';
const DELETE = 'deletion';
const COPY = 'copy';

function HeatMapTabSwitcher({
  downloadData,
  uploadData,
  deleteData,
  copyData,
  dataMapping,
}) {
  const { charts } = useTheme();
  const activityColorMap = {
    [DOWNLOAD]: charts.heatgraph.range.green,
    [UPLOAD]: charts.heatgraph.range.blue,
    [DELETE]: charts.heatgraph.range.red,
    [COPY]: charts.heatgraph.range.orange,
  };
  const tabColorMap = {
    [DOWNLOAD]: activityColorMap[DOWNLOAD][2],
    [UPLOAD]: activityColorMap[UPLOAD][1],
    [DELETE]: activityColorMap[DELETE][1],
    [COPY]: activityColorMap[COPY][1],
  };
  const weeks = downloadData.reduce(
    (allWeeks, data) => [...allWeeks, data.week],
    [],
  );
  let startingWeek = downloadData.length && Math.min(...weeks);

  // use array as map for formatter. formatter function gets called twice, any variables it references outside its scope does not get re-initialized (startingWeek)
  const formatterMapping = weeks.reduce((savedWeeks, week) => {
    if ((week - startingWeek) % 4 === 0) {
      const startOfWeekMonth = moment(week, 'w').format('MMM');
      const endOfWeekMonth = moment(week, 'w').endOf('week').format('MMM');

      if (startOfWeekMonth !== endOfWeekMonth) {
        startingWeek += 1;
        return savedWeeks;
      }

      const isWeekSaved = savedWeeks.find((item) => item.week === week);
      // unique weeks only
      if (!isWeekSaved) {
        savedWeeks.push({ week, month: startOfWeekMonth });
      }
    }

    return savedWeeks;
  }, []);

  const graphConfig = {
    ...dataMapping,
    reflect: 'y',
    shape: 'boundary-polygon',
    meta: {
      day: {
        type: 'cat',
        values: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      },
      week: {
        type: 'cat',
      },
      commits: {
        sync: true,
      },
    },
    yAxis: {
      grid: null,
    },
    xAxis: {
      position: 'bottom',
      tickLine: null,
      line: null,
      label: {
        offsetY: -8,
        style: {
          fontSize: 12,
          fill: '#666',
          textBaseline: 'top',
        },
        formatter: (val) => {
          const validWeek = formatterMapping.find(
            (value) => value.week === val,
          );

          if (validWeek) {
            return validWeek.month;
          }
        },
      },
    },
  };

  const heatMapGraphs = useMemo(
    () => ({
      [DOWNLOAD]: (
        <HeatMap
          data={downloadData}
          color={activityColorMap[DOWNLOAD]}
          graphConfig={graphConfig}
        />
      ),
      [UPLOAD]: (
        <HeatMap
          data={uploadData}
          color={activityColorMap[UPLOAD]}
          graphConfig={graphConfig}
        />
      ),
      [DELETE]: (
        <HeatMap
          data={deleteData}
          color={activityColorMap[DELETE]}
          graphConfig={graphConfig}
        />
      ),
      [COPY]: (
        <HeatMap
          data={copyData}
          color={activityColorMap[COPY]}
          graphConfig={graphConfig}
        />
      ),
    }),
    [downloadData, uploadData, deleteData, copyData],
  );

  return <TabSwitcher contentMap={heatMapGraphs} colorMap={tabColorMap} />;
}

export default HeatMapTabSwitcher;
