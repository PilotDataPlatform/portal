import React, { useEffect, useState, useRef, useMemo } from 'react';

import { Row, Col, Tree, Tabs, Button, Input, Form, message } from 'antd';

import {
  listAllVirtualFolder,
  createVirtualFolder,
  deleteVirtualFolder,
  updateVirtualFolder,
} from '../../../../../APIs';
import { useCurrentProject, trimString } from '../../../../../Utility';
import RawTable from './RawTable';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  DownOutlined,
  HomeOutlined,
  CloudServerOutlined,
  DeleteOutlined,
  CompassOutlined,
  PlusOutlined,
  SaveOutlined,
  EditOutlined,
  CloseOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { DataSourceType, PanelKey } from './RawTableValues';
import CollectionIcon from '../../../../../Components/Icons/Collection';
import {
  setCurrentProjectActivePane,
  setCurrentProjectTree,
  vFolderOperation,
  VIRTUAL_FOLDER_OPERATIONS,
} from '../../../../../Redux/actions';
import i18n from '../../../../../i18n';
import { usePanel } from './usePanel';
import styles from './index.module.scss';
import variables from '../../../../../Themes/base.scss';
import { createHash } from 'crypto';
import currentProject from '../../../../../Redux/Reducers/currentProject';

const { TabPane } = Tabs;
const { TreeNode } = Tree;
const VFOLDER_CREATE_LEAF = 'vfolder-create';
function getTitle(title) {
  if (title.includes('Trash')) {
    return (
      <>
        <DeleteOutlined /> {title}
      </>
    );
  }
  if (title.startsWith('Core')) {
    return (
      <>
        <CloudServerOutlined /> {title}
      </>
    );
  } else if (title.startsWith('Collection')) {
    return (
      <>
        <CollectionIcon width={14} />
        {title}
      </>
    );
  } else {
    return (
      <>
        <HomeOutlined /> {title}
      </>
    );
  }
}

let clickLock = false;
/**
 *
 * @class FilesContent
 * @extends {Component}
 */
