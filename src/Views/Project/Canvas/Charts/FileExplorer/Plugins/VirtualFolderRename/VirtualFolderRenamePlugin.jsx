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
import { FontColorsOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';

import {
  vFolderOperation,
  VIRTUAL_FOLDER_OPERATIONS,
} from '../../../../../../../Redux/actions';
import style from './index.module.scss';

function VirtualFolderRenamePlugin({ panelKey }) {
  const project = useSelector((state) => state.project);
  const virtualFolders = useSelector((state) => state.virtualFolders);
  const dispatch = useDispatch();

  const handleClick = () => {
    const vFolderName = panelKey.split('-').slice(1).join('-');
    const selectedVFolder = project.tree.vfolders.find(
      (vFolder) => vFolder.title === vFolderName,
    );
    dispatch(vFolderOperation.setVFolderOperationRename(selectedVFolder.geid));
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
