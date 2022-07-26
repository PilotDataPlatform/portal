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
import { Result, Button, Layout } from 'antd';
import { withRouter } from 'react-router-dom';
import { BRANDING_PREFIX } from '../../config';
const { Content } = Layout;
function General404Page(props) {
  return (
    <Content style={{ marginTop: 50 }}>
      <Result
        status="404"
        style={{ height: '93vh' }}
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <a  href={BRANDING_PREFIX}>
            <Button type="primary">Back Home</Button>
          </a>
        }
      />
    </Content>
  );
}

export default withRouter(General404Page);
