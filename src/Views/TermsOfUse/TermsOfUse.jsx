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
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Layout, Button } from 'antd';
import AppHeader from '../../Components/Layout/Header';
import TermsOfUseModal from '../../Components/Modals/TermsOfUseModal';
import { useKeycloak } from '@react-keycloak/web';
import { changeUserStatusAPI, lastLoginAPI } from '../../APIs';
import { PORTAL_PREFIX } from '../../config';
import variables from '../../Themes/base.scss';
const { Content } = Layout;
function TermsOfUse(props) {
  const { keycloak } = useKeycloak();
  const [visible, setVisible] = useState(true);
  const [btnDisable, setBtnDisable] = useState(true);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const username = useSelector((state) => state.username);
  const onCancel = () => {
    setVisible(false);
    setBtnDisable(true);
  };

  const onDecline = () => {
    setVisible(false);
    setBtnDisable(true);
  };

  const onOk = async () => {
    setAcceptLoading(true);
    const user = keycloak?.tokenParsed;
    const res = await changeUserStatusAPI(
      user.email,
      user.preferred_username,
      user.family_name,
      user.given_name,
    );
    if (res.status === 200) {
      setAcceptLoading(false);
      setVisible(false);
      await lastLoginAPI(username);
      window.location.reload();
    }
  };

  const onPrint = () => {
    console.log('print');
  };

  const handleScroll = (e) => {
    const bottom =
      Math.abs(
        e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight,
      ) < 2;
    if (bottom) setBtnDisable(false);
  };

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
          Terms of use not accepted.
          <br /> Please accept{' '}
          <b
            style={{
              color: variables.primaryColorLight1,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
            onClick={(e) => {
              setVisible(true);
            }}
          >
            Terms of Use
          </b>{' '}
          if you wish to view projects.
        </p>
        <TermsOfUseModal
          footer={[
            <Button
              key="submit"
              type="primary"
              onClick={onPrint}
              style={{ float: 'left' }}
            >
              <a
                href={PORTAL_PREFIX + '/files/Website Privacy Policy draft.pdf'}
                download
                target="_self"
              >
                {' '}
                Export PDF
              </a>
            </Button>,

            <Button
              key="submit"
              type="primary"
              disabled={btnDisable}
              loading={acceptLoading}
              onClick={onOk}
            >
              Accept
            </Button>,

            <Button key="back" type="danger" onClick={onDecline}>
              Decline
            </Button>,
          ]}
          visible={visible}
          handleCancel={onCancel}
          handleScroll={handleScroll}
        />
      </Content>
    </Layout>
  );
}

export default TermsOfUse;
