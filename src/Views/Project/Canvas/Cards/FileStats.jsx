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
      //need new api to get
      // projectFileCountTotal(currentProject.globalEntityId, {
      //   start_date: moment().startOf('day').unix(),
      //   end_date: moment().endOf('day').unix(),
      // }).then((res) => {
      //   const statistics = res?.data?.result;
      //   console.log(res);
      //   if (res.status === 200 && statistics) {
      //     console.log(statistics);
      //     setGreenRoomCount(statistics.greenroom);
      //     setCoreCount(statistics.core);
      //   }
      // });
      listAllVirtualFolder(currentProject.code, props.username).then((res) => {
        setCollections(res.data.result);
      });
    }
  }, [currentProject, props.successNum]);

  const goToPage = (page) => {
    // console.log(page);
    if (page === 'collection') {
      if (collections.length > 0) {
        dispatch(
          canvasPageActions.setCanvasPage({
            page: page,
            name: collections.length > 0 ? collections[0].name : '',
            id: collections.length > 0 ? collections[0].id : '',
          }),
        );
        history.push(`/project/${currentProject.code}/data`);
      }
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
    <div style={{ flexDirection: 'column', display: 'flex', minWidth: 130 }}>
      <div
        className={styles['shortcut--greenhome']}
        onClick={() => goToPage('greenroom-home')}
      >
        <span className={styles['icon-column']}>
          <HomeOutlined className={styles['icon--greenhome']} />
        </span>
        <span className={styles['file-font']}>Green Room</span>
        <span className={styles['file-number ']}>Files {greenRoomCount}</span>
      </div>
      {props.projectRole !== 'contributor' && coreCount !== null ? (
        <div
          className={styles['shortcut--core']}
          onClick={() => goToPage('core-home')}
        >
          <span className={styles['icon-column']}>
            <CloudServerOutlined className={styles['icon--core']} />
          </span>
          <span className={styles['file-font']}>Core</span>
          <span className={styles['file-number ']}>Files {coreCount}</span>
        </div>
      ) : null}
      {props.projectRole !== 'contributor' ? (
        <div
          className={styles['shortcut--collections']}
          onClick={() => goToPage('collection')}
        >
          <span className={styles['icon-column']}>
            <PaperClipOutlined
              className={styles['icon--collection']}
              style={{
                cursor: collections.length === 0 ? '' : 'pointer',
                opacity: collections.length === 0 ? 0.5 : 1,
              }}
            />
          </span>
          <span
            className={styles['file-font']}
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
          <span style={{ color: 'transparent' }}>File</span>
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
