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
import React from 'react';

export function DeleteModalFirstStep(props) {
  const {
    panelKey,
    authorizedFilesToDelete,
    unauthorizedFilesToDelete,
  } = props;
  let trashPath = getTargetTrashPath(panelKey);

  return (
    <>
      {' '}
      <SkippedFiles
        unauthorizedFilesToDelete={unauthorizedFilesToDelete}
      />{' '}
      <ToDeleteFiles authorizedFilesToDelete={authorizedFilesToDelete} />
    </>
  );
}

/**
 *
 * @param {string} panelKey
 * @returns {"Green Room"|"Core"}
 */
function getTargetTrashPath(panelKey) {
  let trashPath = 'Green Room';
  const currentPanelArray = panelKey ? panelKey.split('-') : [];
  if (currentPanelArray.length > 0 && currentPanelArray[0] !== 'greenroom')
    trashPath = 'Core';
  return trashPath;
}

function SkippedFiles({ unauthorizedFilesToDelete }) {

  if (unauthorizedFilesToDelete.length === 0) {
    return null;
  } else if (unauthorizedFilesToDelete?.length === 1) {
    return (
      <p>{`${unauthorizedFilesToDelete[0].fileName} will be skipped. Because it is uploaded by other user.`}</p>
    );
  }

  return (
    <p>{`${unauthorizedFilesToDelete.length} file(s)/folder(s) will be skipped. Because these files are uploaded by other users.`}</p>
  );
}

function ToDeleteFiles({ authorizedFilesToDelete }) {

  if (authorizedFilesToDelete.length === 0) {
    return null;
  } else if (authorizedFilesToDelete.length === 1) {
    return (
      <p>{`${authorizedFilesToDelete[0].fileName} will be sent to Trash Bin`}</p>
    );
  }

  return (
    <div>
      <p>{`The following ${authorizedFilesToDelete.length} file(s)/folder(s) will be sent to Trash Bin`}</p>

      <ul style={{ maxHeight: 90, overflowY: 'auto' }}>
        {authorizedFilesToDelete.map((v) => {
          return <li key={v.name}>{v.fileName}</li>;
        })}
      </ul>
    </div>
  );
}
