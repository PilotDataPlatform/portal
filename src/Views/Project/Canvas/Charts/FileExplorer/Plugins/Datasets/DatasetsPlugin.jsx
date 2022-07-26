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
import React, { useState, useRef } from 'react';
import { Button } from 'antd';
import { DeploymentUnitOutlined, LeftOutlined } from '@ant-design/icons';
import { TABLE_STATE } from '../../RawTableValues';
import DatasetsModal from './DatasetsModal';
import variables from '../../../../../../../Themes/base.scss';

const DatasetsPlugin = ({
  selectedRowKeys,
  clearSelection,
  selectedRows,
  tableState,
  setTableState,
}) => {
  const [dataSetsModalVisible, setDataSetsModalVisible] = useState(false);
  const addToDatasetsBtnRef = useRef(null);
  let leftOffset = 0;

  const foldersPath =
    addToDatasetsBtnRef?.current?.parentNode.querySelectorAll(
      '.ant-breadcrumb',
    );

  if (foldersPath && foldersPath[0] && foldersPath[0].offsetWidth) {
    leftOffset = foldersPath[0].offsetWidth + 40;
  }

  const addToDatasetsToolTips = (
    <div
      style={{
        height: 52,
        position: 'absolute',
        left: leftOffset,
        right: 0,
        top: -11,
        zIndex: 100,
        paddingTop: 15,
        background: 'white',
      }}
    >
      <div
        style={{
          display: 'inline-block',
          color: variables.primaryColorLight1,
          cursor: 'pointer',
        }}
        onClick={(e) => {
          setTableState(TABLE_STATE.NORMAL);
          clearSelection();
        }}
      >
        <LeftOutlined fill={variables.primaryColorLight1} /> <span>Back</span>
      </div>
      <div style={{ marginLeft: 40, display: 'inline-block' }}>
        <span style={{ marginRight: 70 }}>
          {selectedRowKeys && selectedRowKeys.length
            ? `${selectedRowKeys.length} Selected`
            : ''}
        </span>
        <Button
          type="primary"
          ghost
          style={{
            borderRadius: '6px',
            height: '27px',
            width: '155px',
            padding: '0px',
          }}
          onClick={() => setDataSetsModalVisible(true)}
          disabled={selectedRowKeys.length ? false : true}
          icon={<DeploymentUnitOutlined />}
        >
          Add to Datasets
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <Button
        type="link"
        onClick={() => {
          setTableState(TABLE_STATE.ADD_TO_DATASETS);
        }}
        icon={<DeploymentUnitOutlined />}
        style={{ marginRight: 8 }}
        ref={addToDatasetsBtnRef}
      >
        Add to Datasets
      </Button>
      {tableState === TABLE_STATE.ADD_TO_DATASETS
        ? addToDatasetsToolTips
        : null}
      <DatasetsModal
        visible={dataSetsModalVisible}
        setVisible={setDataSetsModalVisible}
        selectedRows={selectedRows}
      />
    </>
  );
};

export default DatasetsPlugin;
