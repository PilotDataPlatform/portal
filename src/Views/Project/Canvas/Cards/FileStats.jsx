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
    if (page === 'Collection') {
      dispatch(
        canvasPageActions.setCanvasPage({
          page: page,
          id: collections.length > 0 ? collections[0].id : '',
        }),
      );
    } else {
      dispatch(
        canvasPageActions.setCanvasPage({
          page: page,
        }),
      );
    }
  };

  return currentProject ? (
    <div style={{ flexDirection: 'column', display: 'flex' }}>
      <div className={styles.shortcut} onClick={() => goToPage('Green Home')}>
        <span className={styles.iconColumn}>
          <HomeOutlined
            className={styles.icon}
            style={{ color: '$primary-color-light-2' }}
          />
        </span>
        <span className={styles.fileFont}>Green Room</span>
        <span className={styles.fileNumber}>Files {greenRoomCount}</span>
      </div>
      {props.projectRole !== 'collaborator' && coreCount !== null ? (
        <div className={styles.shortcut} onClick={() => goToPage('Core')}>
          <span className={styles.iconColumn}>
            <CloudServerOutlined
              className={styles.icon}
              style={{ color: '#1E607E' }}
            />
          </span>
          <span className={styles.fileFont}>Core</span>
          <span className={styles.fileNumber}>Files {coreCount}</span>
        </div>
      ) : null}
      {props.projectRole !== 'collaborator' ? (
        <div className={styles.shortcut} onClick={() => goToPage('Collection')}>
          <span className={styles.iconColumn}>
            <PaperClipOutlined
              className={styles.icon}
              style={{ color: '$primary-color-5' }}
            />
          </span>
          <span className={styles.fileFont}>
            <span className={styles['collections-num']}>
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
