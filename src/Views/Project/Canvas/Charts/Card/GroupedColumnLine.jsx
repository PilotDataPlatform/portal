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
import React from 'react';
import { DualAxes } from '@ant-design/plots';

import { useTheme } from '../../../../../Themes/theme';
import GroupedColumnLineLegend from './GroupedColumnLineLegend';
import styles from './index.module.scss';

function GroupedColumnLine({
  data,
  xField,
  yField,
  showLegend = true,
  legendLabels,
}) {
  const { charts } = useTheme();
  const chartColors = charts.groupedColumnLine
  const config = {
    height: 185,
    data, // []
    xField: xField, // string || string[]
    yField: yField, // string || string[]
    padding: [ 10, 10, 10, 13 ],
    yAxis: {
      count: {
        label: null,
      },
      value: {
        tickInterval: 150,
        label: {
          offset: 2,
          style: {
            fontWeight: 600,
          },
        },
      },
    },
    xAxis: {
      label: {
        style: {
          fontWeight: 600,
        },
      },
    },
    legend: false,
    tooltip: false,
    geometryOptions: [
      {
        geometry: 'column',
        isGroup: true,
        seriesField: 'type',
        marginRatio: 0.15,
        color: chartColors.column,
      },
      {
        geometry: 'line',
        lineStyle: {
          lineWidth: 1.75,
        },
        color: chartColors.line,
        point: {
          size: 4,
          shape: 'circle',
          style: {
            fill: chartColors.line,
            stroke: chartColors.line,
          },
        },
      },
    ],
  };

  return (
    <div className={styles['grouped-column-line__container']}>
      {showLegend && <GroupedColumnLineLegend legendLabels={legendLabels} />}
      <DualAxes {...config} />
    </div>
  );
}

export default GroupedColumnLine;
