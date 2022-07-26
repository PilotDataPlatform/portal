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
import React, { useEffect, useState } from 'react';
import { Tree, Modal, Button } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { nestedLoop } from '../../../../../../../Utility';
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const { DirectoryTree } = Tree;

const ZipContentPlugin = (props) => {
  const [data, setData] = useState([]);
  const [defaultKeys, setDefaultKeys] = useState([]);
  const fileName = props.record.fileName;
  const location = props.record.displayPath;
  const upperZipContent = props.record.zipContent || {};

  const [loading, setLoading] = useState(false);
  const zipContent = {};
  zipContent[fileName] = upperZipContent;

  useEffect(() => {
    if (props.visible) {
      for (const key in zipContent) {
        setLoading(true);
        setData([]);
        setDefaultKeys([]);
        const { treeData, expandedKey } = nestedLoop(zipContent[key], key);
        setData(treeData);
        setDefaultKeys(expandedKey);
        setLoading(false);
      }
    }
  }, [props.visible]);

  const onSelect = (keys, info) => {
    console.log('Trigger Select', keys, info);
  };

  const onExpand = () => {
    console.log('Trigger Expand');
  };

  const titile = (
    <div style={{ display: 'flex' }}>
      <span style={{ fontSize: '16px', fontWeight: 500, lineHeight: '22px' }}>
        Zip File Previewer
      </span>
      <span
        style={{
          fontSize: '14px',
          fontWeight: 300,
          lineHeight: '22px',
          marginLeft: 10,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          flex: 1,
          marginRight: 20,
        }}
      >
        - {location}
      </span>
    </div>
  );
  return (
    <Modal
      title={titile}
      visible={props.visible}
      maskClosable={false}
      onOk={props.handlePreviewCancel}
      onCancel={props.handlePreviewCancel}
      footer={[
        <Button key="back" onClick={props.handlePreviewCancel}>
          OK
        </Button>,
      ]}
    >
      {loading ? (
        <antIcon />
      ) : (
        <div style={{ overflowX: 'scroll' }}>
          <DirectoryTree
            multiple
            // defaultExpandAll
            onSelect={onSelect}
            onExpand={onExpand}
            treeData={data}
            height={500}
            defaultExpandedKeys={defaultKeys}
          />
        </div>
      )}
    </Modal>
  );
};

export default ZipContentPlugin;
