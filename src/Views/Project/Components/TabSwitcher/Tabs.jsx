import React, { useState, useEffect } from 'react';
import styles from '../index.module.scss';

function Tabs({ handleClick, tab, currentTab }) {
  const [isActive, setIsActive] = useState(false);

  const activeClass = isActive ? styles['tab-switcher__tabs--active'] : '';

  useEffect(() => {
    if (currentTab) {
      if (currentTab === tab) {
        return setIsActive(true);
      }
      setIsActive(false);
    }
  }, [currentTab]);

  return (
    <li
      onClick={handleClick}
      className={`${styles['tab-switcher__tabs']} ${activeClass}`}
    >
      {tab}
    </li>
  );
}

export default Tabs;
