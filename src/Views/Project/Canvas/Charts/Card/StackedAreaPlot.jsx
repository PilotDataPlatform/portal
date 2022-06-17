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
  console.log(chartConfig)

  const config = {
    data,
    xField,
    yField,
    seriesField,
    color,
    height: 210,
    padding: 40,
    legend: {
      offsetX: 30,
    },
    ...chartConfig,
  };

  return <Area {...config} />;
};

export default StackedAreaPlot;
