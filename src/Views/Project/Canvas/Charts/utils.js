const sizeThreshold = 1024;

export const getFileSizeInBytes = (size, sizeUnit) => {
  let power = 1;

  switch (sizeUnit) {
    case 'Kb':
      power = 1;
      break;
    case 'Mb':
      power = 2;
      break;
    case 'Gb':
      power = 3;
      break;
    case 'Tb':
      power = 4;
      break;
  }
  return size * Math.pow(sizeThreshold, power);
};

export const convertFileSizeMetaData = (range) =>
  range.map((r) => {
    const [fileSize, fileSizeUnit] = r.match(/[a-zA-Z]+|[0-9]+/g);
    return getFileSizeInBytes(fileSize, fileSizeUnit);
  });

export const setLabelsInFileSize = (size) => {
  if (size === 0) {
    return size;
  }
  if (size < Math.pow(sizeThreshold, 2)) {
    return (size / sizeThreshold).toString().concat('Kb');
  }
  if (size < Math.pow(sizeThreshold, 3)) {
    return (size / Math.pow(sizeThreshold, 2)).toString().concat('Mb');
  }
  if (size < Math.pow(sizeThreshold, 4)) {
    return (size / Math.pow(sizeThreshold, 3)).toString().concat('Gb');
  }
  if (size < Math.pow(sizeThreshold, 5)) {
    return (size / Math.pow(sizeThreshold, 4)).toString().concat('Tb');
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

  if ( year === currentYear && month === 'Jan' ) {
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
