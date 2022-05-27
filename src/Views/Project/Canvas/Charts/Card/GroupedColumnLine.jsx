import React from 'react';
import { DualAxes } from '@ant-design/plots';

import GroupedColumnLineLegend from './GroupedColumnLineLegend';
import styles from './index.module.scss';

function GroupedColumnLine({
  data,
  xField,
  yField,
  columnColor = ['#35739a', '#457914'],
  lineColor = '#FF8B18',
  showLegend = true,
  legendLabels,
}) {
  const config = {
    data, // []
    xField: xField, // string || string[]
    yField: yField, // string || string[]
    limitInPlot: false,
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
        color: columnColor,
      },
      {
        geometry: 'line',
        lineStyle: {
          lineWidth: 1.75,
        },
        color: lineColor,
        point: {
          size: 4,
          shape: 'circle',
          style: {
            fill: lineColor,
            stroke: lineColor,
          },
        },
      },
    ],
  };

  return (
    <div className={styles['grouped-column-line-container']}>
      {showLegend && <GroupedColumnLineLegend legendLabels={legendLabels} />}
      <DualAxes {...config} />
    </div>
  );
}

export default GroupedColumnLine;
