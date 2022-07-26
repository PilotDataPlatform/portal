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
import React, { useState, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FileExplorerContext from '../../../../../Components/FileExplorer/FileExplorerContext';
import { fileExplorerTableActions } from '../../../../../Redux/actions';
import { Button } from 'antd';
import { PLUGIN_NAME } from './name';

export function Entry(props) {
  const fileExplorerContext = useContext(FileExplorerContext);
  const { reduxKey } = fileExplorerContext;
  const dispatch = useDispatch();
  const fileExplorerTableState = useSelector(
    (state) => state.fileExplorerTable,
  );
  if (!fileExplorerTableState[reduxKey]) {
    dispatch(fileExplorerTableActions.setAdd({ geid: reduxKey }));
  }
  useEffect(() => {
    dispatch(
      fileExplorerTableActions.setCurrentPlugin({
        geid: reduxKey,
        param: PLUGIN_NAME,
      }),
    );
  }, []);
  return null;
}
