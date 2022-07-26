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
import React, { useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import VFolderFilesDeleteModal from './VFolderFilesDeleteModal';
function VirtualFolderFilesDeletePlugin({
  selectedRowKeys,
  selectedRows,
  panelKey,
  clearSelection,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const files = selectedRows.map((v) => v.geid);
  return (
    <>
      <Button
        type="link"
        disabled={!selectedRowKeys || selectedRowKeys.length === 0}
        onClick={() => {
          setModalVisible(true);
        }}
        icon={<DeleteOutlined />}
        style={{ marginRight: 8 }}
      >
        Remove From Collection
      </Button>
      <VFolderFilesDeleteModal
        visible={modalVisible}
        setVisible={setModalVisible}
        files={files}
        panelKey={panelKey}
        clearSelection={clearSelection}
      />
    </>
  );
}
export default VirtualFolderFilesDeletePlugin;
