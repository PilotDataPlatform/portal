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
import React, { useState } from "react";
import { Cascader,Form } from "antd";

function FolderCascader(props) {
  const defaultOptions = [
    {
      value: "zhejiang",
      label: "folder1",
      isLeaf: false,
    },
    {
      value: "jiangsu",
      label: "folder2",
      isLeaf: false,
    },
  ];

  const [options, setOptions] = useState(defaultOptions);

  const loadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    // load options lazily
    setTimeout(() => {
      targetOption.loading = false;
      targetOption.children = [
        {
          label: `${targetOption.label} Dynamic 1`,
          value: "dynamic1",
        },
        {
          label: `${targetOption.label} Dynamic 2`,
          value: "dynamic2",
        },
      ];
      setOptions([...options]);
    }, 1000);
  };

  const onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
  };

  return (
    <Form.Item label="Folder">
      <Cascader
        options={options}
        loadData={loadData}
        onChange={onChange}
        changeOnSelect
      />
    </Form.Item>
  );
}

export default FolderCascader;
