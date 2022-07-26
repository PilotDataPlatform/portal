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
import { Layout } from 'antd';
import AppHeader from '../../Components/Layout/Header';
import { SUPPORT_EMAIL } from '../../config';

const { Content } = Layout;
function AccountDisabled() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader unauthorized />
      <Content
        style={{ margin: '15px 20px', background: 'white', borderRadius: 6 }}
      >
        <p
          style={{
            marginTop: '30vh',
            fontSize: 14,
            color: '#222222',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          Your account has been disabled, please contact{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> if any
          questions.
        </p>
      </Content>
    </Layout>
  );
}

export default AccountDisabled;
