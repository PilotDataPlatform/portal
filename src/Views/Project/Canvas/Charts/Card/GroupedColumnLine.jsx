import React from 'react';
import { DualAxes } from '@ant-design/plots';

function GroupedColumnLine({
  data,
  xField,
  yField,
  columnColor = ['#35739a', '#457914'],
  lineColor = '#FF8B18',
  showLegend = true,
}) {
  const config = {
    data, // []
    xField: xField, // string || string[]
    yField: yField, // string || string[]
    yAxis: {
      count: {
        label: null,
      },
      value: {
        tickInterval: 150,
      },
    },
    legend: false,
    tooltip: false,
    geometryOptions: [
      {
        geometry: 'column',
        isGroup: true,
        seriesField: 'type',
        marginRatio: 0.2,
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
            fill: '#FF8B18',
            stroke: '#FF8B18',
          },
        },
      },
    ],
  };

  return <DualAxes {...config} />;
}

export default GroupedColumnLine;