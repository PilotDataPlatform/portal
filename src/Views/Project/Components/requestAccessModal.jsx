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
import React, { useState, useEffect } from 'react';
import { Modal, Button, message } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useCurrentProject } from '../../../Utility';
import 'antd/dist/antd.css';
import styles from './index.module.scss';
import {
  createResourceRequestAPI,
  getUserAnnouncementApi,
} from '../../../APIs';

const RequestAccessModal = (props) => {
  const [showConfirmationConetnt, toggleShowConfirmationContent] =
    useState(false);
  const [userGeid, setUserGeid] = useState(null);
  const [connectGuacamole, setConnectGuacamole] = useState(false);
  const [connectSuperSet, setConnectSuperSet] = useState(false);

  let [currentProject] = useCurrentProject();

  useEffect(() => {
    const getUserGeid = async () => {
      const res = await getUserAnnouncementApi(props.username);
      if (res.data.result) {
        setUserGeid(res.data.result.id);
      }
    };

    getUserGeid();
  }, [props.username]);

  const createResourceRequest = async () => {
    let requestFor;
    if (props.requestItem === 'Superset') {
      requestFor = 'SuperSet';
    } else {
      requestFor = 'Guacamole';
    }
    if (userGeid) {
      try {
        if (requestFor === 'Guacamole') {
          setConnectGuacamole(true);
        }
        if (requestFor === 'SuperSet') {
          setConnectSuperSet(true);
        }
        await createResourceRequestAPI({
          userId: userGeid,
          projectId: props.projectGeid,
          requestFor,
        });
        toggleShowConfirmationContent(true);
      } catch (error) {
        if (error.response.data.result === 'Request already exists') {
          const errorMessage = 'Already requested, please wait for approval.';
          message.info(errorMessage);
        } else if (error.response.data.result === 'Request already completed') {
          const errorMessage =
            'Request already completed, please refresh the page to access it.';
          message.info(errorMessage);
        }
      }
    }
  };

  const requestAccessTitle = 'Request Access';
  const requestAccessConetnt = (
    <div className={styles.content}>
      <p style={{ color: '#595959', fontSize: '14px' }}>
        Request permission for accessing:
      </p>
      <p style={{ color: '#595959', fontSize: '16px', fontWeight: '600' }}>
        {props.requestItem}
      </p>
      <div className={styles.modal_content_button}>
        <Button
          style={{ border: 'none', marginRight: '26px', fontWeight: '600' }}
          onClick={() => {
            props.toggleRequestModal(false);
            setTimeout(() => {
              toggleShowConfirmationContent(false);
            }, 500);
          }}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          style={{ borderRadius: '8px', width: '137px' }}
          onClick={() => {
            createResourceRequest();
          }}
        >
          <ArrowRightOutlined /> Send Request
        </Button>
      </div>
    </div>
  );

  const requestConfirmationTitle = 'Request Confirmation';
  const requestConfirmationContent = (
    <div className={styles.content}>
      <p style={{ color: '#595959', fontSize: '14px' }}>
        A request has been sent. <br />
        You will be emailed once granted access to
      </p>
      <p style={{ color: '#595959', fontSize: '16px', fontWeight: '600' }}>
        {props.requestItem}
      </p>
      <div style={{ marginTop: '35px' }}>
        <Button
          type="primary"
          style={{ borderRadius: '8px', width: '75px' }}
          onClick={() => {
            props.toggleRequestModal(false);
            setTimeout(() => {
              toggleShowConfirmationContent(false);
            }, 500);
          }}
        >
          OK
        </Button>
      </div>
    </div>
  );

  return (
    <Modal
      className={styles.request_modal}
      title={
        showConfirmationConetnt ? requestConfirmationTitle : requestAccessTitle
      }
      visible={props.showRequestModal}
      onCancel={() => {
        props.toggleRequestModal(false);
        setTimeout(() => {
          toggleShowConfirmationContent(false);
        }, 500);
      }}
      maskClosable={false}
      centered={true}
      footer={null}
    >
      <div style={{ position: 'relative' }}>
        {showConfirmationConetnt
          ? requestConfirmationContent
          : requestAccessConetnt}
        {connectGuacamole ? (
          <iframe
            title="guacamole"
            style={{ display: 'none', position: 'absolute', zIndex: -1 }}
            src={`/workbench/${currentProject?.code}/guacamole/`}
          ></iframe>
        ) : null}
        {connectSuperSet ? (
          <iframe
            title="superset"
            style={{ display: 'none', position: 'absolute', zIndex: -1 }}
            src={`/bi/${currentProject?.code}/superset/welcome`}
          ></iframe>
        ) : null}
      </div>
    </Modal>
  );
};

export default RequestAccessModal;
