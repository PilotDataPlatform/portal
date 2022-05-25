import React, { useEffect, useState } from 'react';
import { TabNavigation, Tabs } from './index';

function TabSwitcher({ contentMap }) {
  const [currentTab, setCurrentTab] = useState(null);

  useEffect(() => {
    if (contentMap) {
      setCurrentTab(Object.keys(contentMap)[0]);
    }
  }, [contentMap]);

  function handleClick(e) {
    const key = e.target.innerText.toLowerCase();
    setCurrentTab(key);
  }

  return (
    <div>
      <TabNavigation>
        {contentMap &&
          Object.keys(contentMap).map((tab) => (
            <Tabs handleClick={handleClick} tab={tab} currentTab={currentTab} />
          ))}
      </TabNavigation>
      {contentMap[currentTab]}
    </div>
  );
}

export default TabSwitcher;
