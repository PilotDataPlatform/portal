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
import React from 'react';

export function DeleteModalSecondStep({ locked }) {
  return (
    <>
      <p>
        The following {locked.length} file(s)/folder(s) will be skipped because
        there are concurrent file operations are taking place:
      </p>
      {locked && locked.length ? (
        <ul style={{ maxHeight: 90, overflowY: 'auto' }}>
          {locked.map((v) => {
            return <li key={v}>{v}</li>;
          })}
        </ul>
      ) : null}
    </>
  );
}
