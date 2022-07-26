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
import { Modal, Button } from 'antd';
import { CloseOutlined, ArrowRightOutlined } from '@ant-design/icons';
import styles from './resetpasswd.module.scss';
import { ORGANIZATION_PORTAL_DOMAIN } from '../../config';
import variables from '../../Themes/base.scss';
const ResetPasswordModal = (props) => {
  return (
    <Modal
      title={
        <div>
          <p
            style={{
              margin: 0,
              padding: '4px 20px 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <b
              style={{
                color: variables.primaryColor1,
                fontSize: 14,
                lineHeight: '40px',
              }}
            >
              Password Reset
            </b>
            <CloseOutlined
              style={{ fontSize: 14 }}
              onClick={() => {
                props.handleCancel();
              }}
            />
          </p>
        </div>
      }
      className={styles.reset_pop_up}
      visible={props.visible}
      maskClosable={false}
      closable={false}
      destroyOnClose={true}
      footer={null}
    >
      <div style={{ margin: '35px 0 30px', textAlign: 'center' }}>
        <p style={{ textAlign: 'center', cursor: 'default', marginBottom: 4 }}>
          To reset Password please visit
        </p>
        <a
          style={{ fontSize: 16, fontWeight: 'bold' }}
          href={`https://${ORGANIZATION_PORTAL_DOMAIN}/`}
          target="_blank"
        >
          https://{ORGANIZATION_PORTAL_DOMAIN}/
        </a>
      </div>
      <div style={{ textAlign: 'center', paddingBottom: 15 }}>
        <Button
          type="link"
          style={{
            marginRight: 40,
            color: 'rgba(0,0,0,0.65)',
            fontWeight: 'bold',
          }}
          onClick={() => {
            props.handleCancel();
          }}
        >
          Cancel
        </Button>
        <a target="_blank" href={`https://${ORGANIZATION_PORTAL_DOMAIN}/`}>
          <Button
            style={{ borderRadius: 10, width: 120 }}
            type="primary"
            icon={<ArrowRightOutlined />}
          >
            Visit Link
          </Button>
        </a>
      </div>
    </Modal>
  );
};

export default ResetPasswordModal;
