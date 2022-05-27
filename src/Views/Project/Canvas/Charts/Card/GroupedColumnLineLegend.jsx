import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import styles from './index.module.scss';

function GroupedColumnLineLegend({ legendLabels }) {
  if (!legendLabels) {
    return null;
  }

  function appendLegend() {
    return legendLabels.map((item) => {
      const isLine = item?.line === true ? true : false;
      const legendLabel = Object.keys(item)[0];
      const legendColor = item[legendLabel];
      const legendColorStyles = {
        display: 'inline-block',
        marginRight: '0.6rem',
        width: '1.4rem',
        height: isLine ? '0.2rem' : '1.4rem',
        borderRadius: '2px',
        backgroundColor: legendColor
      }

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
