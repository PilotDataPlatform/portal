/*
Copyright (C) 2022 Indoc Research

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
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
