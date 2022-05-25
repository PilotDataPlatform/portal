import React, { useState, useEffect } from 'react';
import { Heatmap, G2 } from '@ant-design/plots';
import HeatMapLegend from './HeatMapLegend';
import styles from './index.module.scss';

function HeatMap({ data, color, showLegend = true}) {
  G2.registerShape('polygon', 'boundary-polygon', {
    draw(cfg, container) {
      const group = container.addGroup();
      const attrs = {
        stroke: '#fff',
        lineWidth: 6,
        fill: cfg.color,
        path: [],
      };
      const points = cfg.points;
      const path = [
        ['M', points[0].x, points[0].y],
        ['L', points[1].x, points[1].y],
        ['L', points[2].x, points[2].y],
        ['L', points[3].x, points[3].y],
        ['Z'],
      ];

      attrs.path = this.parsePath(path);
      group.addShape('path', {
        attrs,
      });

      return group;
    },
  });

  const config = {
    data,
    height: 300,
    autoFit: true,
    xField: 'week',
    yField: 'day',
    colorField: 'commits',
    color,
    shape: 'boundary-polygon',
    meta: {
      day: {
        type: 'cat',
        values: [
          '星期日',
          '星期一',
          '星期二',
          '星期三',
          '星期四',
          '星期五',
          '星期六',
        ],
      },
      week: {
        type: 'cat',
      },
      commits: {
        sync: true,
      },
      date: {
        type: 'cat',
      },
    },
    yAxis: {
      grid: null,
    },
    tooltip: false,
    xAxis: {
      position: 'top',
      tickLine: null,
      line: null,
      label: {
        offsetY: -8,
        style: {
          fontSize: 12,
          fill: '#666',
          textBaseline: 'top',
        },
        formatter: (val) => {
          if (val === '2') {
            return 'MAY';
          } else if (val === '6') {
            return 'JUN';
          } else if (val === '10') {
            return 'JUL';
          } else if (val === '15') {
            return 'AUG';
          } else if (val === '19') {
            return 'SEP';
          } else if (val === '24') {
            return 'OCT';
          }

          return '';
        },
      },
    },
  };

  return (
    <div className={styles['heatmap-container']}>
      { showLegend && <HeatMapLegend colors={color}/> }
      <Heatmap {...config} />
    </div>
  );
}

export default React.memo(HeatMap);
