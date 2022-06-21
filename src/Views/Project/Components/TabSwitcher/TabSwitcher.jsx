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
