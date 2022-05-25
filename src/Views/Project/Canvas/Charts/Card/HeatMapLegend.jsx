import React from 'react';
import styles from './index.module.scss';

function HeatMapLegend({ colors }) {
  if (!colors) {
    return null;
  }

  return (
    <ul className={styles['heatmap-legend']}>
      <li>Less</li>
      {colors.map((color) => (
        <li
          className={styles['heatmap-legend__color']}
          style={{ backgroundColor: color }}
        />
      ))}
      <li>More</li>
    </ul>
  );
}

export default HeatMapLegend;
