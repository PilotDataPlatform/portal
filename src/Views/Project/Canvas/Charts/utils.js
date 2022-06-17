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
