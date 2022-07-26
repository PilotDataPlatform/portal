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
import React from "react";
import {
  Button,
  Form,
  Select,
  Collapse,
  Checkbox,
  Upload,
  Cascader,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Panel } = Collapse;

function LeftContent(props) {
  function onFinish() {
    console.log("finish");
  }
  return (
    <>
      <Form
        name="Filter"
        onFinish={onFinish}
        style={{ padding: "0px 10px 50px" }}
        layout="vertical"
      >
        <div style={{ padding: "0px 10px" }}>YOLO</div>
      </Form>
    </>
  );
}

export default LeftContent;
