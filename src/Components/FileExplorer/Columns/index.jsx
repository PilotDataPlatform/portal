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
import { PluginColumnComponents } from '../Plugins';
import CreatedTimeDefault from './CreatedTime/CreatedTimeDefault';
import FileNameDefault from './FileName/FileNameDefault';
import LabelDefault from './Label/LabelDefult';
import OwnerDefault from './Owner/OwnerDefult';
import SizeDefault from './Size/SizeDefult';
import ReviewedByDefault from './ReviewedBy/ReviewedByDefault';
import ReviewedAtDefault from './ReviewedAt/ReviewedAtDefault';
import Action from './Action/Action';
export const ColumnDefaultComponents = {
  CreatedTimeDefault: CreatedTimeDefault,
  FileNameDefault: FileNameDefault,
  LabelDefault: LabelDefault,
  OwnerDefault: OwnerDefault,
  SizeDefault: SizeDefault,
  ReviewedAtDefault: ReviewedAtDefault,
  ReviewedByDefault: ReviewedByDefault,
};
export const COLUMN_COMP_IDS = {
  ...ColumnDefaultComponents,
  ...PluginColumnComponents,
};

export const DEFAULT_COLUMN_COMP_MAP = {
  createTime: 'CreatedTimeDefault',
  fileName: 'FileNameDefault',
  label: 'LabelDefault',
  owner: 'OwnerDefault',
  fileSize: 'SizeDefault',
  reviewedAt: 'ReviewedAtDefault',
  reviewedBy: 'ReviewedByDefault',
};

export function getColumnsResponsive() {}

/*
 * Calculate the columns array for antd table
 * @columns: array of reserved column name.  eg. ['label', 'fileName', 'owner', 'createTime', 'size'];
 * @columnsLayout: function to calculate the width of each columns (isSidePanelOpen:boolean) => {}
 * @columnsComponentMap: current columns component map from redux
 */
export function getColumns(
  columns,
  columnsLayout,
  isSidePanelOpen,
  columnsComponentMap,
) {
  if (!columnsComponentMap) {
    return null;
  }
  const columsArr = columns.map((column) => {
    const componentID = columnsComponentMap[column.key];
    const RenderComponent = COLUMN_COMP_IDS[componentID];
    column.render = (text, record) => {
      return <RenderComponent text={text} record={record} />;
    };
    column.width = columnsLayout(isSidePanelOpen)[column.key];
    return column;
  });
  columsArr.push({
    title: 'Action',
    key: 'action',
    width: 100,
    sidePanelVisible: true,
    render: (text, record) => {
      return <Action text={text} record={record} />;
    },
  });
  return columsArr;
}
