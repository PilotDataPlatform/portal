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
import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import VFolderDeleteModal from './VFolderDeleteModal';
function VirtualFolderDeletePlugin({
  selectedRows,
  panelKey,
  clearSelection,
  removePanel,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const files = selectedRows.map((v) => v.guid);
  return (
    <>
      <Button
        type="link"
        style={{ marginRight: '8px' }}
        icon={<DeleteOutlined />}
        onClick={() => {
          setModalVisible(true);
        }}
      >
        Delete Collection
      </Button>
      <VFolderDeleteModal
        visible={modalVisible}
        setVisible={setModalVisible}
        files={files}
        panelKey={panelKey}
        removePanel={removePanel}
        clearSelection={clearSelection}
      />
    </>
  );
}
export default VirtualFolderDeletePlugin;
