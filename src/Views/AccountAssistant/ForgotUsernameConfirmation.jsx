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
import { Link } from 'react-router-dom';
import { Card, Button, Layout, Result } from 'antd';

import styles from './index.module.scss';
import { BRANDING_PREFIX } from '../../config';
const { Content } = Layout;

function ActivateUser(props) {
  return (
    <Content className={'content'}>
      <div className={styles.container}>
        <Card>
          <Result
            status="success"
            title="Your request has been sent!"
            subTitle={
              <>
                An email with your username has been sent to your mailbox.{' '}
                <br />
                You can use this username to reset your password or login
                directly.
              </>
            }
            extra={[
              <Button type="primary" key="home">
                <a href={BRANDING_PREFIX}>Back to Home Page</a>
              </Button>,
            ]}
          />
        </Card>
      </div>
    </Content>
  );
}

export default ActivateUser;
