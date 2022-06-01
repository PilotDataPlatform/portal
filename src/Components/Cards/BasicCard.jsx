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
    const {
      exportable,
      expandable,
      content,
      title,
      defaultSize,
      draggable,
      style,
    } = this.props;
    const getTooltip = (text = 'Tooltip goes here') => (
      <Tooltip title={text}>
        <QuestionCircleOutlined
          style={{
            marginLeft: '0.7rem',
            color: '#818181',
          }}
        />
      </Tooltip>
    );
    const cardTitle = (
      <>
        <span
          className={
            title == 'Go To' ? styles['go-to_title'] : styles['card-title']
          }
        >
          {title}
        </span>
        {getTooltip()}
      </>
    );
    const fileStreamTitle = (
      <div>
        <span className={styles.fileStreamTitle}>{title}</span>
        {getTooltip()}
        <span
          style={{
            margin: '0 26px',
            color: '#707070',
            fontWeight: '200',
            fontSize: '22px',
          }}
        >
          |
        </span>
        <div
          style={{ display: 'inline-block', cursor: 'pointer' }}
          onClick={(e) => {
            if (content.props && content.props.onExpand) {
              content.props.onExpand();
            }
          }}
        >
          <SearchOutlined style={{ color: '#595959' }} />

          <span className={styles['file-stream-subtitle']}>
            Advanced Search
          </span>
        </div>
      </div>
    );
    return (
      <Card
        className={styles.basic}
        style={style && { ...style }}
        title={title === 'Recent File Stream' ? fileStreamTitle : cardTitle}
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
            {draggable !== false ? (
              <Button
                type="link"
                className="dragarea"
                style={{ paddingRight: '0', paddingLeft: '0' }}
              >
                <DragOutlined
                  style={{ position: 'static', fontSize: '15px' }}
                />
              </Button>
            ) : null}
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
