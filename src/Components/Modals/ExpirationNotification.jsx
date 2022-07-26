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
import { tokenTimer } from '../../Service/keycloak';

const getText = (accTimeRemain, isRefreshed) => {
  if (isRefreshed) {
    return 'Your session is now refreshed!';
  } else {
    return (
      <>
        {' '}
        <span>If no more actions, Your session will expire in </span>{' '}
        <b>{accTimeRemain > 0 ? accTimeRemain : 0}</b>s{' '}
      </>
    );
  }
};

function ExpirationNotification({ getIsSessionMax, isRefreshed }) {
  const [timeRemain, setTimeRemain] = useState(
    tokenTimer.getRefreshRemainTime(),
  );
  const [accTimeRemain, setAccTimeRemain] = useState(
    tokenTimer.getAccessRemainTime(),
  );
  const [isSessionMax, setIsSessionMax] = useState(getIsSessionMax());
  useEffect(() => {
    const condition = () => true;
    tokenTimer.addListener({
      func: () => {
        setIsSessionMax(getIsSessionMax());
        setTimeRemain(tokenTimer.getRefreshRemainTime());
        setAccTimeRemain(tokenTimer.getAccessRemainTime());
      },
      condition,
    });
    // eslint-disable-next-line
  }, []);
  const text = isSessionMax
    ? `You are reaching the max allowed session time in ${
        timeRemain > 0 ? timeRemain : 0
      }`
    : getText(accTimeRemain, isRefreshed);
  return <>{text}</>;
}

export default ExpirationNotification;
