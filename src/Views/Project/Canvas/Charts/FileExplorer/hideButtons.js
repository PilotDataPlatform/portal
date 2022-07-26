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
const MIN_MARGIN = 480;

export const hideButton = (actionBarRef, moreActionRef) => {
  if (!actionBarRef || !actionBarRef.current) {
    return 0;
  }
  if (!moreActionRef || !moreActionRef.current) {
    return 0;
  }
  const actionBar = actionBarRef.current;

  const fullWidth = actionBar.offsetWidth;
  const allButtons = actionBar.querySelectorAll(
    '.file_explorer_header_bar > button',
  );
  const allButtonsLength = allButtons.length - 1; // the "..." is not count;

  let totalWidth = 0;
  let hideIndex = allButtonsLength;
  for (let i = 0; i < allButtons.length; i++) {
    const button = allButtons[i];
    if (i === 0) {
      totalWidth += button.offsetLeft;
    }

    totalWidth += 54 + 7.2 * button.innerText.length;

    if (MIN_MARGIN > fullWidth - totalWidth) {
      hideIndex = i;
      break;
    }
  }
  for (let i = 0; i < allButtonsLength; i++) {
    const button = allButtons[i];
    if (i <= hideIndex) {
      button.style.display = 'inline-block';
    } else {
      button.style.display = 'none';
    }
  }
  const moreAction = moreActionRef.current;
  if (hideIndex + 1 >= allButtonsLength) {
    moreAction.style && (moreAction.style.display = 'none');
  } else {
    moreAction.style && (moreAction.style.display = 'inline-block');
  }
  return allButtonsLength - hideIndex - 1;
};
