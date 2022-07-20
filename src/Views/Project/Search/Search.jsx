import React, { useState } from 'react';
import { Button, message } from 'antd';
import { withCurrentProject, toFixedNumber } from '../../../Utility';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import SearchConditions from './Components/SearchConditions';
import SearchResultTable from './Components/SearchResultTable';
import { searchProjectFiles } from '../../../APIs';
import variables from '../../../Themes/base.scss';
import _ from 'lodash';

function Search(props) {
  const { t } = useTranslation(['formErrorMessages']);
  const [conditions, setConditions] = useState([]);
  const [searchConditions, setSearchConditions] = useState([]);
  const [files, setFiles] = useState([]);
  const [page, setPage] = useState(0);
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
          created_time_start: timeStart,
          created_time_end: timeEnd,
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

  const searchFiles = (pagination = {}) => {
    setLoading(true);
    const queryParams = conditions.reduce(
      (params, condition) => ({ ...params, ...queryTransformer(condition) }),
      {},
    );
    // handle the search when click on search button
    searchProjectFiles(
      { ...queryParams, ...pagination },
      props.currentProject.code,
    )
      .then((res) => {
        const result = res.data.result.map((file) => ({
          ...file,
          key: file.storage_id,
        }));
        const greenroomFiles = result.filter(
          (file) => file.zone === 'Greenroom',
        );
        const coreFiles = result.filter((file) => file.zone === 'Core');
        setFiles({ all: result, greenroom: greenroomFiles, core: coreFiles });

        setGreenRoomTotal(greenroomFiles.length);
        setCoreTotal(coreFiles.length);
      })
      .catch(() => {
        message.error('Something went wrong while searching for files');
      })
      .finally(() => setLoading(false));
  };

  const onTableChange = (pagination) => {
    const page = pagination.current - 1;
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
          zone={filters.zone}
          loading={loading}
          attributeList={attributeList}
          searchConditions={searchConditions}
        />
      </div>
    </>
  );
}
export default withCurrentProject(Search);
