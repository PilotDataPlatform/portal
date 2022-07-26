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
import { Spin } from 'antd';
function Loading() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Spin
        style={{
          position: 'absolute',
          top: '50%',
          left: ' 50%',
          transform: 'translate(-50%, -50%)',
        }}
        tip="Loading..."
      ></Spin>
    </div>
  );
}

export { Loading };
