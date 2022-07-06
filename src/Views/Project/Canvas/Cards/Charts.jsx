import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { message, Spin } from 'antd';
import {
  FileTextOutlined,
  HddOutlined,
  CloudUploadOutlined,
  DownloadOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import HeatMapTabSwitcher from '../Charts/Card/HeatMapTabSwitcher';
import { StackedAreaPlot } from '../Charts/Card';
import { useTheme } from '../../../../Themes/theme';
import styles from './index.module.scss';
import {
  convertToFileSizeInUnit,
  setLabelsDate,
  getCurrentYear,
  getFileSize,
} from '../../../../Utility';
import {
  getProjectStatistics,
  getProjectFileSize,
  getProjectActivity,
  getUserOnProjectAPI,
} from '../../../../APIs';

const HEATMAP_DOWNLOAD_DATA = [
  {
    commits: 1,
    day: 1,
    week: '0',
  },
  {
    commits: 1,
    day: 2,
    week: '0',
  },
  {
    commits: 1,
    day: 3,
    week: '0',
  },
  {
    commits: 1,
    day: 4,
    week: '0',
  },
  {
    commits: 1,
    day: 5,
    week: '0',
  },
  {
    commits: 1,
    day: 6,
    week: '0',
  },
  {
    commits: 1,
    day: 0,
    week: '1',
  },
  {
    commits: 1,
    day: 1,
    week: '1',
  },
  {
    commits: 1,
    day: 2,
    week: '1',
  },
  {
    commits: 1,
    day: 3,
    week: '1',
  },
  {
    commits: 1,
    day: 4,
    week: '1',
  },
  {
    commits: 1,
    day: 5,
    week: '1',
  },
  {
    commits: 1,
    day: 6,
    week: '1',
  },
  {
    commits: 1,
    day: 0,
    week: '2',
  },
  {
    commits: 1,
    day: 1,
    week: '2',
  },
  {
    commits: 1,
    day: 2,
    week: '2',
  },
  {
    commits: 1,
    day: 3,
    week: '2',
  },
  {
    commits: 1,
    day: 4,
    week: '2',
  },
  {
    commits: 1,
    day: 5,
    week: '2',
  },
  {
    commits: 1,
    day: 6,
    week: '2',
  },
  {
    commits: 1,
    day: 0,
    week: '3',
  },
  {
    commits: 1,
    day: 1,
    week: '3',
  },
  {
    commits: 1,
    day: 2,
    week: '3',
  },
  {
    commits: 1,
    day: 3,
    week: '3',
  },
  {
    commits: 1,
    day: 4,
    week: '3',
  },
  {
    commits: 1,
    day: 5,
    week: '3',
  },
  {
    commits: 1,
    day: 6,
    week: '3',
  },
  {
    commits: 1,
    day: 0,
    week: '4',
  },
  {
    commits: 1,
    day: 1,
    week: '4',
  },
  {
    commits: 1,
    day: 2,
    week: '4',
  },
  {
    commits: 1,
    day: 3,
    week: '4',
  },
  {
    commits: 1,
    day: 4,
    week: '4',
  },
  {
    commits: 1,
    day: 5,
    week: '4',
  },
  {
    commits: 1,
    day: 6,
    week: '4',
  },
  {
    commits: 1,
    day: 0,
    week: '5',
  },
  {
    commits: 1,
    day: 1,
    week: '5',
  },
  {
    commits: 1,
    day: 2,
    week: '5',
  },
  {
    commits: 1,
    day: 3,
    week: '5',
  },
  {
    commits: 1,
    day: 4,
    week: '5',
  },
  {
    commits: 1,
    day: 5,
    week: '5',
  },
  {
    commits: 1,
    day: 6,
    week: '5',
  },
  {
    commits: 1,
    day: 0,
    week: '6',
  },
  {
    commits: 1,
    day: 1,
    week: '6',
  },
  {
    commits: 1,
    day: 2,
    week: '6',
  },
  {
    commits: 1,
    day: 3,
    week: '6',
  },
  {
    commits: 1,
    day: 4,
    week: '6',
  },
  {
    commits: 1,
    day: 5,
    week: '6',
  },
  {
    commits: 1,
    day: 6,
    week: '6',
  },
  {
    commits: 1,
    day: 0,
    week: '7',
  },
  {
    commits: 1,
    day: 1,
    week: '7',
  },
  {
    commits: 1,
    day: 2,
    week: '7',
  },
  {
    commits: 2,
    day: 3,
    week: '7',
  },
  {
    commits: 6,
    day: 4,
    week: '7',
  },
  {
    commits: 9,
    day: 5,
    week: '7',
  },
  {
    commits: 3,
    day: 6,
    week: '7',
  },
  {
    commits: 3,
    day: 0,
    week: '8',
  },
  {
    commits: 1,
    day: 1,
    week: '8',
  },
  {
    commits: 7,
    day: 2,
    week: '8',
  },
  {
    commits: 7,
    day: 3,
    week: '8',
  },
  {
    commits: 12,
    day: 4,
    week: '8',
  },
  {
    commits: 9,
    day: 5,
    week: '8',
  },
  {
    commits: 4,
    day: 6,
    week: '8',
  },
  {
    commits: 1,
    day: 0,
    week: '9',
  },
  {
    commits: 2,
    day: 1,
    week: '9',
  },
  {
    commits: 7,
    day: 2,
    week: '9',
  },
  {
    commits: 6,
    day: 3,
    week: '9',
  },
  {
    commits: 1,
    day: 4,
    week: '9',
  },
  {
    commits: 6,
    day: 5,
    week: '9',
  },
  {
    commits: 1,
    day: 6,
    week: '9',
  },
  {
    commits: 1,
    day: 0,
    week: '10',
  },
  {
    commits: 1,
    day: 1,
    week: '10',
  },
  {
    commits: 8,
    day: 2,
    week: '10',
  },
  {
    commits: 5,
    day: 3,
    week: '10',
  },
  {
    commits: 7,
    day: 4,
    week: '10',
  },
  {
    commits: 4,
    day: 5,
    week: '10',
  },
  {
    commits: 4,
    day: 6,
    week: '10',
  },
  {
    commits: 2,
    day: 0,
    week: '11',
  },
  {
    commits: 1,
    day: 1,
    week: '11',
  },
  {
    commits: 10,
    day: 2,
    week: '11',
  },
  {
    commits: 14,
    day: 3,
    week: '11',
  },
  {
    commits: 6,
    day: 4,
    week: '11',
  },
  {
    commits: 1,
    day: 5,
    week: '11',
  },
  {
    commits: 6,
    day: 6,
    week: '11',
  },
  {
    commits: 1,
    day: 0,
    week: '12',
  },
  {
    commits: 1,
    day: 1,
    week: '12',
  },
  {
    commits: 1,
    day: 2,
    week: '12',
  },
  {
    commits: 1,
    day: 3,
    week: '12',
  },
  {
    commits: 9,
    day: 4,
    week: '12',
  },
  {
    commits: 1,
    day: 5,
    week: '12',
  },
  {
    commits: 15,
    day: 6,
    week: '12',
  },
  {
    commits: 1,
    day: 0,
    week: '13',
  },
  {
    commits: 1,
    day: 1,
    week: '13',
  },
  {
    commits: 15,
    day: 2,
    week: '13',
  },
  {
    commits: 11,
    day: 3,
    week: '13',
  },
  {
    commits: 3,
    day: 4,
    week: '13',
  },
  {
    commits: 6,
    day: 5,
    week: '13',
  },
  {
    commits: 1,
    day: 6,
    week: '13',
  },
  {
    commits: 4,
    day: 0,
    week: '14',
  },
  {
    commits: 1,
    day: 1,
    week: '14',
  },
  {
    commits: 10,
    day: 2,
    week: '14',
  },
  {
    commits: 11,
    day: 3,
    week: '14',
  },
  {
    commits: 8,
    day: 4,
    week: '14',
  },
  {
    commits: 12,
    day: 5,
    week: '14',
  },
  {
    commits: 8,
    day: 6,
    week: '14',
  },
  {
    commits: 2,
    day: 0,
    week: '15',
  },
  {
    commits: 1,
    day: 1,
    week: '15',
  },
  {
    commits: 18,
    day: 2,
    week: '15',
  },
  {
    commits: 21,
    day: 3,
    week: '15',
  },
  {
    commits: 7,
    day: 4,
    week: '15',
  },
  {
    commits: 10,
    day: 5,
    week: '15',
  },
  {
    commits: 8,
    day: 6,
    week: '15',
  },
  {
    commits: 1,
    day: 0,
    week: '16',
  },
  {
    commits: 1,
    day: 1,
    week: '16',
  },
  {
    commits: 1,
    day: 2,
    week: '16',
  },
  {
    commits: 7,
    day: 3,
    week: '16',
  },
  {
    commits: 11,
    day: 4,
    week: '16',
  },
  {
    commits: 3,
    day: 5,
    week: '16',
  },
  {
    commits: 3,
    day: 6,
    week: '16',
  },
  {
    commits: 1,
    day: 0,
    week: '17',
  },
  {
    commits: 2,
    day: 1,
    week: '17',
  },
  {
    commits: 7,
    day: 2,
    week: '17',
  },
  {
    commits: 20,
    day: 3,
    week: '17',
  },
  {
    commits: 15,
    day: 4,
    week: '17',
  },
  {
    commits: 1,
    day: 5,
    week: '17',
  },
  {
    commits: 4,
    day: 6,
    week: '17',
  },
  {
    commits: 1,
    day: 0,
    week: '18',
  },
  {
    commits: 1,
    day: 1,
    week: '18',
  },
  {
    commits: 8,
    day: 2,
    week: '18',
  },
  {
    commits: 6,
    day: 3,
    week: '18',
  },
  {
    commits: 5,
    day: 4,
    week: '18',
  },
  {
    commits: 1,
    day: 5,
    week: '18',
  },
  {
    commits: 25,
    day: 6,
    week: '18',
  },
  {
    commits: 1,
    day: 0,
    week: '19',
  },
  {
    commits: 1,
    day: 1,
    week: '19',
  },
  {
    commits: 1,
    day: 2,
    week: '19',
  },
  {
    commits: 9,
    day: 3,
    week: '19',
  },
  {
    commits: 1,
    day: 4,
    week: '19',
  },
  {
    commits: 1,
    day: 5,
    week: '19',
  },
  {
    commits: 4,
    day: 6,
    week: '19',
  },
  {
    commits: 1,
    day: 0,
    week: '20',
  },
  {
    commits: 1,
    day: 1,
    week: '20',
  },
  {
    commits: 4,
    day: 2,
    week: '20',
  },
  {
    commits: 8,
    day: 3,
    week: '20',
  },
  {
    commits: 10,
    day: 4,
    week: '20',
  },
  {
    commits: 9,
    day: 5,
    week: '20',
  },
  {
    commits: 5,
    day: 6,
    week: '20',
  },
  {
    commits: 1,
    day: 0,
    week: '21',
  },
  {
    commits: 1,
    day: 1,
    week: '21',
  },
  {
    commits: 1,
    day: 2,
    week: '21',
  },
  {
    commits: 7,
    day: 3,
    week: '21',
  },
  {
    commits: 13,
    day: 4,
    week: '21',
  },
  {
    commits: 1,
    day: 5,
    week: '21',
  },
  {
    commits: 7,
    day: 6,
    week: '21',
  },
  {
    commits: 1,
    day: 0,
    week: '22',
  },
  {
    commits: 1,
    day: 1,
    week: '22',
  },
  {
    commits: 7,
    day: 2,
    week: '22',
  },
  {
    commits: 2,
    day: 3,
    week: '22',
  },
  {
    commits: 14,
    day: 4,
    week: '22',
  },
  {
    commits: 9,
    day: 5,
    week: '22',
  },
  {
    commits: 12,
    day: 6,
    week: '22',
  },
  {
    commits: 1,
    day: 0,
    week: '23',
  },
  {
    commits: 1,
    day: 1,
    week: '23',
  },
  {
    commits: 13,
    day: 2,
    week: '23',
  },
  {
    commits: 12,
    day: 3,
    week: '23',
  },
  {
    commits: 1,
    day: 4,
    week: '23',
  },
  {
    commits: 1,
    day: 5,
    week: '23',
  },
  {
    commits: 1,
    day: 6,
    week: '23',
  },
  {
    commits: 1,
    day: 0,
    week: '24',
  },
  {
    commits: 1,
    day: 1,
    week: '24',
  },
  {
    commits: 1,
    day: 2,
    week: '24',
  },
  {
    commits: 1,
    day: 3,
    week: '24',
  },
  {
    commits: 1,
    day: 4,
    week: '24',
  },
  {
    commits: 1,
    day: 5,
    week: '24',
  },
  {
    commits: 1,
    day: 6,
    week: '24',
  },
  {
    commits: 1,
    day: 0,
    week: '25',
  },
  {
    commits: 1,
    day: 1,
    week: '25',
  },
  {
    commits: 10,
    day: 2,
    week: '25',
  },
  {
    commits: 4,
    day: 3,
    week: '25',
  },
  {
    commits: 7,
    day: 4,
    week: '25',
  },
  {
    commits: 3,
    day: 5,
    week: '25',
  },
  {
    commits: 14,
    day: 6,
    week: '25',
  },
  {
    commits: 1,
    day: 0,
    week: '26',
  },
  {
    commits: 1,
    day: 1,
    week: '26',
  },
  {
    commits: 5,
    day: 2,
    week: '26',
  },
];

const HEATMAP_DELETE_DATA = [
  {
    commits: 0,
    day: 1,
    week: '0',
  },
  {
    commits: 0,
    day: 2,
    week: '0',
  },
  {
    commits: 0,
    day: 3,
    week: '0',
  },
  {
    commits: 0,
    day: 4,
    week: '0',
  },
  {
    commits: 0,
    day: 5,
    week: '0',
  },
  {
    commits: 0,
    day: 6,
    week: '0',
  },
  {
    commits: 1,
    day: 0,
    week: '1',
  },
  {
    commits: 1,
    day: 1,
    week: '1',
  },
  {
    commits: 1,
    day: 2,
    week: '1',
  },
  {
    commits: 1,
    day: 3,
    week: '1',
  },
  {
    commits: 1,
    day: 4,
    week: '1',
  },
  {
    commits: 1,
    day: 5,
    week: '1',
  },
  {
    commits: 1,
    day: 6,
    week: '1',
  },
  {
    commits: 1,
    day: 0,
    week: '2',
  },
  {
    commits: 1,
    day: 1,
    week: '2',
  },
  {
    commits: 1,
    day: 2,
    week: '2',
  },
  {
    commits: 1,
    day: 3,
    week: '2',
  },
  {
    commits: 1,
    day: 4,
    week: '2',
  },
  {
    commits: 1,
    day: 5,
    week: '2',
  },
  {
    commits: 1,
    day: 6,
    week: '2',
  },
  {
    commits: 1,
    day: 0,
    week: '3',
  },
  {
    commits: 1,
    day: 1,
    week: '3',
  },
  {
    commits: 1,
    day: 2,
    week: '3',
  },
  {
    commits: 1,
    day: 3,
    week: '3',
  },
  {
    commits: 1,
    day: 4,
    week: '3',
  },
  {
    commits: 1,
    day: 5,
    week: '3',
  },
  {
    commits: 1,
    day: 6,
    week: '3',
  },
  {
    commits: 1,
    day: 0,
    week: '4',
  },
  {
    commits: 1,
    day: 1,
    week: '4',
  },
  {
    commits: 1,
    day: 2,
    week: '4',
  },
  {
    commits: 1,
    day: 3,
    week: '4',
  },
  {
    commits: 1,
    day: 4,
    week: '4',
  },
  {
    commits: 1,
    day: 5,
    week: '4',
  },
  {
    commits: 1,
    day: 6,
    week: '4',
  },
  {
    commits: 1,
    day: 0,
    week: '5',
  },
  {
    commits: 1,
    day: 1,
    week: '5',
  },
  {
    commits: 1,
    day: 2,
    week: '5',
  },
  {
    commits: 1,
    day: 3,
    week: '5',
  },
  {
    commits: 1,
    day: 4,
    week: '5',
  },
  {
    commits: 1,
    day: 5,
    week: '5',
  },
  {
    commits: 1,
    day: 6,
    week: '5',
  },
  {
    commits: 1,
    day: 0,
    week: '6',
  },
  {
    commits: 1,
    day: 1,
    week: '6',
  },
  {
    commits: 1,
    day: 2,
    week: '6',
  },
  {
    commits: 1,
    day: 3,
    week: '6',
  },
  {
    commits: 1,
    day: 4,
    week: '6',
  },
  {
    commits: 1,
    day: 5,
    week: '6',
  },
  {
    commits: 1,
    day: 6,
    week: '6',
  },
  {
    commits: 1,
    day: 0,
    week: '7',
  },
  {
    commits: 1,
    day: 1,
    week: '7',
  },
  {
    commits: 1,
    day: 2,
    week: '7',
  },
  {
    commits: 2,
    day: 3,
    week: '7',
  },
  {
    commits: 6,
    day: 4,
    week: '7',
  },
  {
    commits: 9,
    day: 5,
    week: '7',
  },
  {
    commits: 3,
    day: 6,
    week: '7',
  },
  {
    commits: 3,
    day: 0,
    week: '8',
  },
  {
    commits: 1,
    day: 1,
    week: '8',
  },
  {
    commits: 7,
    day: 2,
    week: '8',
  },
  {
    commits: 7,
    day: 3,
    week: '8',
  },
  {
    commits: 12,
    day: 4,
    week: '8',
  },
  {
    commits: 9,
    day: 5,
    week: '8',
  },
  {
    commits: 4,
    day: 6,
    week: '8',
  },
  {
    commits: 1,
    day: 0,
    week: '9',
  },
  {
    commits: 2,
    day: 1,
    week: '9',
  },
  {
    commits: 7,
    day: 2,
    week: '9',
  },
  {
    commits: 6,
    day: 3,
    week: '9',
  },
  {
    commits: 1,
    day: 4,
    week: '9',
  },
  {
    commits: 6,
    day: 5,
    week: '9',
  },
  {
    commits: 1,
    day: 6,
    week: '9',
  },
  {
    commits: 1,
    day: 0,
    week: '10',
  },
  {
    commits: 1,
    day: 1,
    week: '10',
  },
  {
    commits: 8,
    day: 2,
    week: '10',
  },
  {
    commits: 5,
    day: 3,
    week: '10',
  },
  {
    commits: 7,
    day: 4,
    week: '10',
  },
  {
    commits: 4,
    day: 5,
    week: '10',
  },
  {
    commits: 4,
    day: 6,
    week: '10',
  },
  {
    commits: 2,
    day: 0,
    week: '11',
  },
  {
    commits: 1,
    day: 1,
    week: '11',
  },
  {
    commits: 10,
    day: 2,
    week: '11',
  },
  {
    commits: 14,
    day: 3,
    week: '11',
  },
  {
    commits: 6,
    day: 4,
    week: '11',
  },
  {
    commits: 1,
    day: 5,
    week: '11',
  },
  {
    commits: 6,
    day: 6,
    week: '11',
  },
  {
    commits: 1,
    day: 0,
    week: '12',
  },
  {
    commits: 1,
    day: 1,
    week: '12',
  },
  {
    commits: 1,
    day: 2,
    week: '12',
  },
  {
    commits: 1,
    day: 3,
    week: '12',
  },
  {
    commits: 9,
    day: 4,
    week: '12',
  },
  {
    commits: 1,
    day: 5,
    week: '12',
  },
  {
    commits: 15,
    day: 6,
    week: '12',
  },
  {
    commits: 1,
    day: 0,
    week: '13',
  },
  {
    commits: 1,
    day: 1,
    week: '13',
  },
  {
    commits: 15,
    day: 2,
    week: '13',
  },
  {
    commits: 11,
    day: 3,
    week: '13',
  },
  {
    commits: 3,
    day: 4,
    week: '13',
  },
  {
    commits: 6,
    day: 5,
    week: '13',
  },
  {
    commits: 1,
    day: 6,
    week: '13',
  },
  {
    commits: 4,
    day: 0,
    week: '14',
  },
  {
    commits: 1,
    day: 1,
    week: '14',
  },
  {
    commits: 10,
    day: 2,
    week: '14',
  },
  {
    commits: 11,
    day: 3,
    week: '14',
  },
  {
    commits: 8,
    day: 4,
    week: '14',
  },
  {
    commits: 12,
    day: 5,
    week: '14',
  },
  {
    commits: 8,
    day: 6,
    week: '14',
  },
  {
    commits: 2,
    day: 0,
    week: '15',
  },
  {
    commits: 1,
    day: 1,
    week: '15',
  },
  {
    commits: 18,
    day: 2,
    week: '15',
  },
  {
    commits: 21,
    day: 3,
    week: '15',
  },
  {
    commits: 7,
    day: 4,
    week: '15',
  },
  {
    commits: 10,
    day: 5,
    week: '15',
  },
  {
    commits: 8,
    day: 6,
    week: '15',
  },
  {
    commits: 1,
    day: 0,
    week: '16',
  },
  {
    commits: 1,
    day: 1,
    week: '16',
  },
  {
    commits: 1,
    day: 2,
    week: '16',
  },
  {
    commits: 7,
    day: 3,
    week: '16',
  },
  {
    commits: 11,
    day: 4,
    week: '16',
  },
  {
    commits: 3,
    day: 5,
    week: '16',
  },
  {
    commits: 3,
    day: 6,
    week: '16',
  },
  {
    commits: 1,
    day: 0,
    week: '17',
  },
  {
    commits: 2,
    day: 1,
    week: '17',
  },
  {
    commits: 7,
    day: 2,
    week: '17',
  },
  {
    commits: 20,
    day: 3,
    week: '17',
  },
  {
    commits: 15,
    day: 4,
    week: '17',
  },
  {
    commits: 1,
    day: 5,
    week: '17',
  },
  {
    commits: 4,
    day: 6,
    week: '17',
  },
  {
    commits: 1,
    day: 0,
    week: '18',
  },
  {
    commits: 1,
    day: 1,
    week: '18',
  },
  {
    commits: 8,
    day: 2,
    week: '18',
  },
  {
    commits: 6,
    day: 3,
    week: '18',
  },
  {
    commits: 5,
    day: 4,
    week: '18',
  },
  {
    commits: 1,
    day: 5,
    week: '18',
  },
  {
    commits: 25,
    day: 6,
    week: '18',
  },
  {
    commits: 1,
    day: 0,
    week: '19',
  },
  {
    commits: 1,
    day: 1,
    week: '19',
  },
  {
    commits: 1,
    day: 2,
    week: '19',
  },
  {
    commits: 9,
    day: 3,
    week: '19',
  },
  {
    commits: 1,
    day: 4,
    week: '19',
  },
  {
    commits: 1,
    day: 5,
    week: '19',
  },
  {
    commits: 4,
    day: 6,
    week: '19',
  },
  {
    commits: 1,
    day: 0,
    week: '20',
  },
  {
    commits: 1,
    day: 1,
    week: '20',
  },
  {
    commits: 4,
    day: 2,
    week: '20',
  },
  {
    commits: 8,
    day: 3,
    week: '20',
  },
  {
    commits: 10,
    day: 4,
    week: '20',
  },
  {
    commits: 9,
    day: 5,
    week: '20',
  },
  {
    commits: 5,
    day: 6,
    week: '20',
  },
  {
    commits: 1,
    day: 0,
    week: '21',
  },
  {
    commits: 1,
    day: 1,
    week: '21',
  },
  {
    commits: 1,
    day: 2,
    week: '21',
  },
  {
    commits: 7,
    day: 3,
    week: '21',
  },
  {
    commits: 13,
    day: 4,
    week: '21',
  },
  {
    commits: 1,
    day: 5,
    week: '21',
  },
  {
    commits: 7,
    day: 6,
    week: '21',
  },
  {
    commits: 1,
    day: 0,
    week: '22',
  },
  {
    commits: 1,
    day: 1,
    week: '22',
  },
  {
    commits: 7,
    day: 2,
    week: '22',
  },
  {
    commits: 2,
    day: 3,
    week: '22',
  },
  {
    commits: 14,
    day: 4,
    week: '22',
  },
  {
    commits: 9,
    day: 5,
    week: '22',
  },
  {
    commits: 12,
    day: 6,
    week: '22',
  },
  {
    commits: 1,
    day: 0,
    week: '23',
  },
  {
    commits: 1,
    day: 1,
    week: '23',
  },
  {
    commits: 13,
    day: 2,
    week: '23',
  },
  {
    commits: 12,
    day: 3,
    week: '23',
  },
  {
    commits: 1,
    day: 4,
    week: '23',
  },
  {
    commits: 1,
    day: 5,
    week: '23',
  },
  {
    commits: 1,
    day: 6,
    week: '23',
  },
  {
    commits: 1,
    day: 0,
    week: '24',
  },
  {
    commits: 1,
    day: 1,
    week: '24',
  },
  {
    commits: 1,
    day: 2,
    week: '24',
  },
  {
    commits: 1,
    day: 3,
    week: '24',
  },
  {
    commits: 1,
    day: 4,
    week: '24',
  },
  {
    commits: 1,
    day: 5,
    week: '24',
  },
  {
    commits: 1,
    day: 6,
    week: '24',
  },
  {
    commits: 1,
    day: 0,
    week: '25',
  },
  {
    commits: 1,
    day: 1,
    week: '25',
  },
  {
    commits: 10,
    day: 2,
    week: '25',
  },
  {
    commits: 20,
    day: 3,
    week: '25',
  },
  {
    commits: 27,
    day: 4,
    week: '25',
  },
  {
    commits: 23,
    day: 5,
    week: '25',
  },
  {
    commits: 34,
    day: 6,
    week: '25',
  },
  {
    commits: 21,
    day: 0,
    week: '26',
  },
  {
    commits: 21,
    day: 1,
    week: '26',
  },
  {
    commits: 25,
    day: 2,
    week: '26',
  },
];

const HEATMAP_UPLOAD_DATA = [
  {
    commits: 20,
    day: 1,
    week: '0',
  },
  {
    commits: 15,
    day: 2,
    week: '0',
  },
  {
    commits: 18,
    day: 3,
    week: '0',
  },
  {
    commits: 20,
    day: 4,
    week: '0',
  },
  {
    commits: 20,
    day: 5,
    week: '0',
  },
  {
    commits: 20,
    day: 6,
    week: '0',
  },
  {
    commits: 1,
    day: 0,
    week: '1',
  },
  {
    commits: 1,
    day: 1,
    week: '1',
  },
  {
    commits: 1,
    day: 2,
    week: '1',
  },
  {
    commits: 1,
    day: 3,
    week: '1',
  },
  {
    commits: 1,
    day: 4,
    week: '1',
  },
  {
    commits: 1,
    day: 5,
    week: '1',
  },
  {
    commits: 1,
    day: 6,
    week: '1',
  },
  {
    commits: 1,
    day: 0,
    week: '2',
  },
  {
    commits: 1,
    day: 1,
    week: '2',
  },
  {
    commits: 1,
    day: 2,
    week: '2',
  },
  {
    commits: 1,
    day: 3,
    week: '2',
  },
  {
    commits: 1,
    day: 4,
    week: '2',
  },
  {
    commits: 1,
    day: 5,
    week: '2',
  },
  {
    commits: 1,
    day: 6,
    week: '2',
  },
  {
    commits: 1,
    day: 0,
    week: '3',
  },
  {
    commits: 1,
    day: 1,
    week: '3',
  },
  {
    commits: 1,
    day: 2,
    week: '3',
  },
  {
    commits: 1,
    day: 3,
    week: '3',
  },
  {
    commits: 1,
    day: 4,
    week: '3',
  },
  {
    commits: 1,
    day: 5,
    week: '3',
  },
  {
    commits: 1,
    day: 6,
    week: '3',
  },
  {
    commits: 1,
    day: 0,
    week: '4',
  },
  {
    commits: 1,
    day: 1,
    week: '4',
  },
  {
    commits: 1,
    day: 2,
    week: '4',
  },
  {
    commits: 1,
    day: 3,
    week: '4',
  },
  {
    commits: 1,
    day: 4,
    week: '4',
  },
  {
    commits: 1,
    day: 5,
    week: '4',
  },
  {
    commits: 1,
    day: 6,
    week: '4',
  },
  {
    commits: 1,
    day: 0,
    week: '5',
  },
  {
    commits: 1,
    day: 1,
    week: '5',
  },
  {
    commits: 1,
    day: 2,
    week: '5',
  },
  {
    commits: 1,
    day: 3,
    week: '5',
  },
  {
    commits: 1,
    day: 4,
    week: '5',
  },
  {
    commits: 1,
    day: 5,
    week: '5',
  },
  {
    commits: 1,
    day: 6,
    week: '5',
  },
  {
    commits: 1,
    day: 0,
    week: '6',
  },
  {
    commits: 1,
    day: 1,
    week: '6',
  },
  {
    commits: 1,
    day: 2,
    week: '6',
  },
  {
    commits: 1,
    day: 3,
    week: '6',
  },
  {
    commits: 1,
    day: 4,
    week: '6',
  },
  {
    commits: 1,
    day: 5,
    week: '6',
  },
  {
    commits: 1,
    day: 6,
    week: '6',
  },
  {
    commits: 1,
    day: 0,
    week: '7',
  },
  {
    commits: 1,
    day: 1,
    week: '7',
  },
  {
    commits: 1,
    day: 2,
    week: '7',
  },
  {
    commits: 2,
    day: 3,
    week: '7',
  },
  {
    commits: 6,
    day: 4,
    week: '7',
  },
  {
    commits: 9,
    day: 5,
    week: '7',
  },
  {
    commits: 3,
    day: 6,
    week: '7',
  },
  {
    commits: 3,
    day: 0,
    week: '8',
  },
  {
    commits: 1,
    day: 1,
    week: '8',
  },
  {
    commits: 7,
    day: 2,
    week: '8',
  },
  {
    commits: 7,
    day: 3,
    week: '8',
  },
  {
    commits: 12,
    day: 4,
    week: '8',
  },
  {
    commits: 9,
    day: 5,
    week: '8',
  },
  {
    commits: 4,
    day: 6,
    week: '8',
  },
  {
    commits: 1,
    day: 0,
    week: '9',
  },
  {
    commits: 2,
    day: 1,
    week: '9',
  },
  {
    commits: 7,
    day: 2,
    week: '9',
  },
  {
    commits: 6,
    day: 3,
    week: '9',
  },
  {
    commits: 1,
    day: 4,
    week: '9',
  },
  {
    commits: 6,
    day: 5,
    week: '9',
  },
  {
    commits: 1,
    day: 6,
    week: '9',
  },
  {
    commits: 1,
    day: 0,
    week: '10',
  },
  {
    commits: 1,
    day: 1,
    week: '10',
  },
  {
    commits: 8,
    day: 2,
    week: '10',
  },
  {
    commits: 5,
    day: 3,
    week: '10',
  },
  {
    commits: 7,
    day: 4,
    week: '10',
  },
  {
    commits: 4,
    day: 5,
    week: '10',
  },
  {
    commits: 4,
    day: 6,
    week: '10',
  },
  {
    commits: 2,
    day: 0,
    week: '11',
  },
  {
    commits: 1,
    day: 1,
    week: '11',
  },
  {
    commits: 10,
    day: 2,
    week: '11',
  },
  {
    commits: 14,
    day: 3,
    week: '11',
  },
  {
    commits: 6,
    day: 4,
    week: '11',
  },
  {
    commits: 1,
    day: 5,
    week: '11',
  },
  {
    commits: 6,
    day: 6,
    week: '11',
  },
  {
    commits: 1,
    day: 0,
    week: '12',
  },
  {
    commits: 1,
    day: 1,
    week: '12',
  },
  {
    commits: 1,
    day: 2,
    week: '12',
  },
  {
    commits: 1,
    day: 3,
    week: '12',
  },
  {
    commits: 9,
    day: 4,
    week: '12',
  },
  {
    commits: 1,
    day: 5,
    week: '12',
  },
  {
    commits: 15,
    day: 6,
    week: '12',
  },
  {
    commits: 1,
    day: 0,
    week: '13',
  },
  {
    commits: 1,
    day: 1,
    week: '13',
  },
  {
    commits: 15,
    day: 2,
    week: '13',
  },
  {
    commits: 11,
    day: 3,
    week: '13',
  },
  {
    commits: 3,
    day: 4,
    week: '13',
  },
  {
    commits: 6,
    day: 5,
    week: '13',
  },
  {
    commits: 1,
    day: 6,
    week: '13',
  },
  {
    commits: 4,
    day: 0,
    week: '14',
  },
  {
    commits: 1,
    day: 1,
    week: '14',
  },
  {
    commits: 10,
    day: 2,
    week: '14',
  },
  {
    commits: 11,
    day: 3,
    week: '14',
  },
  {
    commits: 8,
    day: 4,
    week: '14',
  },
  {
    commits: 12,
    day: 5,
    week: '14',
  },
  {
    commits: 8,
    day: 6,
    week: '14',
  },
  {
    commits: 2,
    day: 0,
    week: '15',
  },
  {
    commits: 1,
    day: 1,
    week: '15',
  },
  {
    commits: 18,
    day: 2,
    week: '15',
  },
  {
    commits: 21,
    day: 3,
    week: '15',
  },
  {
    commits: 7,
    day: 4,
    week: '15',
  },
  {
    commits: 10,
    day: 5,
    week: '15',
  },
  {
    commits: 8,
    day: 6,
    week: '15',
  },
  {
    commits: 1,
    day: 0,
    week: '16',
  },
  {
    commits: 1,
    day: 1,
    week: '16',
  },
  {
    commits: 1,
    day: 2,
    week: '16',
  },
  {
    commits: 7,
    day: 3,
    week: '16',
  },
  {
    commits: 11,
    day: 4,
    week: '16',
  },
  {
    commits: 3,
    day: 5,
    week: '16',
  },
  {
    commits: 3,
    day: 6,
    week: '16',
  },
  {
    commits: 1,
    day: 0,
    week: '17',
  },
  {
    commits: 2,
    day: 1,
    week: '17',
  },
  {
    commits: 7,
    day: 2,
    week: '17',
  },
  {
    commits: 20,
    day: 3,
    week: '17',
  },
  {
    commits: 15,
    day: 4,
    week: '17',
  },
  {
    commits: 1,
    day: 5,
    week: '17',
  },
  {
    commits: 4,
    day: 6,
    week: '17',
  },
  {
    commits: 1,
    day: 0,
    week: '18',
  },
  {
    commits: 1,
    day: 1,
    week: '18',
  },
  {
    commits: 8,
    day: 2,
    week: '18',
  },
  {
    commits: 6,
    day: 3,
    week: '18',
  },
  {
    commits: 5,
    day: 4,
    week: '18',
  },
  {
    commits: 1,
    day: 5,
    week: '18',
  },
  {
    commits: 25,
    day: 6,
    week: '18',
  },
  {
    commits: 1,
    day: 0,
    week: '19',
  },
  {
    commits: 1,
    day: 1,
    week: '19',
  },
  {
    commits: 1,
    day: 2,
    week: '19',
  },
  {
    commits: 9,
    day: 3,
    week: '19',
  },
  {
    commits: 1,
    day: 4,
    week: '19',
  },
  {
    commits: 1,
    day: 5,
    week: '19',
  },
  {
    commits: 4,
    day: 6,
    week: '19',
  },
  {
    commits: 1,
    day: 0,
    week: '20',
  },
  {
    commits: 1,
    day: 1,
    week: '20',
  },
  {
    commits: 4,
    day: 2,
    week: '20',
  },
  {
    commits: 8,
    day: 3,
    week: '20',
  },
  {
    commits: 10,
    day: 4,
    week: '20',
  },
  {
    commits: 9,
    day: 5,
    week: '20',
  },
  {
    commits: 5,
    day: 6,
    week: '20',
  },
  {
    commits: 1,
    day: 0,
    week: '21',
  },
  {
    commits: 1,
    day: 1,
    week: '21',
  },
  {
    commits: 1,
    day: 2,
    week: '21',
  },
  {
    commits: 7,
    day: 3,
    week: '21',
  },
  {
    commits: 13,
    day: 4,
    week: '21',
  },
  {
    commits: 1,
    day: 5,
    week: '21',
  },
  {
    commits: 7,
    day: 6,
    week: '21',
  },
  {
    commits: 1,
    day: 0,
    week: '22',
  },
  {
    commits: 1,
    day: 1,
    week: '22',
  },
  {
    commits: 7,
    day: 2,
    week: '22',
  },
  {
    commits: 2,
    day: 3,
    week: '22',
  },
  {
    commits: 14,
    day: 4,
    week: '22',
  },
  {
    commits: 9,
    day: 5,
    week: '22',
  },
  {
    commits: 12,
    day: 6,
    week: '22',
  },
  {
    commits: 1,
    day: 0,
    week: '23',
  },
  {
    commits: 1,
    day: 1,
    week: '23',
  },
  {
    commits: 13,
    day: 2,
    week: '23',
  },
  {
    commits: 12,
    day: 3,
    week: '23',
  },
  {
    commits: 1,
    day: 4,
    week: '23',
  },
  {
    commits: 1,
    day: 5,
    week: '23',
  },
  {
    commits: 1,
    day: 6,
    week: '23',
  },
  {
    commits: 1,
    day: 0,
    week: '24',
  },
  {
    commits: 1,
    day: 1,
    week: '24',
  },
  {
    commits: 1,
    day: 2,
    week: '24',
  },
  {
    commits: 1,
    day: 3,
    week: '24',
  },
  {
    commits: 1,
    day: 4,
    week: '24',
  },
  {
    commits: 1,
    day: 5,
    week: '24',
  },
  {
    commits: 1,
    day: 6,
    week: '24',
  },
  {
    commits: 1,
    day: 0,
    week: '25',
  },
  {
    commits: 1,
    day: 1,
    week: '25',
  },
  {
    commits: 10,
    day: 2,
    week: '25',
  },
  {
    commits: 4,
    day: 3,
    week: '25',
  },
  {
    commits: 7,
    day: 4,
    week: '25',
  },
  {
    commits: 3,
    day: 5,
    week: '25',
  },
  {
    commits: 14,
    day: 6,
    week: '25',
  },
  {
    commits: 1,
    day: 0,
    week: '26',
  },
  {
    commits: 1,
    day: 1,
    week: '26',
  },
  {
    commits: 5,
    day: 2,
    week: '26',
  },
];

const HEATMAP_COPY_DATA = [
  {
    commits: 0,
    day: 1,
    week: '0',
  },
  {
    commits: 0,
    day: 2,
    week: '0',
  },
  {
    commits: 0,
    day: 3,
    week: '0',
  },
  {
    commits: 0,
    day: 4,
    week: '0',
  },
  {
    commits: 0,
    day: 5,
    week: '0',
  },
  {
    commits: 0,
    day: 6,
    week: '0',
  },
  {
    commits: 1,
    day: 0,
    week: '1',
  },
  {
    commits: 1,
    day: 1,
    week: '1',
  },
  {
    commits: 1,
    day: 2,
    week: '1',
  },
  {
    commits: 1,
    day: 3,
    week: '1',
  },
  {
    commits: 1,
    day: 4,
    week: '1',
  },
  {
    commits: 1,
    day: 5,
    week: '1',
  },
  {
    commits: 1,
    day: 6,
    week: '1',
  },
  {
    commits: 1,
    day: 0,
    week: '2',
  },
  {
    commits: 1,
    day: 1,
    week: '2',
  },
  {
    commits: 1,
    day: 2,
    week: '2',
  },
  {
    commits: 1,
    day: 3,
    week: '2',
  },
  {
    commits: 1,
    day: 4,
    week: '2',
  },
  {
    commits: 1,
    day: 5,
    week: '2',
  },
  {
    commits: 1,
    day: 6,
    week: '2',
  },
  {
    commits: 1,
    day: 0,
    week: '3',
  },
  {
    commits: 1,
    day: 1,
    week: '3',
  },
  {
    commits: 1,
    day: 2,
    week: '3',
  },
  {
    commits: 1,
    day: 3,
    week: '3',
  },
  {
    commits: 1,
    day: 4,
    week: '3',
  },
  {
    commits: 1,
    day: 5,
    week: '3',
  },
  {
    commits: 1,
    day: 6,
    week: '3',
  },
  {
    commits: 1,
    day: 0,
    week: '4',
  },
  {
    commits: 1,
    day: 1,
    week: '4',
  },
  {
    commits: 1,
    day: 2,
    week: '4',
  },
  {
    commits: 1,
    day: 3,
    week: '4',
  },
  {
    commits: 1,
    day: 4,
    week: '4',
  },
  {
    commits: 1,
    day: 5,
    week: '4',
  },
  {
    commits: 1,
    day: 6,
    week: '4',
  },
  {
    commits: 1,
    day: 0,
    week: '5',
  },
  {
    commits: 1,
    day: 1,
    week: '5',
  },
  {
    commits: 1,
    day: 2,
    week: '5',
  },
  {
    commits: 1,
    day: 3,
    week: '5',
  },
  {
    commits: 1,
    day: 4,
    week: '5',
  },
  {
    commits: 1,
    day: 5,
    week: '5',
  },
  {
    commits: 1,
    day: 6,
    week: '5',
  },
  {
    commits: 1,
    day: 0,
    week: '6',
  },
  {
    commits: 1,
    day: 1,
    week: '6',
  },
  {
    commits: 1,
    day: 2,
    week: '6',
  },
  {
    commits: 1,
    day: 3,
    week: '6',
  },
  {
    commits: 1,
    day: 4,
    week: '6',
  },
  {
    commits: 1,
    day: 5,
    week: '6',
  },
  {
    commits: 1,
    day: 6,
    week: '6',
  },
  {
    commits: 1,
    day: 0,
    week: '7',
  },
  {
    commits: 1,
    day: 1,
    week: '7',
  },
  {
    commits: 1,
    day: 2,
    week: '7',
  },
  {
    commits: 2,
    day: 3,
    week: '7',
  },
  {
    commits: 6,
    day: 4,
    week: '7',
  },
  {
    commits: 9,
    day: 5,
    week: '7',
  },
  {
    commits: 3,
    day: 6,
    week: '7',
  },
  {
    commits: 3,
    day: 0,
    week: '8',
  },
  {
    commits: 1,
    day: 1,
    week: '8',
  },
  {
    commits: 7,
    day: 2,
    week: '8',
  },
  {
    commits: 7,
    day: 3,
    week: '8',
  },
  {
    commits: 12,
    day: 4,
    week: '8',
  },
  {
    commits: 9,
    day: 5,
    week: '8',
  },
  {
    commits: 4,
    day: 6,
    week: '8',
  },
  {
    commits: 1,
    day: 0,
    week: '9',
  },
  {
    commits: 2,
    day: 1,
    week: '9',
  },
  {
    commits: 7,
    day: 2,
    week: '9',
  },
  {
    commits: 6,
    day: 3,
    week: '9',
  },
  {
    commits: 1,
    day: 4,
    week: '9',
  },
  {
    commits: 6,
    day: 5,
    week: '9',
  },
  {
    commits: 1,
    day: 6,
    week: '9',
  },
  {
    commits: 1,
    day: 0,
    week: '10',
  },
  {
    commits: 20,
    day: 1,
    week: '10',
  },
  {
    commits: 20,
    day: 2,
    week: '10',
  },
  {
    commits: 20,
    day: 3,
    week: '10',
  },
  {
    commits: 20,
    day: 4,
    week: '10',
  },
  {
    commits: 20,
    day: 5,
    week: '10',
  },
  {
    commits: 20,
    day: 6,
    week: '10',
  },
  {
    commits: 20,
    day: 0,
    week: '11',
  },
  {
    commits: 1,
    day: 1,
    week: '11',
  },
  {
    commits: 10,
    day: 2,
    week: '11',
  },
  {
    commits: 14,
    day: 3,
    week: '11',
  },
  {
    commits: 6,
    day: 4,
    week: '11',
  },
  {
    commits: 1,
    day: 5,
    week: '11',
  },
  {
    commits: 6,
    day: 6,
    week: '11',
  },
  {
    commits: 1,
    day: 0,
    week: '12',
  },
  {
    commits: 1,
    day: 1,
    week: '12',
  },
  {
    commits: 1,
    day: 2,
    week: '12',
  },
  {
    commits: 1,
    day: 3,
    week: '12',
  },
  {
    commits: 9,
    day: 4,
    week: '12',
  },
  {
    commits: 1,
    day: 5,
    week: '12',
  },
  {
    commits: 15,
    day: 6,
    week: '12',
  },
  {
    commits: 1,
    day: 0,
    week: '13',
  },
  {
    commits: 1,
    day: 1,
    week: '13',
  },
  {
    commits: 15,
    day: 2,
    week: '13',
  },
  {
    commits: 11,
    day: 3,
    week: '13',
  },
  {
    commits: 3,
    day: 4,
    week: '13',
  },
  {
    commits: 6,
    day: 5,
    week: '13',
  },
  {
    commits: 1,
    day: 6,
    week: '13',
  },
  {
    commits: 4,
    day: 0,
    week: '14',
  },
  {
    commits: 1,
    day: 1,
    week: '14',
  },
  {
    commits: 10,
    day: 2,
    week: '14',
  },
  {
    commits: 11,
    day: 3,
    week: '14',
  },
  {
    commits: 8,
    day: 4,
    week: '14',
  },
  {
    commits: 12,
    day: 5,
    week: '14',
  },
  {
    commits: 8,
    day: 6,
    week: '14',
  },
  {
    commits: 2,
    day: 0,
    week: '15',
  },
  {
    commits: 1,
    day: 1,
    week: '15',
  },
  {
    commits: 18,
    day: 2,
    week: '15',
  },
  {
    commits: 21,
    day: 3,
    week: '15',
  },
  {
    commits: 7,
    day: 4,
    week: '15',
  },
  {
    commits: 10,
    day: 5,
    week: '15',
  },
  {
    commits: 8,
    day: 6,
    week: '15',
  },
  {
    commits: 1,
    day: 0,
    week: '16',
  },
  {
    commits: 1,
    day: 1,
    week: '16',
  },
  {
    commits: 1,
    day: 2,
    week: '16',
  },
  {
    commits: 7,
    day: 3,
    week: '16',
  },
  {
    commits: 11,
    day: 4,
    week: '16',
  },
  {
    commits: 3,
    day: 5,
    week: '16',
  },
  {
    commits: 3,
    day: 6,
    week: '16',
  },
  {
    commits: 1,
    day: 0,
    week: '17',
  },
  {
    commits: 2,
    day: 1,
    week: '17',
  },
  {
    commits: 7,
    day: 2,
    week: '17',
  },
  {
    commits: 20,
    day: 3,
    week: '17',
  },
  {
    commits: 15,
    day: 4,
    week: '17',
  },
  {
    commits: 1,
    day: 5,
    week: '17',
  },
  {
    commits: 4,
    day: 6,
    week: '17',
  },
  {
    commits: 1,
    day: 0,
    week: '18',
  },
  {
    commits: 1,
    day: 1,
    week: '18',
  },
  {
    commits: 8,
    day: 2,
    week: '18',
  },
  {
    commits: 6,
    day: 3,
    week: '18',
  },
  {
    commits: 5,
    day: 4,
    week: '18',
  },
  {
    commits: 1,
    day: 5,
    week: '18',
  },
  {
    commits: 25,
    day: 6,
    week: '18',
  },
  {
    commits: 1,
    day: 0,
    week: '19',
  },
  {
    commits: 1,
    day: 1,
    week: '19',
  },
  {
    commits: 1,
    day: 2,
    week: '19',
  },
  {
    commits: 9,
    day: 3,
    week: '19',
  },
  {
    commits: 1,
    day: 4,
    week: '19',
  },
  {
    commits: 1,
    day: 5,
    week: '19',
  },
  {
    commits: 4,
    day: 6,
    week: '19',
  },
  {
    commits: 1,
    day: 0,
    week: '20',
  },
  {
    commits: 1,
    day: 1,
    week: '20',
  },
  {
    commits: 4,
    day: 2,
    week: '20',
  },
  {
    commits: 8,
    day: 3,
    week: '20',
  },
  {
    commits: 10,
    day: 4,
    week: '20',
  },
  {
    commits: 9,
    day: 5,
    week: '20',
  },
  {
    commits: 5,
    day: 6,
    week: '20',
  },
  {
    commits: 1,
    day: 0,
    week: '21',
  },
  {
    commits: 1,
    day: 1,
    week: '21',
  },
  {
    commits: 1,
    day: 2,
    week: '21',
  },
  {
    commits: 7,
    day: 3,
    week: '21',
  },
  {
    commits: 13,
    day: 4,
    week: '21',
  },
  {
    commits: 1,
    day: 5,
    week: '21',
  },
  {
    commits: 7,
    day: 6,
    week: '21',
  },
  {
    commits: 1,
    day: 0,
    week: '22',
  },
  {
    commits: 1,
    day: 1,
    week: '22',
  },
  {
    commits: 7,
    day: 2,
    week: '22',
  },
  {
    commits: 2,
    day: 3,
    week: '22',
  },
  {
    commits: 14,
    day: 4,
    week: '22',
  },
  {
    commits: 9,
    day: 5,
    week: '22',
  },
  {
    commits: 12,
    day: 6,
    week: '22',
  },
  {
    commits: 1,
    day: 0,
    week: '23',
  },
  {
    commits: 1,
    day: 1,
    week: '23',
  },
  {
    commits: 13,
    day: 2,
    week: '23',
  },
  {
    commits: 12,
    day: 3,
    week: '23',
  },
  {
    commits: 1,
    day: 4,
    week: '23',
  },
  {
    commits: 1,
    day: 5,
    week: '23',
  },
  {
    commits: 1,
    day: 6,
    week: '23',
  },
  {
    commits: 1,
    day: 0,
    week: '24',
  },
  {
    commits: 1,
    day: 1,
    week: '24',
  },
  {
    commits: 1,
    day: 2,
    week: '24',
  },
  {
    commits: 1,
    day: 3,
    week: '24',
  },
  {
    commits: 1,
    day: 4,
    week: '24',
  },
  {
    commits: 1,
    day: 5,
    week: '24',
  },
  {
    commits: 1,
    day: 6,
    week: '24',
  },
  {
    commits: 1,
    day: 0,
    week: '25',
  },
  {
    commits: 1,
    day: 1,
    week: '25',
  },
  {
    commits: 10,
    day: 2,
    week: '25',
  },
  {
    commits: 20,
    day: 3,
    week: '25',
  },
  {
    commits: 27,
    day: 4,
    week: '25',
  },
  {
    commits: 23,
    day: 5,
    week: '25',
  },
  {
    commits: 34,
    day: 6,
    week: '25',
  },
  {
    commits: 21,
    day: 0,
    week: '26',
  },
  {
    commits: 21,
    day: 1,
    week: '26',
  },
  {
    commits: 25,
    day: 2,
    week: '26',
  },
];

function Charts() {
  const theme = useTheme();
  const { project, role } = useSelector((state) => state);

  const [projectStats, setProjectStats] = useState([]);
  const [isProjectStatsLoading, setIsProjectStatsLoading] = useState(true);

  const [projectFileSize, setProjectFileSize] = useState([]);
  const [isProjectFileSizeLoading, setIsProjectFileSizeLoading] =
    useState(true);

  const [projectFileActivity, setProjectFileActivity] = useState({});
  const [isProjectFileActivityLoading, setIsProjectFileActivityLoading] =
    useState(true);

  const tzOffset = moment().utcOffset() / 60 + ':00';

  const SAPDataField = {
    xField: 'date',
    yField: 'size',
    seriesField: 'source',
  };
  const SAPCurrentYear = getCurrentYear(projectFileSize);
  const SAPConfig = {
    meta: {
      size: {
        type: 'linear',
        formatter: (val) => convertToFileSizeInUnit(val),
      },
      date: {
        range: [0, 1],
        formatter: (val) => setLabelsDate(val, SAPCurrentYear),
      },
    },
  };

  const heatMapDataField = {
    xField: 'week',
    yField: 'day',
    colorField: 'commits',
  };

  const getStatAttrs = (meta, stat) => {
    switch (meta) {
      case 'total_count':
        return {
          class: 'file-total',
          title: 'Total Files',
          icon: <FileTextOutlined />,
          stat,
        };
      case 'total_size':
        return {
          class: 'file-size',
          title: 'Total File Size',
          icon: <HddOutlined />,
          stat: getFileSize(stat, { roundingLimit: 1 }),
        };
      case 'total_users':
        return {
          class: 'users-total',
          title: 'Project Members',
          icon: <TeamOutlined />,
          stat,
        };
      case 'today_uploaded':
        return {
          class: 'uploaded',
          title: 'Uploaded',
          icon: <CloudUploadOutlined />,
          stat,
        };
      case 'today_downloaded':
        return {
          class: 'downloaded',
          title: 'Downloaded',
          icon: <DownloadOutlined />,
          stat,
        };
    }
  };

  useEffect(() => {
    async function fetchProjectStats() {
      if (project.profile?.id) {
        const params = { time_zone: tzOffset };
        try {
          // let statsResults = await getProjectStatistics(
          //   params,
          //   project.profile.code,
          // );
          const statsResults = {
            files: {
              total_count: 226,
              total_size: 16000000000,
            },
            activity: {
              today_uploaded: 100,
              today_downloaded: 150,
            },
          };

          const result = Object.keys(statsResults).map((stat) => ({
            [stat]: statsResults[stat],
          }));

          if (role === 'admin') {
            const usersResults = await getUserOnProjectAPI(project.profile.id, {
              page: 0,
              pageSize: 10,
              orderBy: 'time_created',
              orderType: 'desc',
            });
            // move user stat to second item in array
            result.splice(1, 0, {
              user: { total_users: usersResults.data.total },
            });
          }
          setProjectStats(result);
        } catch {
          message.error(
            'Something went wrong while retrieving project statistics',
          );
        }

        setIsProjectStatsLoading(false);
      }
    }
    fetchProjectStats();
  }, [project?.profile]);

  useEffect(() => {
    async function fetchProjectFileSize() {
      if (project.profile?.id) {
        const toMonth = moment().startOf('month').format('YYYY-MM-DDTHH:mm:ss');
        const fromMonth = moment()
          .subtract(15, 'months')
          .startOf('month')
          .format('YYYY-MM-DDTHH:mm:ss');

        const params = {
          from: fromMonth,
          to: toMonth,
          group_by: 'month',
          time_zone: tzOffset,
        };
        try {
          // const fileSizeResults = await getProjectFileSize(params, project.profile.id);
          const fileSizeResults = {
            data: {
              labels: ['2022-01', '2022-02', '2022-03'],
              datasets: [
                {
                  label: 0, // Will be mapped to "greenroom" in bff
                  values: [536870912, 715827882, 920350134],
                },
                {
                  label: 1, // Will be mapped to "core" in bff
                  values: [107374182, 143165576, 184070026],
                },
              ],
            },
          };

          const plotData = fileSizeResults.data.datasets.reduce(
            (result, dataset) => {
              const datasetKeys = Object.keys(dataset);
              const label = dataset[datasetKeys[0]];
              const values = dataset[datasetKeys[1]];

              values.forEach((val, index) => {
                result.push({
                  // to remove when API is live, labels will have proper names
                  [SAPDataField.seriesField]:
                    label === 0 ? 'Greenroom' : 'Core',
                  [SAPDataField.xField]: fileSizeResults.data.labels[index]
                    .split('-')
                    .reverse()
                    .join('-'),
                  [SAPDataField.yField]: val,
                });
              });

              return result;
            },
            [],
          );

          setProjectFileSize(plotData);
        } catch {
          message.error(
            'Something went wrong while retrieving project file size',
          );
        }

        setIsProjectFileSizeLoading(false);
      }
    }

    fetchProjectFileSize();
  }, [project?.profile]);

  useEffect(() => {
    const mockAPI = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              '2022-01-01': 1,
              '2022-01-02': 0,
              '2022-01-03': 10,
              '2022-01-04': 23,
              '2022-01-05': 40,
              '2022-01-06': 10,
              '2022-01-07': 39,
              '2022-01-08': 22,
              '2022-01-09': 33,
              '2022-01-10': 18,
              '2022-01-11': 38,
              '2022-01-12': 19,
              '2022-01-13': 27,
              '2022-01-14': 38,
              '2022-01-15': 17,
              '2022-01-16': 27,
              '2022-01-17': 42,
              '2022-01-18': 41,
              '2022-01-19': 27,
              '2022-01-20': 15,
              '2022-01-21': 8,
              '2022-01-22': 4,
              '2022-01-23': 3,
              '2022-01-24': 27,
              '2022-01-25': 2,
              '2022-01-26': 0,
              '2022-01-27': 49,
              '2022-01-28': 38,
              '2022-01-29': 14,
              '2022-01-30': 17,
              '2022-01-31': 19,
              '2022-02-01': 3,
              '2022-02-02': 14,
              '2022-02-03': 23,
              '2022-02-04': 43,
              '2022-02-05': 12,
              '2022-02-06': 22,
              '2022-02-07': 32,
              '2022-02-08': 33,
              '2022-02-09': 23,
              '2022-02-10': 13,
              '2022-02-11': 13,
              '2022-02-12': 43,
              '2022-02-13': 23,
              '2022-02-14': 3,
              '2022-02-15': 37,
              '2022-02-16': 7,
              '2022-02-17': 27,
              '2022-02-18': 47,
              '2022-02-19': 50,
              '2022-02-20': 1,
              '2022-02-21': 13,
              '2022-02-22': 31,
              '2022-02-23': 33,
              '2022-02-24': 43,
              '2022-02-25': 32,
              '2022-02-26': 3,
              '2022-02-27': 23,
              '2022-02-28': 13,
            },
          });
        }, 3000);
      });
    };

    async function fetchProjectFileActivity() {
      if (project?.profile?.id) {
        const toMonth = moment().startOf('month').format('YYYY-MM-DDTHH:mm:ss');
        const fromMonth = moment()
          .subtract(6, 'months')
          .startOf('month')
          .format('YYYY-MM-DDTHH:mm:ss');

        const params = {
          from: fromMonth,
          to: toMonth,
          group_by: 'day',
          time_zone: tzOffset,
        };
        const response = [];

        const activity = ['download', 'upload', 'delete', 'copy'];
        for (let act of activity) {
          params.activity = act;
          response.push(mockAPI(params, project.profile.id));
          // console.log(params)
          // response.push(getProjectActivity(params, project.profile.id));
        }

        try {
          const result = {};
          (await Promise.all(response)).map(
            (activityData, index) => (result[activity[index]] = activityData),
          );
          console.log(result);
          // setProjectFileActivity(result);
        } catch {
          message.error(
            'Something went wrong while retreiving project file activity',
          );
        }

        setIsProjectFileActivityLoading(false);
      }
    }
    fetchProjectFileActivity();
  }, [project?.profile]);

  function sortProjectStats() {
    const stats = projectStats.map((item) => {
      const key = Object.keys(item)[0];
      return item[key];
    });

    const statMapping = [];
    for (let statsObj of stats) {
      const statKeys = Object.keys(statsObj);

      for (let stat of statKeys) {
        statMapping.push({ [stat]: statsObj[stat] });
      }
    }

    return statMapping;
  }

  function appendProjectStats() {
    const statMapping = sortProjectStats();

    return statMapping.map((metaObj) => {
      const key = Object.keys(metaObj)[0];
      const attrs = getStatAttrs(key, metaObj[key]);

      return (
        <li className={styles[`meta__${attrs.class}`]}>
          <div>
            <span>{attrs.title}</span>
            <div className={styles['meta-stat']}>
              {attrs.icon}
              <span>{attrs.stat}</span>
            </div>
          </div>
        </li>
      );
    });
  }

  return (
    <div className={styles.charts}>
      <ul className={styles['charts__meta']}>
        {isProjectStatsLoading ? (
          <Spin spinning={isProjectStatsLoading} />
        ) : (
          appendProjectStats()
        )}
      </ul>

      <div className={styles['charts__graphs']}>
        <div className={styles['graphs__container']}>
          <h4 className={styles['graphs__title']}>Projects File Size</h4>
          {/* TODO: move spinner to inside of each graph and center the spinner */}
          <Spin spinning={isProjectFileSizeLoading}>
            <StackedAreaPlot
              data={projectFileSize}
              xField={SAPDataField.xField}
              yField={SAPDataField.yField}
              seriesField={SAPDataField.seriesField}
              color={theme.charts.stackedAreaPlot}
              chartConfig={SAPConfig}
            />
          </Spin>
        </div>
        <div className={styles['graphs__container']}>
          <h4 className={styles['graphs__title']}>Project File Activity</h4>
          <HeatMapTabSwitcher
            downloadData={HEATMAP_DOWNLOAD_DATA}
            uploadData={HEATMAP_UPLOAD_DATA}
            deleteData={HEATMAP_DELETE_DATA}
            copyData={HEATMAP_COPY_DATA}
            dataMapping={heatMapDataField}
          />
        </div>
      </div>
    </div>
  );
}

export default React.memo(Charts);
