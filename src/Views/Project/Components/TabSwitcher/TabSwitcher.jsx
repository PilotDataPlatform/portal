import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { TabNavigation, Tabs } from './index';

function TabSwitcher({ contentMap, activeTabStyles }) {
  const [currentTab, setCurrentTab] = useState(null);

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
              tab={tab}
              currentTab={currentTab}
              activeStyles={activeTabStyles}
            />
          ))}
      </TabNavigation>
      {contentMap[currentTab]}
    </div>
  );
}

export default TabSwitcher;
