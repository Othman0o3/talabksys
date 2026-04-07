// src/theme.js (or any suitable filename)
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  direction: "rtl",

  palette: {
    primary: {
      main: "#dd2429",
    },
  },

  typography: {
    fontFamily: "Changa", // Set your custom font-family here
    fontSize: 14,
  },

  components: {
    MuiDataGrid: {
      defaultProps: {
        localeText: {
          noRowsLabel: "لا توجد بيانات", // Custom "No rows" text in Arabic
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          backgroundColor: "#fff",
        }),
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          backgroundColor: "#fff",
        }),
      },
    },
  },
});
const talabkTheme = createTheme({
  palette: {
    primary: {
      main: '#D32F2F', 
    },
    secondary: {
      main: '#1A1A1A', 
    },
    background: {
      default: '#F5F5F5', 
    },
  },typography: {
    fontFamily: [
      'Almarai',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  shape: {
    borderRadius: 10, 
  },
  direction: 'rtl',
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', 
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', 
          fontWeight: 'bold',
        },
      },
    },
  },
});

export default talabkTheme;
