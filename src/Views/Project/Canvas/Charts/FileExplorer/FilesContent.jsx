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
import CollectionCreation from './CollectionCreation';
import canvasPage from '../../../../../Redux/Reducers/canvasPage';

const { TabPane } = Tabs;
const VFOLDER_CREATE_LEAF = 'create-vfolder';
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
        <Form form={form}>
          <Form.Item name="id" initialValue={id} style={{ display: 'none' }}>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item
            className={styles['vfolder-rename__input-form-item']}
            name="name"
            initialValue={title}
            rules={[
              {
                required: true,
                validator: (rule, value) => {
                  const collection = value ? trimString(value) : null;
                  if (!collection) {
                    return Promise.reject('1 ~ 20 characters');
                  }
                  const isLengthValid =
                    collection.length >= 1 && collection.length <= 20;
                  if (!isLengthValid) {
                    return Promise.reject('1 ~ 20 characters');
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
                          `special characters are not allowed`,
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
                onClick={onUpdateCollectionFormFinish}
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

    return data
      .map((vfolder) => {
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
          vfolderTitle = vfolder.key.startsWith('vfolder')
            ? vfolder.key.replace('vfolder-', '')
            : vfolder.title;
        }
        vfolder.title = vfolderTitle;
        return vfolder;
      })
      .concat([
        {
          title: (
            <CollectionCreation
              addNewColPane={addNewColPane}
              updateVfolders={updateVfolders}
              createCollection={
                props.virtualFolders.operation ===
                VIRTUAL_FOLDER_OPERATIONS.CREATE
              }
            />
          ),
          key: VFOLDER_CREATE_LEAF,
          disabled: false,
          children: null,
          geid: VFOLDER_CREATE_LEAF,
        },
      ]);
  };

  const vFolderTreeData = useMemo(
    () => getVFolderTreeData(),
    [props.project.tree, props.virtualFolders],
  );

  const firstPane = greenRoomData[0];
  //Fetch tree data, create default panel
  const getDefaultPane = () => {
    if (props.canvasPage) {
      if (props.canvasPage.page === 'greenroom-home') {
        return {
          title: getTitle(`Green Room - Home`),
          key: PanelKey.GREENROOM_HOME,
          content: {
            projectId,
            type: DataSourceType.GREENROOM_HOME,
          },
        };
      }
      if (props.canvasPage.page === 'core-home') {
        return {
          title: getTitle(`Core - Home`),
          key: PanelKey.CORE_HOME,
          content: {
            projectId,
            type: DataSourceType.GREENROOM_HOME,
          },
        };
      }
      if (props.canvasPage.page === 'collection') {
        const title = getTitle(`Collection - ${props.canvasPage.name}  `);
        return {
          title: title,
          titleText: props.canvasPage.name,
          content: {
            projectId: projectId,
            type: DataSourceType.CORE_VIRTUAL_FOLDER,
            geid: props.canvasPage.id,
          },
          key: 'vfolder-' + props.canvasPage.name,
        };
      }
    }
  };
  const fetch = async () => {
    // let allFolders;
    const defaultOpenPane = getDefaultPane();
    addPane(defaultOpenPane);
    props.setCurrentProjectActivePane(defaultOpenPane.key);
    activatePane(defaultOpenPane.key);
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

    if (saveBtnLoading) {
      setSaveBtnLoading(false);
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
    if (canvasPage.page) {
      fetch();
    }
  }, [projectId, canvasPage]);

  useEffect(() => {
    if (currentDataset.permission !== 'contributor') {
      updateVfolderTree(editCollection, deleteBtnLoading, updateBtnLoading);
    }
  }, [vfolders.length, updateTimes]);

  async function addNewColPane(vfolderInfo) {
    const panelKey = 'vfolder-' + vfolderInfo.name;
    // props.setCurrentProjectActivePane(selectedKeys[0].toString());
    setTreeKey((prev) => {
      return prev.treeKey + 1;
    });
    const title = getTitle(`Collection - ${vfolderInfo.name}  `);
    //Render raw table if 0
    const newPane = {
      title: title,
      titleText: vfolderInfo.name,
      content: {
        projectId: projectId,
        type: DataSourceType.CORE_VIRTUAL_FOLDER,
        geid: vfolderInfo.id,
      },
      key: panelKey,
    };
    setTreeKey((prev) => {
      return prev.treeKey + 1;
    });
    activatePane(panelKey);
    addPane(newPane);
  }

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
    props.clearVFolderOperation();
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
    if (selectedKeys[0] && selectedKeys[0].toString() !== activePane) {
      props.clearVFolderOperation();
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

  const onUpdateCollectionFormFinish = async () => {
    form.validateFields().then(async (values) => {
      try {
        let updateCollectionList = [];
        updateCollectionList.push({
          id: values.id,
          name: values.name,
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
            `${i18n.t(
              'errormessages:updateVirtualFolder.noFoldersToUpdate.0',
            )}`,
          );
        }
      } catch (error) {
        console.log(error);
        setUpdateBtnLoading(false);
        message.error(
          `${i18n.t('errormessages:updateVirtualFolder.default.0')}`,
        );
      }
    });
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
    canvasPage: state.canvasPage,
  }),
  {
    setCurrentProjectTree,
    setCurrentProjectActivePane,
    clearVFolderOperation: vFolderOperation.clearVFolderOperation,
  },
)(FilesContent);
