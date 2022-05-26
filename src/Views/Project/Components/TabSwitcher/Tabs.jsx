import React, { useState, useEffect } from 'react';
import { useCurrentProject } from '../../../../Utility';

import styles from '../index.module.scss';

function Tabs({ handleClick, tab, currentTab, activeStyles }) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (currentTab) {
      if (currentTab === tab) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    }
  }, [currentTab]);

  return (
    <li
      onClick={handleClick}
      className={`${styles['tab-switcher__tabs']}`}
      style={isActive ? activeStyles : null}
    >
      {tab}
    </li>
  );
}

export default Tabs;
