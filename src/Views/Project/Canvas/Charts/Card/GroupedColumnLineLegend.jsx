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
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useTheme } from '../../../../../Themes/theme';
import styles from './index.module.scss';

function GroupedColumnLineLegend({ legendLabels }) {
  const { charts } = useTheme();
  // map out legend colors against labels
  const legendColors = [
    ...charts.groupedColumnLine.column,
    charts.groupedColumnLine.line,
  ];
  const legendColorMap = legendLabels.reduce(
    (labels, currentLabel, currentIndex) => [
      ...labels,
      { [currentLabel]: legendColors[currentIndex] },
    ],
    [],
  );

  if (!legendLabels) {
    return null;
  }

  function appendLegend() {
    return legendColorMap.map((item, index) => {
      const legendLabel = Object.keys(item)[0];
      const legendColor = item[legendLabel];
      const legendColorStyles = {
        display: 'inline-block',
        marginRight: '0.6rem',
        width: '1.4rem',
        height: index === 2 ? '0.2rem' : '1.4rem', //there should be always be 3 labels in the legend
        borderRadius: '2px',
        backgroundColor: legendColor,
      };

      return (
        <li
          key={uuidv4()}
          className={styles['grouped-column-line__legend-item']}
        >
          <span style={legendColorStyles} />
          <span className={styles['grouped-column-line__legend-label']}>
            {legendLabel}
          </span>
        </li>
      );
    });
  }
  return (
    <ul className={styles['grouped-column-line__legend']}>{appendLegend()}</ul>
  );
}

export default GroupedColumnLineLegend;
