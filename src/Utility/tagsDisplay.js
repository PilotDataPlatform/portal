import React from 'react';
import { Tag } from 'antd';
import variables from '../Themes/base.scss';
const getTags = (tags) => {
  if (tags.length <= 3) {
    return tags.map((tag, ind) => <Tag key={'tag-' + ind}>{tag}</Tag>);
  }

  const hideTags = [
    ...tags.slice(0, 3).map((tag, ind) => <Tag key={'tag-' + ind}>{tag}</Tag>),
    <Tag
      key="tag-create"
      style={{
        color: variables.primaryColorLight1,
        backgroundColor: '#E6F5FF',
      }}
    >{`+${tags.length - 3}`}</Tag>,
  ];
  return hideTags;
};

export { getTags };
