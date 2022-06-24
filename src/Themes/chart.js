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
