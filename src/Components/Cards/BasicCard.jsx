import React, { Component } from 'react';
import { Card, Button, Row, Col, Tooltip } from 'antd';
import styles from './index.module.scss';
import {
  FullscreenOutlined,
  DownloadOutlined,
  DragOutlined,
  SearchOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';

export default class BasicCard extends Component {
  state = {
    export: false,
  };

  onExportClick = () => {
    this.setState({ export: !this.state.export });
  };

  onExpandClick = () => {
    const { handleExpand, content, title } = this.props;

    let modalContent = content('l', this.state.export, this.onExportClick);

    handleExpand(modalContent, title, '95vw');
  };

  render() {
    const { exportable, expandable, content, title, defaultSize } = this.props;
    const getTooltip = (text = 'Tooltip goes here') => (
      <Tooltip title={text}>
        <QuestionCircleOutlined
          style={{
            marginLeft: '0.375rem',
            color: '#818181',
          }}
        />
      </Tooltip>
    );
    const cardTitle = (
      <>
        <span className={styles.cardTitle}>{title}</span>
        {getTooltip()}
      </>
    );
    const fileStreamTitle = (
      <div>
        <span className={styles.fileStreamTitle}>{title}</span>
        {getTooltip()}
        <span style={{ margin: '0 26px', color: '#595959' }}>|</span>
        <div
          style={{ display: 'inline-block', cursor: 'pointer' }}
          onClick={(e) => {
            if (content.props && content.props.onExpand) {
              content.props.onExpand();
            }
          }}
        >
          <SearchOutlined style={{ color: '#595959' }} />
          {window.innerWidth>1366?<span style={{ marginLeft: '10px', color: '#595959' }}>
            Advanced Search
          </span>:null}
        </div>
      </div>
    );
    return (
      <Card
        className={styles.basic}
        title={
          title === 'Recent File Stream'
            ? fileStreamTitle
            : cardTitle
        }
        size="small"
        bordered="false"
        extra={
          <div>
            {expandable && (
              <Button type="link" onClick={this.onExpandClick}>
                <FullscreenOutlined style={{ position: 'static' }} />
              </Button>
            )}
            {exportable && (
              <Button type="link" onClick={this.onExportClick}>
                <DownloadOutlined style={{ position: 'static' }} />
              </Button>
            )}
            <Button
              type="link"
              className="dragarea"
              style={{ paddingRight: '0', paddingLeft: '0' }}
            >
              <DragOutlined style={{ position: 'static', fontSize: '15px' }} />
            </Button>
          </div>
        }
      >
        {exportable
          ? content(defaultSize, this.state.export, this.onExportClick)
          : expandable
          ? typeof content === 'function' && content(defaultSize)
          : content}
      </Card>
    );
  }
}
