/*
 * Copyright (C) 2022 Indoc Research
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export const convertToFileSizeInUnit = (size) => {
  const sizeThreshold = 1024;
  if (size === 0) {
    return size;
  }
  if (size < Math.pow(sizeThreshold, 2)) {
    return (size / sizeThreshold).toFixed(0).toString().concat('Kb');
  }
  if (size < Math.pow(sizeThreshold, 3)) {
    return (size / Math.pow(sizeThreshold, 2))
      .toFixed(0)
      .toString()
      .concat('Mb');
  }
  if (size < Math.pow(sizeThreshold, 4)) {
    return (size / Math.pow(sizeThreshold, 3))
      .toFixed(0)
      .toString()
      .concat('Gb');
  }
  if (size < Math.pow(sizeThreshold, 5)) {
    return (size / Math.pow(sizeThreshold, 4))
      .toFixed(1)
      .toString()
      .concat('Tb');
  }
};

export const setLabelsDate = (date, currentYear) => {
  const [mm, yyyy] = date.split('-');
  let month;
  const year = parseInt(yyyy);

  switch (mm) {
    case '01':
      month = 'Jan';
      break;
    case '02':
      month = 'Feb';
      break;
    case '03':
      month = 'Mar';
      break;
    case '04':
      month = 'Apr';
      break;
    case '05':
      month = 'May';
      break;
    case '06':
      month = 'Jun';
      break;
    case '07':
      month = 'Jul';
      break;
    case '08':
      month = 'Aug';
      break;
    case '09':
      month = 'Sep';
      break;
    case '10':
      month = 'Oct';
      break;
    case '11':
      month = 'Nov';
      break;
    case '12':
      month = 'Dec';
      break;
    default:
      month = 'Invalid Month';
  }

  if (year === currentYear && month === 'Jan') {
    return `${month} \n ${year}`;
  }
  return month;
};

export const getCurrentYear = (data) => {
  const years = data.map((item) => {
    const [mm, yyyy] = item.date.split('-');
    return parseInt(yyyy);
  });
  return Math.max(...years);
};
