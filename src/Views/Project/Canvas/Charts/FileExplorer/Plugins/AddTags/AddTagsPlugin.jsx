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
import { TagOutlined, LeftOutlined } from '@ant-design/icons';
import { TABLE_STATE } from '../../RawTableValues';
import { Button, message } from 'antd';
import AddTagsModal from './AddTagsModal';
import variables from '../../../../../../../Themes/base.scss';
function AddTagsPlugin({
  selectedRowKeys,
  clearSelection,
  selectedRows,
  tableState,
  setTableState,
}) {
  const [addTagsModalVisible, setAddTagsModalVisible] = useState(false);
  const copyBtnRef = useRef(null);
  let leftOffset = 0;

  const handleAddTags = () => {
    setAddTagsModalVisible(true);
  };

  const foldersPath =
    copyBtnRef?.current?.parentNode.querySelectorAll('.ant-breadcrumb');
  if (foldersPath && foldersPath[0] && foldersPath[0].offsetWidth) {
    leftOffset = foldersPath[0].offsetWidth + 40;
  }

  const addTagsToolTips = (
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
          onClick={handleAddTags}
          disabled={selectedRowKeys.length ? false : true}
          icon={<TagOutlined />}
          // disabled={selFiles.length === 0}
        >
          Add/Remove Tags
        </Button>
      </div>
    </div>
  );
  return (
    <>
      <Button
        type="link"
        onClick={() => {
          // fake copy data, will be deleted
          // deleteCopiedItemFromSel();
          setTableState(TABLE_STATE.ADD_TAGS);
        }}
        icon={<TagOutlined />}
        style={{ marginRight: 8 }}
        ref={copyBtnRef}
      >
        Add/Remove Tags
      </Button>

      {tableState === TABLE_STATE.ADD_TAGS ? addTagsToolTips : null}
      <AddTagsModal
        visible={addTagsModalVisible}
        setVisible={setAddTagsModalVisible}
        selectedRows={selectedRows}
      />
    </>
  );
}

export default AddTagsPlugin;
