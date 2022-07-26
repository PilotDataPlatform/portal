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
import { Divider } from 'antd';
import { CloseOutlined, } from '@ant-design/icons';

export default function BidsMessage(props) {
    return (
        <div style={{ width: 700, height: 600 }}>
            <div style={{ margin: '5px 20px 0px 20px',}}>
                <h4 >Bids Validation</h4>
                <CloseOutlined 
                    style={{ float: 'right', marginTop: -25 }}
                    onClick={() => console.log('close')}
                />
            </div>
            <Divider style={{ marginTop: 0 }} />
        </div>
    );
}