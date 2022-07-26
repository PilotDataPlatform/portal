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
import { Modal, Form, Radio, message, Input, Button, Tooltip } from 'antd';
import {
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import {
  addUserToProjectAPI,
  inviteUserApi,
  checkUserPlatformRole,
  createSubFolderApi,
} from '../../../../APIs';
import {
  validateEmail,
  formatRole,
  useCurrentProject,
} from '../../../../Utility';
import { namespace, ErrorMessager } from '../../../../ErrorMessages';
import { useTranslation } from 'react-i18next';
import styles from '../index.module.scss';
import { useKeycloak } from '@react-keycloak/web';
import { v4 as uuidv4 } from 'uuid';

function AddUserModal(props) {
  const { isAddUserModalShown, closeAddUserModal } = props;
  const [form] = Form.useForm();
  const [submitting, toggleSubmitting] = useState(false);
  const { t } = useTranslation(['errormessages', 'modals']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [role, setRole] = useState('admin');
  const [currentDataset = {}] = useCurrentProject();
  const { keycloak } = useKeycloak();

  const handleCancel = () => {
    form.resetFields();
    closeAddUserModal();
  };

  function addUserToProject(email, role, username) {
    addUserToProjectAPI(username, currentDataset.globalEntityId, role)
      .then(async (res) => {
        // successfully invited
        await props.getUsers();
        message.success(
          `${t('success:addUser.addUserToDataset.0')} ${username} ${t(
            'success:addUser.addUserToDataset.1',
          )} ${currentDataset.name}`,
        );
      })
      .catch((err) => {
        if (err.response?.status === 403) {
          //Already Project Member
          memberWarning(t, email);
        }
        return Promise.reject();
      })
      .then(async () => {
        await createFolderIfNotExist(username);
      })
      .catch((err) => {
        if (err?.response?.status !== 409) {
          const errorMessager = new ErrorMessager(
            namespace.teams.addUsertoDataSet,
          );
          errorMessager.triggerMsg(null, null, {
            email: email,
          });
        }
      });
  }
  async function createFolderIfNotExist(username) {
    await createSubFolderApi(
      username,
      null,
      currentDataset.code,
      username,
      'Greenroom',
      currentDataset.globalEntityId,
    );
    await createSubFolderApi(
      username,
      null,
      currentDataset.code,
      username,
      'Core',
      currentDataset.globalEntityId,
    );
  }
  const onSubmit = async () => {
    const { email, role } = form.getFieldsValue();
    setIsSubmitting(true);

    if (email) {
      const isValidEmail = validateEmail(email);

      if (!isValidEmail) {
        message.error(t('errormessages:addUser2Project.email'));
        setIsSubmitting(false);
        return;
      }
      toggleSubmitting(true);

      const checkStatusAndRole = (
        status,
        platformRole,
        email,
        name,
        relationship,
      ) => {
        if (platformRole !== 'member') {
          toggleSubmitting(false);
          setIsSubmitting(false);
        }

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

        if (!statusDictionary) {
          if (platformRole === 'admin') {
            return Modal.warning({
              title: t('errormessages:addUser2Platform.platformAdmin.title'),
              content: `${t(
                'errormessages:addUser2Platform.platformAdmin.content',
              )}`,
            });
          }
          if (platformRole === 'member') {
            if (relationship.hasOwnProperty('projectGeid')) {
              return memberWarning(t, email);
            } else {
              return addUserToProject(email, role, name);
            }
          }
        }

        Modal.warning({
          title: t(`errormessages:addUser2Platform.${statusDictionary}.title`),
          content: `${t(
            `errormessages:addUser2Platform.${statusDictionary}.content.0`,
          )} ${email} ${t(
            `errormessages:addUser2Platform.${statusDictionary}.content.1`,
          )}`,
          className: styles['warning-modal'],
        });
      };

      try {
        const res = await checkUserPlatformRole(
          email.toLowerCase(),
          currentDataset.code,
        );
        if (res.status === 200 && res.data.result) {
          const {
            role: platformRole,
            status,
            name,
            relationship,
          } = res.data.result;
          checkStatusAndRole(status, platformRole, email, name, relationship);
        }
        closeAddUserModal();
      } catch (err) {
        toggleSubmitting(false);
        if (err.response && err.response.status === 404) {
          closeAddUserModal();
          Modal.confirm({
            title: t('modals:inviteNoExist.title'),
            icon: <ExclamationCircleOutlined />,
            content: (
              <>
                {' '}
                <p>
                  {`${t('modals:inviteNoExist.content.0')} ${email} ${t(
                    'modals:inviteNoExist.content.1',
                  )}`}{' '}
                  {currentDataset.name.length < 30 ? (
                    `${currentDataset.name}`
                  ) : (
                    <Tooltip title={currentDataset.name}>
                      {currentDataset.name.slice(0, 28) + '...'}
                    </Tooltip>
                  )}{' '}
                  {`${t('modals:inviteNoExist.content.2')} ${formatRole(role)}`}
                </p>
                <p>{`${t('modals:inviteNoExist.content.3')}`}</p>
              </>
            ),
            okText: (
              <>
                <MailOutlined /> Send
              </>
            ),
            onOk() {
              addUser(email, role);
            },
            className: styles['warning-modal'],
          });
        } else {
          const errorMessager = new ErrorMessager(
            namespace.teams.checkUserPlatformRole,
          );
          errorMessager.triggerMsg(err.response && err.response.status, null, {
            email: email,
          });
        }
      }
      setIsSubmitting(false);
      form.resetFields();
    }
  };

  const onRoleChange = (e) => {
    setRole(e.target.value);
  };

  const addUser = async (userEmail, userRole) => {
    try {
      await inviteUserApi(
        userEmail,
        'member',
        keycloak.tokenParsed?.preferred_username,
        userRole,
        currentDataset?.code,
      );
      //setCompletedUserAdd(true)
    } catch (err) {
      if (err.response) {
        const errorMessager = new ErrorMessager(namespace.teams.inviteUser);
        errorMessager.triggerMsg(err.response.status, null, {
          email: userEmail,
        });
      }
    }
  };
  return (
    <>
      <Modal
        title="Add a member to project"
        visible={isAddUserModalShown}
        maskClosable={false}
        closable={false}
        confirmLoading={submitting}
        onCancel={handleCancel}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        footer={[
          <Button
            id="add-member-cancel-button"
            disabled={isSubmitting}
            key="back"
            onClick={handleCancel}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isSubmitting}
            onClick={onSubmit}
          >
            Submit
          </Button>,
        ]}
        cancelButtonProps={{ disabled: submitting }}
      >
        <Form form={form} initialValues={{ role }}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                type: 'email',
                message: t('formErrorMessages:common.email.valid'),
              },
              {
                required: true,
                message: t('formErrorMessages:common.email.valid'),
              },
            ]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[
              {
                required: true,
                message: t(
                  'formErrorMessages:project.addMemberModal.role.empty',
                ),
              },
            ]}
          >
            <Radio.Group style={{ marginTop: 5 }} onChange={onRoleChange}>
              {props.rolesDetail &&
                props.rolesDetail.map((el) => (
                  <Radio key={uuidv4()} value={el.value}>
                    {el.label}&nbsp;
                    <Tooltip title={el.description}>
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </Radio>
                ))}
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default connect((state) => ({
  userList: state.userList,
  containersPermission: state.containersPermission,
}))(AddUserModal);

function memberWarning(t, email) {
  Modal.warning({
    title: t('errormessages:addUsertoDataSet.403.title.0'),
    content: (
      <>
        {' '}
        <p>{`${email} ${t('errormessages:addUsertoDataSet.403.content.0')}`}</p>{' '}
        <p>{`${t('errormessages:addUsertoDataSet.403.content.1')}`} </p>
      </>
    ),
    className: styles['warning-modal'],
  });
}
