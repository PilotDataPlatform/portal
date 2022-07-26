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
import React, { useState, useEffect } from 'react';
import { Descriptions } from 'antd';

export function FileManifest({ currentRecord }) {
  if (!currentRecord.manifest) {
    currentRecord.manifest = [];
  }

  const [attributes, setAttributes] = useState(
    currentRecord.manifest.map((item) => ({
      ...item,
      editing: false,
      draft: item.value,
    })),
  );

  useEffect(() => {
    const manifest = currentRecord.manifest.map((item) => ({
      ...item,
      editing: false,
      draft: item.value,
    }));
    setAttributes(manifest);
  }, [currentRecord]);

  return (
    <>
      <h3 style={{ color: 'rgba(0,0,0,0.45)', fontSize: 14 }}>
        {currentRecord?.manifest[0]?.manifest_name}
      </h3>
      <Descriptions size="small" column={1}>
        {attributes.map((item, index) => (
          <Descriptions.Item
            label={item.name}
            style={{ wordBreak: 'break-word' }}
          >
            <span>{item.value || <em>null</em>}</span>
          </Descriptions.Item>
        ))}
      </Descriptions>
    </>
  );
}
