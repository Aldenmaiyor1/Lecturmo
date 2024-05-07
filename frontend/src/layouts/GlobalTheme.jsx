import React from 'react';
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    background: {
      default: '#382e7f',
    },
    primary: {
      main: '#FFF3F3',
    },
    secondary: {
      main: '#FFCF60',
    },
    light: {
      main: '#FFFFFF',
    },
    grey: {
      main: '#F3F4FF',
    },
    text: {
      primary: '#2E2E2E',
    },
    icon: {
      main: '#1C89B6',
    },
    heart: {
      main: '#D74545',
    },
    lightBlue: {
      main: '#0054A1',
    },
    verifiedIcon: {
      main: '#3897F0',
    },
  },
  shadows: {
    0: 'none',
    1: 'rgba(0, 0, 0, 0.15) 0px 30px 14px',
  },
  components: {
    MuiLinearProgress: {
      styleOverrides: {
        bar: {
          backgroundColor: '#382e7f',
        },
        root: {
          backgroundColor: '#E2E2E2',
          height: '8px',
          borderRadius: '15px',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'black !important',
            borderWidth: '1.5px',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            color: 'black',
          },
        },
      },
    },
  },
  typography: {
    button: {
      textTransform: 'none',
    },
  },
});
