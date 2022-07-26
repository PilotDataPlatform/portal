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
import styles from './DatasetActivity.module.scss';

const DatasetActivityViewSelector = (props) => {
  const { viewValue, changeViewValue } = props;
  return (
    <div className={styles.view_selector}>
      <span style={{ color: '#595959', fontWeight: 500, width: '40px' }}>
        View
      </span>
      <div className={styles.view}>
        <div
          className={`${styles.view_all} ${
            viewValue === 'All' && styles.view_backgroundColor
          }`}
          onClick={changeViewValue}
        >
          All
        </div>
        <div
          className={`${styles.view_1d} ${
            viewValue === '1 D' && styles.view_backgroundColor
          }`}
          onClick={changeViewValue}
        >
          1 D
        </div>
        <div
          className={`${styles.view_1w} ${
            viewValue === '1 W' && styles.view_backgroundColor
          }`}
          onClick={changeViewValue}
        >
          1 W
        </div>
        <div
          className={`${styles.view_1m} ${
            viewValue === '1 M' && styles.view_backgroundColor
          }`}
          onClick={changeViewValue}
        >
          1 M
        </div>
        <div
          className={`${styles.view_6m} ${
            viewValue === '6 M' && styles.view_backgroundColor
          }`}
          onClick={changeViewValue}
        >
          6 M
        </div>
        <div
          className={`${styles.view_custom} ${
            viewValue === 'Custom' && styles.view_backgroundColor
          }`}
          onClick={changeViewValue}
        >
          Custom
        </div>
      </div>
    </div>
  );
};

export default DatasetActivityViewSelector;
