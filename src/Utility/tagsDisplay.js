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
import { Tag } from 'antd';
import variables from '../Themes/base.scss';
const getTags = (tags) => {
  if (tags.length <= 3) {
    return tags.map((tag, ind) => <Tag key={'tag-' + ind}>{tag}</Tag>);
  }

  const hideTags = [
    ...tags.slice(0, 3).map((tag, ind) => <Tag key={'tag-' + ind}>{tag}</Tag>),
    <Tag
      key="tag-create"
      style={{
        color: variables.primaryColorLight1,
        backgroundColor: '#E6F5FF',
      }}
    >{`+${tags.length - 3}`}</Tag>,
  ];
  return hideTags;
};

export { getTags };
