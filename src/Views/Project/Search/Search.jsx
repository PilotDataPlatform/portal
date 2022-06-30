import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import { withCurrentProject, toFixedNumber } from '../../../Utility';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import SearchConditions from './Components/SearchConditions';
import SearchResultTable from './Components/SearchResultTable';
import { searchFilesAPI } from '../../../APIs';
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
  // const [filesQuery, setFilesQuery] = useState({});
  // const [lastSearchQuery, setLastSearchQuery] = useState('');

  // const username = useSelector((state) => state.username);

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
          : {}; //TODO: test what happens to response when passing an empty object as param
        return { attributes };
    }
  };

  const searchFiles = (pagination = {}) => {
    setLoading(true);
    // let query = {};
    // let newQuery = {};
    // for (const condition of conditions) {
    //   const payload = queryTransformer(condition);
    //   // the below line is no longer needed in new API?
    //   query[condition.category] = payload;
    // }
    const queryParams = conditions.reduce(
      (params, condition) => ({ ...params, ...queryTransformer(condition) }),
      {},
    );

    console.log(queryParams);

    // for (const filter of filters) {
    //   const payload = queryTransformer(filter);
    //   // the below line is no longer needed in new API?
    //   query[filter.category] = payload;
    // }

    // // all this stuff below is not needed in new API?
    // query['archived'] = {
    //   value: false,
    //   condition: 'equal',
    // };

    // if (permission === 'contributor') {
    //   query['display_path'] = {
    //     value: username,
    //     condition: 'start_with',
    //   };
    //   query['zone'] = {
    //     value: 'greenroom',
    //     condition: 'equal',
    //   };
    // } else if (permission === 'collaborator') {
    //   if (query['zone']['value'] === 'greenroom') {
    //     query['display_path'] = {
    //       value: username,
    //       condition: 'start_with',
    //     };
    //   }
    // }

    // handle the search when click on search button
    searchFilesAPI(
      { ...queryParams, ...pagination },
      props.currentProject.globalEntityId,
    )
      .then((res) => {
        console.log(res.data.result);
        const result = res.data.result.map((file) => ({
          ...file,
          key: file.storage_id,
        }));
        console.log(result);
        const greenroomFiles = result.filter(
          (file) => file.zone === 'greenroom',
        );
        const coreFiles = result.filter((file) => file.zone === 'core');
        setFiles({ all: result, greenroom: greenroomFiles, core: coreFiles });

        // use value total_per_zone to set these values
        setGreenRoomTotal(greenroomFiles.length);
        setCoreTotal(coreFiles.length);

        // if (query['zone']['value'] === 'greenroom') {
        //   setGreenRoomTotal(res.data.total);
        // } else if (query['zone']['value'] === 'core') {
        //   setCoreTotal(res.data.total);
        // }

        // // sets up second query to query the other zone - dont need any of this logic
        // if (query['zone']['value'] === 'greenroom') {
        //   newQuery = _.cloneDeep(query);
        //   newQuery['zone']['value'] = 'core';
        //   if (permission === 'collaborator') {
        //     // collaborator can check all files/folders in core
        //     delete newQuery['display_path'];
        //   }
        // } else if (query['zone']['value'] === 'core') {
        //   newQuery = _.cloneDeep(query);
        //   newQuery['zone']['value'] = 'greenroom';
        //   if (permission === 'collaborator') {
        //     newQuery['display_path'] = {
        //       value: username,
        //       condition: 'start_with',
        //     };
        //   }
        // }
        // // this api call is to get greenroom/core total number
        // setLastSearchQuery(newQuery);
        // searchFilesAPI(
        //   { query: newQuery, ...pagination },
        //   props.currentProject.globalEntityId,
        // ).then((res) => {
        //   if (newQuery['zone']['value'] === 'greenroom') {
        //     setGreenRoomTotal(res.data.total);
        //   } else if (newQuery['zone']['value'] === 'core') {
        //     setCoreTotal(res.data.total);
        //   }
        // });
      })
      .catch(() => {
        message.error('Something went wrong while searching for files');
      })
      .finally(() => setLoading(false));
  };

  // this function might not be needed either. it makes another query to the other zone
  // const switchLocation = (pagination = {}) => {
  //   // handle the search when switch on green room and core locations.
  //   let newLastSearchQuery = _.cloneDeep(lastSearchQuery);

  //   // for (const filter of filters) {
  //   //   const payload = queryTransformer(filter);
  //   //   newLastSearchQuery[filter.category] = payload;
  //   // }
  //   let newQuery = {};
  //   searchFilesAPI(
  //     { query: newLastSearchQuery, ...pagination },
  //     props.currentProject.globalEntityId,
  //   ).then((res) => {
  //     setFiles(res.data.result);
  //     if (newLastSearchQuery['zone']['value'] === 'greenroom') {
  //       setGreenRoomTotal(res.data.total);
  //     } else if (newLastSearchQuery['zone']['value'] === 'core') {
  //       setCoreTotal(res.data.total);
  //     }
  //     setLoading(false);
  //     if (newLastSearchQuery['zone']['value'] === 'greenroom') {
  //       newQuery = _.cloneDeep(newLastSearchQuery);
  //       newQuery['zone']['value'] = 'Core';
  //       if (permission === 'collaborator') {
  //         delete newQuery['display_path'];
  //       }
  //     } else if (newLastSearchQuery['zone']['value'] === 'core') {
  //       newQuery = _.cloneDeep(newLastSearchQuery);
  //       //newQuery['zone']['value'] = 'greenroom';
  //       if (permission === 'collaborator') {
  //         newQuery['display_path'] = {
  //           value: username,
  //           condition: 'start_with',
  //         };
  //       }
  //     }
  //   });
  // };

  // this might need to be changed. both zones are now returned in one response
  useEffect(() => {
    // const validCondition = conditions.filter((el) => el.category);
    // if (validCondition.length && lastSearchQuery !== '') switchLocation();

    // TODO: uncomment when API is live
    // const filteredFiles = files.filter(file => file.zone === filters.zone)
    // setFiles(filteredFiles)
    console.log(filters);
  }, [filters]);

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
              color: '#003262',
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
