import React, { useState, useEffect } from 'react';

import {
  HomeOutlined,
  PaperClipOutlined,
  CloudServerOutlined,
} from '@ant-design/icons';
import { listAllVirtualFolder, projectFileCountTotal } from '../../../../APIs';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styles from './index.module.scss';
import { useCurrentProject } from '../../../../Utility';
import { canvasPageActions } from '../../../../Redux/actions';
import { useDispatch } from 'react-redux';
import '../../../../Themes/base.scss';
import { history } from '../../../../Routes';

function FileStats(props) {
  const [greenRoomCount, setGreenRoomCount] = useState(0);
  const [coreCount, setCoreCount] = useState(0);
  const [collections, setCollections] = useState([]);
  const [currentProject] = useCurrentProject();

  const dispatch = useDispatch();

  useEffect(() => {
    if (currentProject) {
      projectFileCountTotal(currentProject.globalEntityId, {
        start_date: moment().startOf('day').unix(),
        end_date: moment().endOf('day').unix(),
      }).then((res) => {
        const statistics = res?.data?.result;
        if (res.status === 200 && statistics) {
          setGreenRoomCount(statistics.greenroom);
          setCoreCount(statistics.core);
        }
      });

      listAllVirtualFolder(currentProject.code, props.username).then((res) => {
        setCollections(res.data.result);
      });
    }
  }, [currentProject, props.successNum]);

  const goToPage = (page) => {
    // console.log(page);
    if (page === 'collection') {
      dispatch(
        canvasPageActions.setCanvasPage({
          page: page,
          name: collections.length > 0 ? collections[0].name : '',
          id: collections.length > 0 ? collections[0].id : '',
        }),
      );
      history.push(`/project/${currentProject.code}/data`);
    } else {
      dispatch(
        canvasPageActions.setCanvasPage({
          page: page,
        }),
      );
      history.push(`/project/${currentProject.code}/data`);
    }
  };

  return currentProject ? (
    <div style={{ flexDirection: 'column', display: 'flex' }}>
      <div
        className={styles.shortcut}
        onClick={() => goToPage('greenroom-home')}
      >
        <span className={styles.iconColumn}>
          <HomeOutlined className={styles.icon1} />
        </span>
        <span className={styles.fileFont}>Green Room</span>
        <span className={styles.fileNumber}>Files {greenRoomCount}</span>
      </div>
      {props.projectRole !== 'collaborator' && coreCount !== null ? (
        <div className={styles.shortcut} onClick={() => goToPage('core-home')}>
          <span className={styles.iconColumn}>
            <CloudServerOutlined className={styles.icon2} />
          </span>
          <span className={styles.fileFont}>Core</span>
          <span className={styles.fileNumber}>Files {coreCount}</span>
        </div>
      ) : null}
      {props.projectRole !== 'collaborator' ? (
        <div className={styles.shortcut} onClick={() => goToPage('collection')}>
          <span className={styles.iconColumn}>
            <PaperClipOutlined
              className={styles.icon3}
              style={{
                cursor: collections.length === 0 ? '' : 'pointer',
                opacity: collections.length === 0 ? 0.5 : 1,
              }}
            />
          </span>
          <span
            className={styles.fileFont}
            style={{ opacity: collections.length === 0 ? 0.5 : 1 }}
          >
            <span
              className={styles['collections-num']}
              style={{
                opacity: collections.length === 0 ? 0.5 : 1,
              }}
            >
              {collections.length}
            </span>{' '}
            Collections
          </span>
        </div>
      ) : null}
    </div>
  ) : null;
}

export default connect(
  (state) => ({
    containersPermission: state.containersPermission,
    datasetList: state.datasetList,
    successNum: state.successNum,
    username: state.username,
    role: state.role,
    canvasPage: state.canvasPage,
  }),
  { setCanvasPage: canvasPageActions.setCanvasPage },
)(withRouter(FileStats));
