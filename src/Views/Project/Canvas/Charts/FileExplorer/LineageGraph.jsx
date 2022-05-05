import React, { useEffect, useState } from 'react';
import { Spin, Button } from 'antd';
import ReactDOM from 'react-dom';
import G6 from '@antv/g6';
import moment from 'moment';
import { PORTAL_PREFIX } from '../../../../../config';
import _ from 'lodash';
const { detect } = require('detect-browser');

const browser = detect();
const toolBarNotSupported =
  browser?.name === 'safari' || browser?.name === 'firefox';
/**
 * format the string
 * @param {string} str The origin string
 * @param {number} maxWidth max width
 * @param {number} fontSize font size
 * @return {string} the processed result
 */
const fittingString = (str, maxWidth, fontSize) => {
  const ellipsis = '...';
  const ellipsisLength = G6.Util.getTextSize(ellipsis, fontSize)[0];
  let currentWidth = 0;
  let res = str;
  const pattern = new RegExp('[\u4E00-\u9FA5]+'); // distinguish the Chinese charactors and letters
  str.split('').forEach((letter, i) => {
    if (currentWidth > maxWidth - ellipsisLength) return;
    if (pattern.test(letter)) {
      // Chinese charactors
      currentWidth += fontSize;
    } else {
      // get the width of single letter according to the fontSize
      currentWidth += G6.Util.getLetterWidth(letter, fontSize);
    }
    if (currentWidth > maxWidth - ellipsisLength) {
      res = `${str.substr(0, i)}${ellipsis}`;
    }
  });
  return res;
};
const fileTypeMap = (labels) => {
  if (hasCore(labels) && labels.indexOf('TrashFile') !== -1) {
    return 'Core Trash File';
  }
  if (
    labels.indexOf('Greenroom') !== -1 &&
    labels.indexOf('TrashFile') !== -1
  ) {
    return 'Green Room Trash File';
  }

  if (labels.indexOf('Greenroom') !== -1 && labels.indexOf('File') !== -1) {
    return 'Green Room File';
  }
  if (hasCore(labels) && labels.indexOf('File') !== -1) {
    return 'Core File';
  }
};
const hasCore = (labels) => {
  for (const label of labels) {
    if (_.lowerCase(label).includes('core')) return true;
  }
  return false;
};
const isContainSpace = (text) => {
  if (text.includes(' ')) return true;

  return false;
};

