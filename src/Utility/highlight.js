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

export const getHighlightedText = (text, highlight) => {
  // Split on highlight term and include term into parts, ignore case
  const parts = text.split(highlight);

  return (
    <span className="file-name-val">
      {' '}
      {parts.map((part, i) => {
        let divider = i < parts.length - 1 && (
          <b>{highlight.replace(/\s/g, '\u00a0')}</b>
        );
        return (
          <>
            <span>{part.replace(/\s/g, '\u00a0')}</span>
            {divider}
          </>
        );
      })}{' '}
    </span>
  );
};

// this function needs to be modified and might be used in the future
export const hightLightCaseInsensitive = (text, highlight) => {
  const regObj = new RegExp(highlight, 'gi');
  const hightlightText = <b>{highlight.toLowerCase()}</b>;
  return (
    <span className="file-name-val">
      {text.replace(regObj, hightlightText)}
    </span>
  );
};