function FilesContent(props) {
  const { panes, addPane, removePane, activePane, activatePane, updatePanes } =
    usePanel();
  const [treeKey, setTreeKey] = useState(0);
  const [vfolders, setVfolders] = useState([]);
  const [saveBtnLoading, setSaveBtnLoading] = useState(false);
  const [deleteBtnLoading, setDeleteBtnLoading] = useState(false);
  const [updateBtnLoading, setUpdateBtnLoading] = useState(false);
  const [updateTimes, setUpdateTimes] = useState(0);
  // const [updatedPanes, setUpdatedPanes] = useState([]);
  const [deletedPaneKey, setDeletedPaneKey] = useState('');
  const [deleteItemId, setDeleteItemId] = useState('');
  const [createCollection, setCreateCollection] = useState(false);
  const [currentDataset] = useCurrentProject();
  const isInit = useRef(false);
  const [form] = Form.useForm();
  const currentRole = currentDataset?.permission;
  const projectGeid = currentDataset?.globalEntityId;
  const projectId = currentDataset.id;
  const projectCode = currentDataset.code;
  const editCollection = Object.keys(VIRTUAL_FOLDER_OPERATIONS).find(
    (operation) =>
      VIRTUAL_FOLDER_OPERATIONS[operation] === props.virtualFolders.operation,
  );
  const greenRoomData = [
    {
      title: 'Home',
      key: PanelKey.GREENROOM_HOME,
      icon: <CompassOutlined style={{ color: variables.primaryColor2 }} />,
    },
  ];

  const coreData = [
    {
      title: 'Home',
      key: PanelKey.CORE_HOME,
      icon: <CompassOutlined style={{ color: variables.primaryColorLight1 }} />,
    },
  ];

  const VFolderRenameForm = ({ id, title }) => {
    return (
      <div className={styles['vfolder-rename__form']}>
        <Form onFinish={onUpdateCollectionFormFinish}>
          <Form.Item
            className={styles['vfolder-rename__input-form-item']}
            name={id}
            initialValue={title}
            rules={[
              {
                required: true,
                validator: (rule, value) => {
                  const collection = value ? trimString(value) : null;
                  if (!collection) {
                    return Promise.reject(
                      'Collection name should be 1 ~ 20 characters',
                    );
                  }
                  const isLengthValid =
                    collection.length >= 1 && collection.length <= 20;
                  if (!isLengthValid) {
                    return Promise.reject(
                      'Collection name should be 1 ~ 20 characters',
                    );
                  } else {
                    const specialChars = [
                      '\\',
                      '/',
                      ':',
                      '?',
                      '*',
                      '<',
                      '>',
                      '|',
                      '"',
                      "'",
                    ];
                    for (let char of specialChars) {
                      if (collection.indexOf(char) !== -1) {
                        return Promise.reject(
                          `Collection name can not contain any of the following character ${specialChars.join(
                            ' ',
                          )}`,
                        );
                      }
                    }
                    return Promise.resolve();
                  }
                },
              },
            ]}
          >
            <Input />
          </Form.Item>
          <div className={styles['vfolder-rename__buttons']}>
            <Form.Item>
              <Button
                type="default"
                icon={<CloseOutlined />}
                onClick={() => props.clearVFolderOperation()}
                className="vfolder-rename__buttons-close"
              >
                Close
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={updateBtnLoading}
              >
                Save
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    );
  };

  const getVFolderTreeData = () => {
    const data = Array.isArray(props.project.tree?.vfolders)
      ? [...coreData, ...props.project.tree.vfolders]
      : coreData;

    return data.map((vfolder) => {
      let vfolderTitle;
      if (
        vfolder.geid === props.virtualFolders.geid &&
        props.virtualFolders.operation === VIRTUAL_FOLDER_OPERATIONS.RENAME
      ) {
        vfolderTitle = (
          <VFolderRenameForm
            id={vfolder.geid}
            title={vfolder.key.replace('vfolder-', '')}
          />
        );
      } else {
        // core is the only key that doesn't start with vfolder
        vfolderTitle = vfolder.key.startsWith('vfolder') ? vfolder.key.replace('vfolder-', '') : vfolder.title
      }
      vfolder.title = vfolderTitle;
      return vfolder;
    });
  };

  const vFolderTreeData = useMemo(
    () => getVFolderTreeData(),
    [props.project.tree, props.virtualFolders],
  );

  const firstPane = greenRoomData[0];
  //Fetch tree data, create default panel
  const fetch = async () => {
    // let allFolders;

    addPane({
      path: firstPane.path,
      title: getTitle(`Green Room - ${firstPane.title}  `),
      key: firstPane.key,
      content: {
        projectId,
        type: DataSourceType.GREENROOM_HOME,
      },
    });
    props.setCurrentProjectActivePane(firstPane.key);
    activatePane(firstPane.key);
    if (currentDataset.permission !== 'contributor') {
      const vfoldersRes = await updateVfolders();
      const vfoldersNodes = vfoldersRes.map((folder) => {
        return {
          title: folder.name,
          key: 'vfolder-' + folder.name,
          icon: (
            <CollectionIcon
              width={12}
              style={{ color: variables.primaryColorLight4 }}
            />
          ),
          disabled: false,
          children: null,
          createdTime: folder.timeCreated,
          geid: folder.id,
        };
      });
      props.setCurrentProjectTree({
        vfolders: vfoldersNodes,
      });
    }

    isInit.current = true;
  };

  const updateVfolderTree = async (
    editCollection,
    createCollection,
    deleteBtnLoading,
    updateBtnLoading,
  ) => {
    const vfoldersRes = await updateVfolders(); //already called on fetch Data, not sure if it can be deleted
    const vfoldersNodes = vfoldersRes.map((folder) => {
      return {
        title: folder.name,
        key: 'vfolder-' + folder.name,
        icon: (
          <CollectionIcon
            width={12}
            style={{ color: variables.primaryColorLight4 }}
          />
        ),
        disabled: false,
        children: null,
        createdTime: folder.timeCreated,
        geid: folder.id,
      };
    });

    props.setCurrentProjectTree({
      vfolders: vfoldersNodes,
    });

    if (createCollection && saveBtnLoading) {
      setSaveBtnLoading(false);
      setCreateCollection(false);
      message.success(`${i18n.t('success:collections.addCollection')}`);
    }

    if (editCollection) {
      if (deleteBtnLoading) {
        setDeleteBtnLoading(false);
        remove(deletedPaneKey);
        message.success(`${i18n.t('success:collections.deleteCollection')}`);
      }

      if (updateBtnLoading) {
        setUpdateBtnLoading(false);
        props.clearVFolderOperation();
        message.success(`${i18n.t('success:collections.updateCollections')}`);
      }
    }
  };

  const getTabName = (activePane) => {
    if (activePane.startsWith('vfolder')) {
      return 'vfolder';
    }

    switch (activePane) {
      case PanelKey.GREENROOM_HOME:
        return 'greenroom';
        break;

      case PanelKey.CORE_HOME:
        return 'core';
        break;

      case PanelKey.TRASH:
        return 'trash';
        break;
    }
  };

  useEffect(() => {
    fetch();
  }, [projectId]);

  useEffect(() => {
    if (currentDataset.permission !== 'contributor') {
      updateVfolderTree(
        editCollection,
        createCollection,
        deleteBtnLoading,
        updateBtnLoading,
      );
    }
  }, [vfolders.length, updateTimes]);

  async function updateVfolders() {
    try {
      const res = await listAllVirtualFolder(projectCode, props.username);
      const virtualFolder = res.data.result;
      setVfolders(virtualFolder);
      return virtualFolder;
    } catch (e) {
      return [];
    }
  }

  //Tab
  const onChange = (selectedActivePane) => {
    props.setCurrentProjectActivePane(selectedActivePane);
    activatePane(selectedActivePane);
    setTreeKey((prev) => {
      return prev.treeKey + 1;
    });
  };

  const onEdit = (targetKey, action) => {
    switch (action) {
      case 'remove': {
        remove(targetKey);
        break;
      }
      default: {
        break;
      }
    }
    setTreeKey((prev) => {
      return prev.treeKey + 1;
    });
  };

  const remove = (targetKey) => {
    let lastIndex;
    let newActiveKey = activePane;
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panesFiltered = panes.filter((pane) => pane.key !== targetKey);
    if (panesFiltered.length && activePane === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = panesFiltered[lastIndex].key;
      } else {
        newActiveKey = panesFiltered[0].key;
      }
    }
    removePane(targetKey);
    props.setCurrentProjectActivePane(newActiveKey);
    activatePane(newActiveKey);
  };

  const onSelect = async (selectedKeys, info) => {
    if (selectedKeys[0] && selectedKeys[0].toString() === VFOLDER_CREATE_LEAF) {
      return;
    }
    if (!isInit.current) {
      return;
    }
    if (selectedKeys.length === 0) {
      return;
    }

    if (clickLock) {
      return;
    }
    clickLock = true;
    props.setCurrentProjectActivePane(selectedKeys[0].toString());
    const isOpen = _.chain(panes)
      .map('key')
      .find((item) => item === selectedKeys[0])
      .value();
    if (isOpen) {
      //set active pane
      activatePane(selectedKeys[0].toString());
      setTreeKey((prev) => {
        return prev.treeKey + 1;
      });
    } else {
      setTreeKey((prev) => {
        return prev.treeKey + 1;
      });
      //Render raw table if 0
      const newPane = await getNewPane(selectedKeys, info);
      setTreeKey((prev) => {
        return prev.treeKey + 1;
      });
      activatePane(selectedKeys[0].toString());
      addPane(newPane);
    }
    clickLock = false;
  };

  // const onCollectionSelect = async (selectedKeys, info) => {
  //   await onSelect(selectedKeys, info);
  //   setIsCollectionSelected(true);
  // };

  const onCreateCollectionFormFinish = async (values) => {
    const { newCollectionName } = values;
    try {
      setSaveBtnLoading(true);
      await createVirtualFolder(projectCode, newCollectionName, props.username);
      updateVfolders();
    } catch (error) {
      setSaveBtnLoading(false);
      switch (error.response?.status) {
        case 409: {
          message.error(
            `${i18n.t('errormessages:createVirtualFolder.duplicate.0')}`,
            3,
          );
          break;
        }
        case 400: {
          message.error(
            `${i18n.t('errormessages:createVirtualFolder.limit.0')}`,
            3,
          );
          break;
        }
        default: {
          message.error(
            `${i18n.t('errormessages:createVirtualFolder.default.0')}`,
            3,
          );
        }
      }
    }
  };

  const onUpdateCollectionFormFinish = async (values) => {
    try {
      let updateCollectionList = [];
      const originalNameList = vfolders.map((el) => el.name);
      const updateNameList = Object.values(values);
      const diffNameList = updateNameList.filter((el) => {
        if (!originalNameList.includes(el)) {
          return el;
        }
      });
      const idList = Object.keys(values);
      idList.forEach((el) => {
        if (diffNameList.includes(values[el])) {
          updateCollectionList.push({
            id: el,
            name: values[el],
          });
        }
      });
      setUpdateBtnLoading(true);
      const res = await updateVirtualFolder(
        projectGeid,
        props.username,
        projectCode,
        updateCollectionList,
      );
      if (res.data.result.collections.length) {
        setUpdateTimes(updateTimes + 1);

        //update collection panel name
        const updatedPane = [...panes];

        if (panes.length > 0) {
          const vfolderIds = panes
            .filter((el) => el.key.startsWith('vfolder-'))
            .map((el) => el.content.geid);
          res.data.result.collections.forEach((el) => {
            if (vfolderIds.includes(el.id)) {
              const selectPane = updatedPane.find(
                (item) => item.content.geid === el.id,
              );
              selectPane.title = getTitle(`Collection - ${el.name}  `);
              if (selectPane.key === activePane) {
                selectPane.key = `vfolder-${el.name}`;
                activatePane(selectPane.key);
              } else {
                selectPane.key = `vfolder-${el.name}`;
              }
            }
          });
          updatePanes(updatedPane);
        }
      } else {
        setUpdateBtnLoading(false);
        message.warning(
          `${i18n.t('errormessages:updateVirtualFolder.noFoldersToUpdate.0')}`,
        );
      }
    } catch (error) {
      console.log(error);
      setUpdateBtnLoading(false);
      message.error(`${i18n.t('errormessages:updateVirtualFolder.default.0')}`);
    }
  };

  const deleteCollection = async (geid, key) => {
    try {
      setDeleteBtnLoading(true);
      setDeletedPaneKey(key);
      await deleteVirtualFolder(geid);
      updateVfolders();
    } catch (error) {
      setDeleteBtnLoading(false);
      message.error(`${i18n.t('errormessages:deleteVirtualFolder.default.0')}`);
    }
  };

  // TODO: deprecated
  const showForm = (editCollection, createCollection) => {
    if (!editCollection && !createCollection) {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            margin: '3px 0px 0px 38px',
          }}
        >
          <PlusOutlined
            style={{
              width: '14px',
              height: '14px',
              color: '#1890FF',
              marginRight: '10px',
            }}
          />
          <span
            style={{
              fontSize: '12px',
              color: '#818181',
              cursor: 'pointer',
            }}
            onClick={() => setCreateCollection(true)}
          >
            Create Collection
          </span>
        </div>
      );
    } else if (editCollection && !createCollection) {
      return (
        <div style={{ display: 'flex', marginLeft: '33px' }}>
          <Form onFinish={onUpdateCollectionFormFinish}>
            {vfolders.map((el, index) => (
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <Form.Item
                  className={styles.update_collection_name}
                  name={el.id}
                  initialValue={el.name}
                  rules={[
                    {
                      required: true,
                      validator: (rule, value) => {
                        const collection = value ? trimString(value) : null;
                        if (!collection) {
                          return Promise.reject(
                            'Collection name should be 1 ~ 20 characters',
                          );
                        }
                        const isLengthValid =
                          collection.length >= 1 && collection.length <= 20;
                        if (!isLengthValid) {
                          return Promise.reject(
                            'Collection name should be 1 ~ 20 characters',
                          );
                        } else {
                          const specialChars = [
                            '\\',
                            '/',
                            ':',
                            '?',
                            '*',
                            '<',
                            '>',
                            '|',
                            '"',
                            "'",
                          ];
                          for (let char of specialChars) {
                            if (collection.indexOf(char) !== -1) {
                              return Promise.reject(
                                `Collection name can not contain any of the following character ${specialChars.join(
                                  ' ',
                                )}`,
                              );
                            }
                          }
                          return Promise.resolve();
                        }
                      },
                    },
                  ]}
                >
                  <Input
                    //defaultValue={el.name}
                    style={{
                      borderRadius: '6px',
                      marginLeft: '16px',
                      marginRight: '10px',
                      height: '28px',
                    }}
                  ></Input>
                </Form.Item>
                {deleteBtnLoading && deleteItemId === el.id ? (
                  <LoadingOutlined spin style={{ marginRight: '10px' }} />
                ) : (
                  <DeleteOutlined
                    style={{ color: '#FF6D72', marginRight: '10px' }}
                    onClick={() => {
                      deleteCollection(el.id, 'vfolder-' + el.name);
                      setDeleteItemId(el.id);
                    }}
                  />
                )}
              </div>
            ))}
            <Form.Item
              style={{
                position: 'absolute',
                top: '0px',
                right: '33px',
                margin: '0px',
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={updateBtnLoading}
                style={{
                  height: '22px',
                  width: '70px',
                  borderRadius: '6px',
                  padding: '0px',
                }}
              >
                <span style={{ marginLeft: '6px' }}>Save</span>
              </Button>
            </Form.Item>
          </Form>
        </div>
      );
    } else if (createCollection && !editCollection) {
      return (
        <div style={{ display: 'flex', marginLeft: '33px' }}>
          <Form onFinish={onCreateCollectionFormFinish}>
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <CollectionIcon
                width={12}
                style={{ color: variables.primaryColorLight4 }}
              />
              <Form.Item
                className={styles.create_new_collection}
                name="newCollectionName"
                rules={[
                  {
                    required: true,
                    validator: (rule, value) => {
                      const collection = value ? trimString(value) : null;
                      if (!collection) {
                        return Promise.reject(
                          'Collection name should be 1 ~ 20 characters',
                        );
                      }
                      const isLengthValid =
                        collection.length >= 1 && collection.length <= 20;
                      if (!isLengthValid) {
                        return Promise.reject(
                          'Collection name should be 1 ~ 20 characters',
                        );
                      } else {
                        const specialChars = [
                          '\\',
                          '/',
                          ':',
                          '?',
                          '*',
                          '<',
                          '>',
                          '|',
                          '"',
                          "'",
                        ];
                        for (let char of specialChars) {
                          if (collection.indexOf(char) !== -1) {
                            return Promise.reject(
                              `Collection name can not contain any of the following character ${specialChars.join(
                                ' ',
                              )}`,
                            );
                          }
                        }
                        return Promise.resolve();
                      }
                    },
                  },
                ]}
              >
                <Input
                  placeholder="Enter Collection Name"
                  style={{
                    borderRadius: '6px',
                    marginLeft: '10px',
                    marginRight: '10px',
                    fontSize: '13px',
                  }}
                ></Input>
              </Form.Item>
            </div>
            <Form.Item
              style={{
                position: 'absolute',
                top: '0px',
                right: '33px',
                margin: '0px',
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                loading={saveBtnLoading}
                icon={<SaveOutlined />}
                style={{
                  height: '22px',
                  width: '70px',
                  borderRadius: '6px',
                  padding: '0px',
                }}
              >
                <span style={{ marginLeft: '6px' }}>Save</span>
              </Button>
            </Form.Item>
          </Form>
        </div>
      );
    }
  };

  const coreTreeClassName = `tree-custom-line core${
    props.virtualFolders.operation === VIRTUAL_FOLDER_OPERATIONS.RENAME
      ? ' virtual-folder-rename'
      : ''
  }`;

  return (
    <>
      <Row style={{ minWidth: 750 }}>
        <Col xs={24} sm={24} md={24} lg={24} xl={4} className={styles.file_dir}>
          <div className={styles.greenroom_section}>
            <div
              style={
                activePane === 'greenroom'
                  ? {
                      width: '135px',
                      backgroundColor: '#ACE4FD',
                      padding: '5px 11px',
                    }
                  : { padding: '5px 11px' }
              }
            >
              <span style={{ fontWeight: 600 }}>
                <HomeOutlined
                  style={{
                    marginRight: '10px',
                    color: variables.primaryColor2,
                  }}
                />
                <span
                  className={styles.greenroom_title}
                  onClick={(e) =>
                    onSelect([PanelKey.GREENROOM], {
                      node: {
                        key: PanelKey.GREENROOM,
                        title: 'Green Room',
                      },
                    })
                  }
                >
                  Green Room
                </span>
              </span>
            </div>
            <Tree
              className="tree-custom-line green_room"
              showIcon
              selectedKeys={[activePane]}
              switcherIcon={<DownOutlined />}
              onSelect={onSelect}
              treeData={greenRoomData}
              key={treeKey}
            />
          </div>
          {!['contributor'].includes(currentRole) && (
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 5,
                  padding: '5px 11px 5px 0',
                }}
              >
                <div
                  style={
                    activePane === 'core'
                      ? {
                          width: '135px',
                          backgroundColor: '#ACE4FD',
                          paddingLeft: '11px',
                        }
                      : { paddingLeft: '11px' }
                  }
                >
                  <span style={{ fontWeight: 600 }}>
                    <CloudServerOutlined
                      style={{
                        marginRight: '10px',
                        color: variables.primaryColorLight1,
                      }}
                    />
                    <span
                      className={styles.core_title}
                      id="core_title"
                      onClick={(e) =>
                        onSelect([PanelKey.CORE], {
                          node: {
                            key: PanelKey.CORE,
                            title: 'Core',
                          },
                        })
                      }
                    >
                      Core
                    </span>
                  </span>
                </div>
              </div>
              <Tree
                className={coreTreeClassName}
                defaultExpandedKeys={[PanelKey.CORE_HOME]}
                showIcon
                selectedKeys={[activePane]}
                switcherIcon={<DownOutlined />}
                onSelect={onSelect}
                treeData={vFolderTreeData}
                key={treeKey}
              />
            </div>
          )}
          {/* <Collapse
              title={'Saved Searches'}
              icon={<SaveOutlined style={{ marginRight: '4px' }} />}
            >
              <Tree className="save_search" showIcon />
            </Collapse> */}
          <div
            style={{ margin: '15px 0px 20px 11px' }}
            onClick={(e) =>
              onSelect([PanelKey.TRASH], {
                node: {
                  key: PanelKey.TRASH,
                  title: 'Trash Bin',
                },
              })
            }
          >
            <DeleteOutlined style={{ color: variables.primaryColorLight3 }} />
            <span
              className={
                activePane === PanelKey.TRASH
                  ? `${styles.trash_bin} ${styles['trash_bin--active']}`
                  : styles.trash_bin
              }
            >
              Trash Bin
            </span>
          </div>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={20}>
          <div
            className={styles['file-explorer__tabs']}
            id="file-explorer-tabs"
          >
            <Tabs
              hideAdd
              onChange={onChange}
              activeKey={activePane}
              type="editable-card"
              onEdit={onEdit}
              style={{
                paddingTop: '6px',
                borderLeft: '1px solid rgb(240,240,240)',
              }}
              renderTabBar={(props, DefaultTabBar) => (
                <DefaultTabBar
                  {...props}
                  className={`active-tab-${getTabName(
                    activePane,
                  )} ant-tabs-card-bar`}
                />
              )}
            >
              {panes &&
                panes.map((pane) => (
                  <TabPane tab={pane.title} key={pane.key.toString()}>
                    <div
                      style={{
                        minHeight: '300px',
                      }}
                    >
                      <RawTable
                        projectId={pane.content.projectId}
                        type={pane.content.type}
                        panelKey={pane.key}
                        activePane={activePane}
                        removePanel={remove}
                        geid={pane.content.geid} // only for vfolder
                        title={pane.title}
                        titleText={pane.titleText}
                      />
                    </div>
                  </TabPane>
                ))}
            </Tabs>
          </div>
        </Col>
      </Row>
    </>
  );

  async function getNewPane(selectedKeys, info) {
    let newPane = {};
    if (selectedKeys[0] === PanelKey.GREENROOM_HOME) {
      const title = getTitle(`Green Room - ${info.node.title}  `);
      newPane = {
        title,
        content: {
          projectId,
          type: DataSourceType.GREENROOM_HOME,
        },
        key: info.node.key.toString(),
      };
    } else if (selectedKeys[0] === PanelKey.GREENROOM) {
      const title = getTitle('Green Room');
      newPane = {
        title,
        content: {
          projectId,
          type: DataSourceType.GREENROOM,
        },
        key: info.node.key.toString(),
      };
    } else if (selectedKeys[0] === PanelKey.CORE) {
      const title = getTitle('Core');
      newPane = {
        title,
        content: {
          projectId,
          type: DataSourceType.CORE,
        },
        key: info.node.key.toString(),
      };
    } else if (selectedKeys[0] === PanelKey.TRASH) {
      let title = getTitle(`Trash Bin`);
      let type = DataSourceType.TRASH;
      newPane = {
        title: title,
        content: {
          projectId: projectId,
          type,
        },
        key: info.node.key.toString(),
      };
    } else if (selectedKeys[0] === PanelKey.CORE_HOME) {
      const title = getTitle(`Core - ${info.node.title}  `);
      newPane = {
        title: title,
        content: {
          projectId: projectId,
          type: DataSourceType.CORE_HOME,
        },
        key: info.node.key.toString(),
      };
    } else if (selectedKeys[0].startsWith('vfolder')) {
      let vfolder = vfolders.find((v) => v.name === info.node.title);
      if (!vfolder) {
        const vfoldersRes = await updateVfolders();
        vfolder = vfoldersRes.find((v) => v.name === info.node.title);
      }
      if (vfolder) {
        const title = getTitle(`Collection - ${info.node.title}  `);
        newPane = {
          title: title,
          titleText: info.node.title,
          content: {
            projectId: projectId,
            type: DataSourceType.CORE_VIRTUAL_FOLDER,
            geid: info.node.geid,
          },
          key: info.node.key.toString(),
        };
      }
    }
    return newPane;
  }
}

export default connect(
  (state) => ({
    project: state.project,
    username: state.username,
    virtualFolders: state.virtualFolders,
  }),
  {
    setCurrentProjectTree,
    setCurrentProjectActivePane,
    clearVFolderOperation: vFolderOperation.clearVFolderOperation,
  },
)(FilesContent);