export default function LineageGraph({
  record,
  width,
  graphConfig,
  showFitView,
  showModalButton,
  setLineageModalVisible,
}) {
  const ref = React.useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const lineage = record?.lineage;
    if (lineage) {
      lineage.nodeLabel = record?.nodeLabel;
    }
    const guidEntityMap = lineage && lineage?.guidEntityMap;
    const relations = lineage && lineage?.relations;
    const nodeKeys = guidEntityMap ? Object.keys(guidEntityMap) : [];
    let graph = null;
    const nodes = [];
    const nodeList = [];
    const deleteNodeKeys = [];
    for (let i = 0; i < nodeKeys.length; i++) {
      const key = nodeKeys[i];
      const nodeInfo = guidEntityMap[key];
      if (nodeInfo.status === 'DELETED') {
        deleteNodeKeys.push(key);
        continue;
      }
      const attributes = nodeInfo.attributes;
      let fileManifests = nodeInfo.fileManifests || [];
      let label = null;

      // hide time for file node
      let createdTime = null;

      let textArr;

      let location;
      let fileType;
      let isCurrentNode = attributes.displayPath === record.displayPath;
      let pipelineImg = PORTAL_PREFIX + '/operation.svg';
      const isPipeline = nodeInfo.typeName === 'Process';
      if (nodeInfo.typeName === 'Process') {
        textArr = nodeInfo.attributes?.name.split(':');
        label = textArr && textArr.length > 1 && textArr[1];

        if (label === 'dicom_edit') pipelineImg = PORTAL_PREFIX + '/path.svg';
        if (label === 'data_transfer')
          pipelineImg = PORTAL_PREFIX + '/copy2.svg';
        if (label === 'data_delete')
          pipelineImg = PORTAL_PREFIX + '/delete2.svg';

        let time = null;

        time = textArr[2];
        createdTime = moment(time * 1000).format('YYYY-MM-DD HH:mm:ss');
        location = null;
        fileType = 'Pipeline';
      } else {
        textArr = nodeInfo.attributes?.displayPath?.split('/');
        label = textArr && textArr.length > 1 && textArr[textArr.length - 1];
        if (textArr && nodeInfo.attributes?.displayPath) {
          const displayPathArr = nodeInfo.attributes?.displayPath?.split('/');
          location = displayPathArr
            .slice(0, displayPathArr.length - 1)
            .join('/');
        }
        fileType =
          nodeInfo.attributes?.zone && fileTypeMap(nodeInfo.attributes?.zone);
        if (location && location.length > 40)
          location = location.slice(0, 25) + '.......';
      }
      if (fileManifests.length) {
        fileManifests = fileManifests.map((menifest) => {
          return `<li><b>(${menifest.manifest_name})</b> ${menifest.name}: ${
            !isContainSpace(menifest.value)
              ? fittingString(menifest.value, 150, 12)
              : menifest.value
          }</li>`;
        });
        fileManifests = fileManifests.join(' ');
      }

      nodeList.push({
        id: nodeInfo.guid,
        label,
        size: 40,
        icon: {
          show: true,
          img: PORTAL_PREFIX + '/file.svg',
          width: 12,
        },
        style: {
          fill: '#E6F7FF',
          stroke: '#E6F7FF',
        },
        y: 40,
        isPipeline,
        createdTime,
        typeName: fileType,
        location,
        isCurrentNode,
        pipelineImg,
        fileManifests,
      });
    }
    // eslint-disable-next-line

    for (const node of nodeList) {
      nodes.push({
        ...node,
        x: 50 + nodes.length * 200,
      });
    }

    const edges = [];
    if (relations) {
      for (const item of relations) {
        if (
          deleteNodeKeys.indexOf(item.fromEntityId) !== -1 ||
          deleteNodeKeys.indexOf(item.toEntityId) !== -1
        ) {
          continue;
        }
        edges.push({
          source: item.fromEntityId,
          target: item.toEntityId,
          style: {
            lineWidth: '2',
            endArrow: {
              path: G6.Arrow.triangle(8, 8, 0),
              fill: '#D9D9D9',
            },
            stroke: '#D9D9D9',
          },
        });
      }
    }
    const data = {
      nodes,
      edges,
    };

    const tooltip = new G6.Tooltip({
      offsetX: 0,
      offsetY: 0,
      itemTypes: ['node'],
      getContent: (e) => {
        const outDiv = document.createElement('div');
        outDiv.style.width = '220px';
        //outDiv.style.padding = '0px 0px 20px 0px';
        outDiv.innerHTML = `
				<h4>${e.item.getModel().isPipeline ? 'Pipeline Info' : 'Node Info'}</h4>
				<ul style="padding-left:20px">
          <li>Type: ${e.item.getModel().typeName}</li>
          <li>Name: ${fittingString(e.item.getModel().label, 200, 12)}</li>
          ${
            e.item.getModel().location
              ? `<li>Location: ${e.item.getModel().location} </li>`
              : `<div></div>`
          }
          
          ${
            e.item.getModel().fileManifests.length
              ? `
            <li> File Attributes:
              <ul>
               ${e.item.getModel().fileManifests}
              </ul>
            </li>
          `
              : `<div></div>`
          }
          ${
            e.item.getModel().createdTime
              ? `<li>Process Time: ${e.item.getModel().createdTime}</li>`
              : `<div></div>`
          }
				</ul>
				`;
        return outDiv;
      },
    });

    const toolbar = new G6.ToolBar({
      className: 'g6-toolbar-ul',
      getContent: () => {
        return `
      <ul>
        <li code='center'>Fit view</li>
      </ul>
    `;
      },
      handleClick: (code, graph) => {
        if (code === 'center') {
           if (data.nodes.length > 4) {
             graph.fitView(10);
           } else {
             graph.fitCenter();
           }
        }
      },
    });

    data.nodes.forEach((node, i) => {
      if (node.isPipeline) {
        node.icon.img = node.pipelineImg;
        node.style.fill = '#D9D9D9';
        node.style.stroke = '#D9D9D9';
        node.size = 30;
      }
      if (node.isCurrentNode) {
        node.style.fill = '#43B7EA';
        node.style.stroke = '#43B7EA';
        node.icon.img = PORTAL_PREFIX + '/file-white.svg';
      }
    });

    if (nodes.length > 0) {
      setIsLoading(false);
      let config = {
        container: ReactDOM.findDOMNode(ref.current),
        width: width ? width : 280,
        height: 500,
        plugins:
          toolBarNotSupported || !showFitView ? [tooltip] : [toolbar, tooltip],
        fitCenter: true,
        defaultNode: {
          labelCfg: {
            position: 'bottom',
            style: {
              opacity: 0,
            },
          },
        },
        defaultEdge: {
          labelCfg: {
            autoRotate: true,
            refY: 20,
          },
        },
        layout: {
          type: 'dagre', // Layout type
          rankdir: 'TB', // 'TB' / 'BT' / 'LR' / 'RL' => T: top; B: bottom; L: left; R: right
          ranksep: 18,
        },
      };
      config = graphConfig ? { ...config, ...graphConfig } : config;

      graph = new G6.Graph(config);
      graph.on('afterrender', () => {
        // showFitView is true when graph is in a modal
        if (data.nodes.length > 4) {
          graph.fitView(10);
        } else {
          graph.fitCenter();
        }
      });
      graph.data(data);
      graph.render();
    }

    //Destroy the graph before unmount
    return () => {
      graph && graph.destroy();
    };
  }, [record]);

  const showModal = (event) => {
    setLineageModalVisible(true);
    event.stopPropagation();
  };

  return (
    <>
      {isLoading && (
        <div
          style={{ height: '500px', textAlign: 'center', paddingTop: '125px' }}
        >
          <Spin />
        </div>
      )}
      {!isLoading && showModalButton && (
        <Button
          onClick={showModal}
          style={{ padding: '4px 10px', height: 'auto', borderRadius: '8px' }}
        >
          See More
        </Button>
      )}
      <div
        style={!showFitView ? { display: 'flex', justifyContent: 'center' } : null}
        ref={ref}
      ></div>
    </>
  );
}
