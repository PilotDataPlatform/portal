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
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Button, message } from 'antd';
import {
  withCurrentProject,
  toFixedNumber,
} from '../../../Utility';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import SearchConditions from './Components/SearchConditions';
import SearchResultTable from './Components/SearchResultTable';
import { searchProjectFilesAPI } from '../../../APIs';
import variables from '../../../Themes/base.scss';
import _ from 'lodash';

function Search(props) {
  const { t } = useTranslation(['formErrorMessages']);
  const [conditions, setConditions] = useState([]);
  const [searchConditions, setSearchConditions] = useState([]);
  const [files, setFiles] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [greenRoomTotal, setGreenRoomTotal] = useState('');
  const [coreTotal, setCoreTotal] = useState('');
  const [filters, setFilters] = useState({ zone: 'greenroom' });
  const [loading, setLoading] = useState(false);
  const [attributeList, setAttributeList] = useState([]);

  const permission = props.containerDetails.permission;

  const queryTransformer = (condition) => {
    switch (condition.category) {
      case 'file_name':
        const name =
          condition.condition === 'contain'
            ? `%${condition.keywords}%`
            : condition.keywords;
        return { name };

      case 'uploader':
        const owner =
          condition.condition === 'contain'
            ? `%${condition.keywords}%`
            : condition.keywords;
        return { owner };

      case 'time_created':
        const [timeStart, timeEnd] = condition.calendar;
        return {
          from: moment.unix(timeStart).format(),
          to: moment.unix(timeEnd).format(),
        };

      case 'file_size':
        let fileSize = Number(condition.value);
        let fileSize2 = Number(condition.value2);
        if (condition.unit === 'kb') fileSize = fileSize * 1024;
        if (condition.unit === 'mb') fileSize = fileSize * 1024 * 1024;
        if (condition.unit === 'gb') fileSize = fileSize * 1024 * 1024 * 1024;

        if (fileSize2) {
          if (condition.unit === 'kb') fileSize2 = fileSize2 * 1024;
          if (condition.unit === 'mb') fileSize2 = fileSize2 * 1024 * 1024;
          if (condition.unit === 'gb')
            fileSize2 = fileSize2 * 1024 * 1024 * 1024;

          return {
            size_gte: toFixedNumber(fileSize),
            size_lte: toFixedNumber(fileSize2),
          };
        }

        return {
          [`size_${condition.condition}`]: toFixedNumber(fileSize),
        };

      case 'tags':
        return { tags_all: condition.keywords.join(',') };

      case 'attributes':
        const containAttributes = attributeList.some((el) => el.name);
        const attributes = containAttributes
          ? attributeList
              ?.map((attr) => {
                return {
                  [attr.name]: attr.value,
                };
              })
              .reduce((params, attr) => ({ ...params, ...attr }), {})
          : {};
        return { attributes };
    }
  };

  const searchFiles = async (pagination = {page, page_size: pageSize}) => {
    setLoading(true);
    const queryParams = conditions.reduce(
      (params, condition) => ({ ...params, ...queryTransformer(condition) }),
      {},
    );
    // handle the search when click on search button
    const zoneQueryParams = {
      ...queryParams,
      zone: filters.zone
    };
    try {
      const searchResponses = [
        searchProjectFilesAPI(
          { ...queryParams, ...pagination },
          props.currentProject.code,
        ),
        searchProjectFilesAPI(
          { ...zoneQueryParams, ...pagination },
          props.currentProject.code,
        ),
      ];
      const [allResponse, zoneResponse] = await Promise.all(searchResponses);

      const { greenroom: greenRoomTotal, core: coreTotal } =
        allResponse.data.totalPerZone;

      const zoneResults = zoneResponse.data.result
        .map((file) => ({
          ...file,
          key: file.storage_id,
        }))
        // TODO: filter out dirty data. bandaid fix, back end to resolve
        .filter((record) => record.parentPath);

      setGreenRoomTotal(greenRoomTotal);
      setCoreTotal(coreTotal);
      setFiles(zoneResults);
    } catch {
      message.error(t('formErrorMessages:search:default:0'));
    }
    setLoading(false);
  };

  const onTableChange = (pagination) => {
    const page = pagination.current;
    const pageSize = pagination.pageSize;

    setPage(page);
    setPageSize(pageSize);

    const paginationParams = {
      page,
      page_size: pageSize,
    };

    searchFiles(paginationParams);
  };

  const resetConditions = () => {
    setConditions([{ cid: uuidv4() }]);
    setFilters({ zone: 'greenroom' });
    setGreenRoomTotal('');
    setCoreTotal('');
    setFiles([]);
    setPage(0);
  };

  useEffect(() => {
    // condition prevents search on comnponent mount
    if (conditions[0]?.condition) {
      searchFiles();
    }
  }, [filters]);

  return (
    <>
      <div
        style={{
          margin: '17px 17px 0px 35px',
          borderRadius: 8,
          boxShadow: '0px 3px 6px #0000001A',
          background: 'white',
          letterSpacing: '0.2px',
          minHeight: '720px',
        }}
      >
        <div
          style={{
            borderBottom: '1px solid #f1f1f1',
            height: 45,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <p
            style={{
              color: variables.primaryColor1,
              fontSize: 16,
              fontWeight: 'bold',
              margin: '0px 0px 0px 20px',
            }}
          >
            Search
          </p>
          <Button
            type="primary"
            style={{
              marginRight: '20px',
              borderRadius: '6px',
              height: '30px',
              width: '70px',
              marginTop: '3px',
            }}
            onClick={() => resetConditions()}
          >
            Reset
          </Button>
        </div>
        <SearchConditions
          conditions={conditions}
          setConditions={setConditions}
          searchFiles={searchFiles}
          permission={permission}
          attributeList={attributeList}
          setAttributeList={setAttributeList}
          searchConditions={searchConditions}
          setSearchConditions={setSearchConditions}
          setPage={setPage}
          setPageSize={setPageSize}
        />
        <SearchResultTable
          files={files}
          page={page}
          setPage={setPage}
          greenRoomTotal={greenRoomTotal}
          coreTotal={coreTotal}
          onTableChange={onTableChange}
          pageSize={pageSize}
          setFilters={setFilters}
          filters={filters}
          loading={loading}
          attributeList={attributeList}
          searchConditions={searchConditions}
        />
      </div>
    </>
  );
}
export default withCurrentProject(Search);
