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
import { Input, Button, Select, Form, DatePicker } from 'antd';
import moment from 'moment-timezone';
const Option = Select.Option;
const { RangePicker } = DatePicker;

const dateFormat = 'YYYY-MM-DD';
const timeConvert = (timeStamp) => {
  return moment(timeStamp * 1000).format(dateFormat);
}
const defaultTimeRange = (condition) => {
  if (condition.category === 'time_created' && condition.calendar) {
    return [moment(timeConvert(condition.calendar[0]), dateFormat), moment(timeConvert(condition.calendar[1]), dateFormat)]
  } else {
    return ''
  }
}

const disabledDate = (current) => {
  return current && current >= moment().endOf('day');
};

function UploadTimeCondition({
  condition,
  updateCondition,
  clearTrigger,
  form,
}) {
  useEffect(() => {
    if (clearTrigger) {
      form.resetFields(['CalendarValues']);
    }
  }, [clearTrigger]);
  return (
    <>
      <Form.Item label="Condition" style={{ width: '200px', marginRight: 18 }}>
        <Select defaultValue="between" disabled showArrow={false}>
          <Option value="between">Between</Option>
        </Select>
      </Form.Item>
      <Form.Item
        label="Calendar"
        name="CalendarValues"
        initialValue={defaultTimeRange(condition)}
        rules={[
          {
            required: true,
          },
        ]}
        style={{ flex: 1, display: 'inline-block' }}
      >
        <RangePicker
          style={{ width: '100%', borderRadius: '6px' }}
          disabledDate={disabledDate}
          onChange={(time, timeString) => {
            if (time) {
              const timeRange = [
                time[0].startOf('day').unix(),
                time[1].endOf('day').unix(),
              ];
              updateCondition(condition.cid, {
                calendar: timeRange,
              });
            } else {
              updateCondition(condition.cid, {
                calendar: '',
              });
            }
          }}
        />
      </Form.Item>
    </>
  );
}

export default UploadTimeCondition;
