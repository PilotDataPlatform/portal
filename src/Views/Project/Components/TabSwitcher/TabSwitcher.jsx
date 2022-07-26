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
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { TabNavigation, Tabs } from './index';

function TabSwitcher({ contentMap, colorMap }) {
  const [currentTab, setCurrentTab] = useState(null);
  const activeColor = colorMap[currentTab];

  useEffect(() => {
    if (contentMap) {
      setCurrentTab(Object.keys(contentMap)[0]);
    }
  }, []);

  function handleClick(e) {
    const key = e.target.innerText.toLowerCase();
    setCurrentTab(key);
  }

  return (
    <div>
      <TabNavigation>
        {contentMap &&
          Object.keys(contentMap).map((tab) => (
            <Tabs
              key={uuidv4()}
              handleClick={handleClick}
              tabName={tab}
              currentTab={currentTab}
              activeColor={activeColor}
            />
          ))}
      </TabNavigation>
      {contentMap[currentTab]}
    </div>
  );
}

export default TabSwitcher;
