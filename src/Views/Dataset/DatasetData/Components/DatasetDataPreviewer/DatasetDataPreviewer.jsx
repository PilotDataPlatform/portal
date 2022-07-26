/*
Copyright (C) 2022 Indoc Research

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BlankPreviewerCard } from './BlankPreviewerCard/BlankPreviewerCard';
import { NotSupportCard } from './NotSupportCard/NotSupportCard';
import { JsonPreviewer } from './JSON/JsonPreviewer/JsonPreviewer';
import { CsvPreviewer } from './CSV/CsvPreviewer/CsvPreviewer';
import { TxtPreviewer } from './TXT/TxtPreviewer/TxtPreviewer';

export default function DatasetDataPreviewer(props) {
  const { previewFile } = useSelector((state) => state.datasetData);
  if (
    previewFile?.type === 'txt' ||
    previewFile?.type === 'yml' ||
    previewFile?.type === 'yaml' ||
    previewFile?.type === 'log'
  ) {
    return <TxtPreviewer previewFile={previewFile} />;
  }
  switch (previewFile?.type) {
    case 'json': {
      return <JsonPreviewer previewFile={previewFile} />;
    }
    case 'csv': {
      return <CsvPreviewer previewFile={previewFile} />;
    }
    case 'tsv': {
      return <CsvPreviewer previewFile={previewFile} />;
    }
    case null: {
      return <NotSupportCard />;
    }
    default: {
      return <BlankPreviewerCard />;
    }
  }
}
