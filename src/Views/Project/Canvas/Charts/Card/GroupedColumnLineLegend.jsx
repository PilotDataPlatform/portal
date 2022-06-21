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
          className={styles['grouped-column-line-legend__legend-item']}
        >
          <span style={legendColorStyles} />
          <span className={styles['grouped-column-line-legend__label']}>
            {legendLabel}
          </span>
        </li>
      );
    });
  }
  return (
    <ul className={styles['grouped-column-line-legend']}>{appendLegend()}</ul>
  );
}

export default GroupedColumnLineLegend;
