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
import _ from 'lodash'
import { Area } from '@ant-design/plots';

const StackedAreaPlot = function ({
  data,
  xField,
  yField,
  seriesField,
  color,
  chartConfig,
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

export default React.memo(StackedAreaPlot, (prevProps, nextProps) =>
  _.isEqual(prevProps, nextProps),
);
