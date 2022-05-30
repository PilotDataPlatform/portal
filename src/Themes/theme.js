import charts from './chart'
import { createTheming } from '@callstack/react-theme-provider';

const theme = {
  charts
}

const { ThemeProvider, withTheme, useTheme } = createTheming(theme)

export { ThemeProvider, withTheme, useTheme, theme };