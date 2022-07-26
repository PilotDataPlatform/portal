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
import React, { useState } from 'react';
import { Modal, Form, Tooltip, Radio, message, Input, Button } from 'antd';
import {
  QuestionCircleOutlined,
  CheckCircleFilled,
  ExclamationCircleOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { validateEmail } from '../../../../Utility';
import { useTranslation } from 'react-i18next';
import { namespace, ErrorMessager } from '../../../../ErrorMessages';
import { checkUserPlatformRole } from '../../../../APIs';
import styles from '../index.module.scss';
import { inviteUserApi } from '../../../../APIs';
import { PLATFORM } from '../../../../config';

const InviteUserModal = (props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation([
    'tooltips',
    'formErrorMessages',
    'success',
    'errormessages',
    'modals',
  ]);
  const [userAddCompleted, setUserAddCompleted] = useState(false);
  const addUser = async () => {
    const { email, role } = form.getFieldsValue();
    try {
      await inviteUserApi(email, role);
      form.resetFields();
    } catch (err) {
      message.error(
        `${t('errormessages:inviteUserPlatform.default.0')}${email}${t(
          'errormessages:inviteUserPlatform.default.1',
        )}`,
      );
    }
  };

  const onSubmit = async () => {
    const { email, role } = form.getFieldsValue();
    setLoading(true);

    if (!email) {
      message.error(t('errormessages:addUser2Project.emailRequired'));
      setLoading(false);
      return;
    }

    const isValidEmail = validateEmail(email);

    if (!isValidEmail) {
      message.error(t('errormessages:addUser2Project.email'));
      setLoading(false);
      return;
    }

    const checkStatusAndRole = (status, platformRole, email) => {
      let statusDictionary;
      switch (status) {
        case 'disabled':
          statusDictionary = 'disabledUser';
          break;
        case 'pending':
          statusDictionary = 'pending';
          break;
        case 'invited':
          statusDictionary = 'invited';
          break;
        default:
          statusDictionary = false;
      }
      if (
        !statusDictionary &&
        (platformRole === 'admin' || platformRole === 'member')
      ) {
        return Modal.warning({
          title: t('modals:inviteExist.title'),
          content: `${t('modals:inviteExist.content.0')} ${email} ${t(
            'modals:inviteExist.content.1',
          )}`,
        });
      }
      Modal.warning({
        title: t(`errormessages:addUser2Platform.${statusDictionary}.title`),
        content: `${t(
          `errormessages:addUser2Platform.${statusDictionary}.content.0`,
        )} ${email} ${t(
          `errormessages:addUser2Platform.${statusDictionary}.content.1`,
          statusDictionary === 'disabledUser' ? null : { PLATFORM },
        )}`,
        className: styles['warning-modal'],
      });
    };

    try {
      const res = await checkUserPlatformRole(email.toLowerCase());
      if (res.status === 200 && res.data.result) {
        const { role: platformRole, status } = res.data.result;
        checkStatusAndRole(status, platformRole, email);
        setLoading(false);
        props.onCancel();
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        const platFormRole =
          role === 'admin' ? 'Platform Administrator' : 'Platform User';
        Modal.confirm({
          title: t('modals:inviteNoExistPlatform.title'),
          icon: <ExclamationCircleOutlined />,
          content: (
            <>
              {' '}
              <p>{`${t('modals:inviteNoExistPlatform.content.0')} ${email} ${t(
                'modals:inviteNoExistPlatform.content.1',
                {
                  PLATFORM: PLATFORM,
                },
              )} ${platFormRole}`}</p>
              {!err.response.data.result?.ad_account_created ? (
                <p>{`${t('modals:inviteNoExistPlatform.content.2')}`}</p>
              ) : (
                <p>{`${t('modals:inviteNoExistPlatform.content.4')}`}</p>
              )}
              <p>{`${t('modals:inviteNoExistPlatform.content.3')}`}</p>
            </>
          ),
          okText: (
            <>
              <MailOutlined /> Send
            </>
          ),
          onOk() {
            addUser();
          },
          className: styles['warning-modal'],
        });

        setLoading(false);
        props.onCancel();
      } else {
        const errorMessager = new ErrorMessager(
          namespace.teams.checkUserPlatformRole,
        );
        errorMessager.triggerMsg(null, null, {
          email,
        });
      }
    }
  };

  return (
    <Modal
      title="Invite a User to the Platform"
      visible={props.visible}
      maskClosable={false}
      closable={false}
      okButtonProps={{ loading }}
      cancelButtonProps={{ disabled: loading }}
      footer={
        userAddCompleted
          ? [
              <Button
                key="submit"
                type="primary"
                onClick={() => {
                  props.onCancel();
                  form.resetFields();
                  setTimeout(() => {
                    setUserAddCompleted(false);
                  }, 500);
                }}
              >
                Close
              </Button>,
            ]
          : [
              <Button
                disabled={loading}
                key="back"
                onClick={() => {
                  props.onCancel();
                  form.resetFields();
                }}
              >
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                loading={loading}
                onClick={onSubmit}
              >
                Submit
              </Button>,
            ]
      }
    >
      {userAddCompleted ? (
        <p>
          <CheckCircleFilled style={{ color: '#BAEEA2', marginRight: 6 }} />{' '}
          Invitation email sent with AD request form attached
        </p>
      ) : (
        <Form form={form}>
          <Form.Item label="Email" name="email">
            <Input type="email" />
          </Form.Item>
          <Form.Item
            initialValue="member"
            label={'Role'}
            name="role"
            rules={[
              {
                required: true,
                message: t(
                  'formErrorMessages:platformUserManagement.role.empty',
                ),
              },
            ]}
          >
            <Radio.Group>
              <Radio value="member">
                Platform User &nbsp;
                <Tooltip
                  title={`${PLATFORM} Members who can view public content and Projects to which they are invited. Platform Users may hold either Project Administrator or Collaborator or Contributor roles in their Projects.`}
                >
                  <QuestionCircleOutlined />
                </Tooltip>
              </Radio>
              <Radio value="admin">
                Platform Administrator &nbsp;
                <Tooltip
                  title={`A ${PLATFORM} Administrator who has access to advanced permissions across all Projects to maintain the platform and assist Project Administrators with support issues related to their Project.`}
                >
                  <QuestionCircleOutlined />
                </Tooltip>
              </Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default InviteUserModal;
