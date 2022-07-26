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
import variables from './base.scss';

const blank = '#EBEDF0';

export default {
  groupedColumnLine: {
    column: [variables.primaryColor2, variables.primaryColorLight1],
    line: variables.primaryColor4,
  },
  stackedAreaPlot: [variables.primaryColor2, variables.primaryColorLight1],
  heatgraph: {
    range: {
      green: [
        blank,
        variables.primaryColorLightest2,
        variables.primaryColorLight2,
        variables.primaryColor2,
        variables.primaryColorDark2,
      ],
      blue: [
        blank,
        variables.primaryColorLightest1,
        variables.primaryColorLight1,
        variables.primaryColor1,
        variables.primaryColorDark1,
      ],
      red: [
        blank,
        variables.primaryColorLightest3,
        variables.primaryColorLight3,
        variables.primaryColor3,
        variables.primaryColorDark3,
      ],
      orange: [
        blank,
        variables.primaryColorLightest4,
        variables.primaryColorLight4,
        variables.primaryColor4,
        variables.primaryColorDark4,
      ],
    },
  },
};
