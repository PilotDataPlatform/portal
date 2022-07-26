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
import { Popover } from 'antd';

export const partialString = (string, length, isDisplay) => {
  const partString = `${string.substring(0, length)}...`;

  if (isDisplay) {
    return (
      <Popover overlayStyle={{ maxWidth: 600, wordBreak: 'break-word' }} content={<span>{string}</span>}>
        {partString}
      </Popover>
    );
  }

  return partString;
};