import React from 'react';
import styles from '../index.module.scss'

function TabNavigation ({ children }) {
  return (
    <ul className={styles['tab-switcher__navigation']}>
      { children }
    </ul>
  )
}

export default TabNavigation;
