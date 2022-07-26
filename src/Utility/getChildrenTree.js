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
import { FolderOpenOutlined, ContainerOutlined } from '@ant-design/icons';

/**
 * create the tree data structure for the tree component
 *
 * @param {*} data
 * @param {number/string} [layer=0] used as key
 * @param {*} path
 * @returns
 */
const getChildrenTree = (data, layer = 0, path) => {
  if (!data || data.length === 0) {
    /* return [
      {
        title: "New",
        icon: <PlusOutlined />,
        key: `${layer}-${path}-add`,
        id: -1,
        parentPath: path,
        type: "add",
      },
    ]; */
  } else {
    const res = data
      .filter((item) => typeof item !== 'string')
      .map((d) => ({
        title: Object.keys(d)[0],
        key: `${layer}-${Object.keys(d)[0]}`,
        id: Object.keys(d)[0],
        path: path + '/' + Object.keys(d)[0],
        icon: <ContainerOutlined /> && <FolderOpenOutlined />,
        children: getChildrenTree(
          d[Object.keys(d)[0]],
          layer + `-${Object.keys(d)[0]}`,
          path + '/' + Object.keys(d)[0],
        ),
        type: 'folder',
      }));
    /*  const newItem = {
      title: "New",
      icon: <PlusOutlined />,
      key: `${layer}-${path}-add`,
      id: path,
      parentPath: path,
      type: "add",
    };
    return [...res, newItem]; */
    return res;
  }
};

export default getChildrenTree;
