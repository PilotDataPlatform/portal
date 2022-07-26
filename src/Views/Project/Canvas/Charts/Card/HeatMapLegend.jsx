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
          key={uuidv4()}
          className={styles['heatmap-legend__color']}
          style={{ backgroundColor: color }}
        />
      ))}
      <li>More</li>
    </ul>
  );
}

export default HeatMapLegend;
