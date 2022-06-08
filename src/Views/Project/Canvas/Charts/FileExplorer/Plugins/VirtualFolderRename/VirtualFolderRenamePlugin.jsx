import React, { useState, useEffect } from 'react';
import { FontColorsOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';

import { listAllVirtualFolder } from '../../../../../../../APIs';
import {
  vFolderOperation,
  VIRTUAL_FOLDER_OPERATIONS,
} from '../../../../../../../Redux/actions';
import style from './index.module.scss';

function VirtualFolderRenamePlugin({ panelKey }) {
  const project = useSelector((state) => state.project);
  const username = useSelector((state) => state.username);
  const virtualFolders = useSelector((state) => state.virtualFolders);
  const [projectVFolders, setProjectVFolders] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadVFolders() {
      const res = await listAllVirtualFolder(project.profile?.code, username);
      const virtualFolders = res.data.result;
      setProjectVFolders(virtualFolders);
    }
    loadVFolders();
  }, []);

  const handleClick = () => {
    const vFolderName = panelKey.split('-').slice(1).join('-');
    const { id } = projectVFolders.find(
      (vFolder) => vFolder.name === vFolderName,
    );
    dispatch(vFolderOperation.setVFolderOperationRename(id));
  };

  const RenameTooltip = (
    <div className={style['vfolder-rename__tooltip']}>
      <span>
        <FontColorsOutlined />
        Rename Collection
      </span>
    </div>
  );

  return (
    <>
      <Button
        type="link"
        icon={<FontColorsOutlined />}
        style={{ marginRight: 8 }}
        onClick={handleClick}
      >
        Rename Collection
      </Button>
      {virtualFolders.operation === VIRTUAL_FOLDER_OPERATIONS.RENAME
        ? RenameTooltip
        : null}
    </>
  );
}
export default VirtualFolderRenamePlugin;
