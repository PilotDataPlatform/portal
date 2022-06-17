import React from 'react';
import { Area } from '@ant-design/plots';

const StackedAreaPlot = function ({
  data,
  xField,
  yField,
  seriesField,
  color,
  chartConfig
}) {
  const config = {
    data,
    xField,
    yField,
    seriesField,
    color,
    height: 220,
    padding: [40, 40, 40, 50],
    legend: {
      offsetX: 30,
    },
    ...chartConfig,
  };

  return <Area {...config} />;
};

export default StackedAreaPlot;
