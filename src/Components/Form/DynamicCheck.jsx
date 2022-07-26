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
import { Checkbox, Form } from "antd";

function DynamicCheck(props) {
    function onChange(checkedValues) {
        console.log("checked = ", checkedValues);
    }
    return (
        <>
            <Form.Item
                label={<strong>{props.name}</strong>}
                name={props.name}
                key={`check-${props.index}`}
            >
                <Checkbox.Group options={props.options} onChange={onChange} />
            </Form.Item>
        </>
    );
}
export default DynamicCheck;
