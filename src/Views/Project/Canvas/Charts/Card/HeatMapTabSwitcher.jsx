import React, { useMemo } from 'react';

import { TabSwitcher } from '../../../Components/TabSwitcher';
import HeatMap from './HeatMap';
import { useTheme } from '../../../../../Themes/theme';

const DOWNLOAD = 'downloads';
const UPLOAD = 'upload';
const DELETE = 'deletion';
const COPY = 'copy';

function HeatMapTabSwitcher({
  downloadData,
  uploadData,
  deleteData,
  copyData,
}) {
  const { charts } = useTheme();
  const activityColorMap = {
    [DOWNLOAD]: charts.heatgraph.range.green,
    [UPLOAD]: charts.heatgraph.range.blue,
    [DELETE]: charts.heatgraph.range.red,
    [COPY]: charts.heatgraph.range.orange,
  };
  const tabColorMap = {
    [DOWNLOAD]: activityColorMap[DOWNLOAD][2],
    [UPLOAD]: activityColorMap[UPLOAD][1],
    [DELETE]: activityColorMap[DELETE][1],
    [COPY]: activityColorMap[COPY][1],
  };

  const heatMapGraphs = useMemo(
    () => ({
      [DOWNLOAD]: (
        <HeatMap data={downloadData} color={activityColorMap[DOWNLOAD]} />
      ),
      [UPLOAD]: <HeatMap data={uploadData} color={activityColorMap[UPLOAD]} />,
      [DELETE]: <HeatMap data={deleteData} color={activityColorMap[DELETE]} />,
      [COPY]: <HeatMap data={copyData} color={activityColorMap[COPY]} />,
    }),
    [downloadData, uploadData, deleteData, copyData],
  ); 

  return <TabSwitcher contentMap={heatMapGraphs} colorMap={tabColorMap} />;
}

export default HeatMapTabSwitcher;
