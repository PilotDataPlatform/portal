import React, { useState, useEffect } from 'react';

import styles from '../index.module.scss';

function Tabs({ handleClick, tabName, currentTab, activeColor }) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (currentTab) {
      if (currentTab === tabName) {
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
      style={isActive ? { backgroundColor: activeColor } : null}
    >
      {tabName}
    </li>
  );
}

export default Tabs;
