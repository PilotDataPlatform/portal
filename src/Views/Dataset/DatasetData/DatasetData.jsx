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
import React, { useState, useEffect } from 'react';
import styles from './DatasetData.module.scss';
import DatasetDataExplorer from './Components/DatasetDataExplorer/DatasetDataExplorer';
import DatasetDataPreviewer from './Components/DatasetDataPreviewer/DatasetDataPreviewer';
import { datasetDataActions } from '../../../Redux/actions';
import { useSelector, useDispatch } from 'react-redux';
export default function DatasetData() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(datasetDataActions.clearData());
  }, []);
  return (
    <div className={styles['container']}>
      <div className={styles['explorer']}>
        <DatasetDataExplorer />
      </div>{' '}
      <div className={styles['previewer']}>
        <DatasetDataPreviewer />
      </div>{' '}
    </div>
  );
}
