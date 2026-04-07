import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    Box, CircularProgress, TextField, Stack, Card, 
    Typography, Grid, Button, Paper, InputAdornment 
} from "@mui/material";
import { DataGrid, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import SearchIcon from '@mui/icons-material/Search';
import InventoryIcon from '@mui/icons-material/Inventory';

// Actions
import { getInventory } from "../redux/actions/InventoryActions";

const InventoryPage = () => {
  const dispatch = useDispatch();

  const { loginInfo } = useSelector((state) => state.userLogin);
  const { loadingInventory, inventory = [] } = useSelector((state) => state.inventory);

  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchNumber, setSearchNumber] = useState("");

  // 1. معالجة البيانات القادمة من الـ Redux
  useEffect(() => {
    const mappedRows = inventory
      .filter((row) => row.Balance > 0) // عرض فقط الأصناف المتوفرة
      .map((row) => ({
        id: row.ID,
        number: row.ID,
        name: row.Name,
        balance: parseFloat(row.Balance),
      }));
    setRows(mappedRows);
    setFilteredRows(mappedRows);
  }, [inventory]);

  // 2. منطق البحث والفلترة المحلي
  useEffect(() => {
    let result = rows;

    if (searchNumber) {
      result = result.filter((row) => 
        row.number.toString().includes(searchNumber)
      );
    }

    if (searchName) {
      result = result.filter((row) => 
        row.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    setFilteredRows(result);
  }, [searchNumber, searchName, rows]);

  useEffect(() => {
    if (loginInfo?.BranchID) {
      dispatch(getInventory(loginInfo.BranchID));
    }
  }, [dispatch, loginInfo.BranchID]);

  function CustomToolbar() {
    return (
      <GridToolbarContainer sx={{ p: 1 }}>
        <GridToolbarExport sx={{ fontFamily: 'Almarai' }} color="primary" />
      </GridToolbarContainer>
    );
  }

  const columns = [
    { 
      field: "number", 
      headerName: "رقم الصنف", 
      flex: 1, 
      minWidth: 120,
      renderCell: (params) => <span style={{ fontWeight: 'bold' }}>#{params.value}</span>
    },
    { 
      field: "name", 
      headerName: "إسم المنتج", 
      flex: 2, 
      minWidth: 300 
    },
    { 
      field: "balance", 
      headerName: "الرصيد المتاح", 
      flex: 1, 
      minWidth: 150,
      renderCell: (params) => (
        <Box 
          sx={{ 
            bgcolor: params.value < 10 ? '#fff3e0' : '#e8f5e9', 
            color: params.value < 10 ? '#ef6c00' : '#2e7d32',
            px: 2, py: 0.5, borderRadius: '12px', fontWeight: '900'
          }}
        >
          {params.value.toLocaleString()}
        </Box>
      )
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, direction: 'rtl' }}>
      
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <InventoryIcon color="primary" />
        <Typography variant="h5" fontWeight="800" sx={{ fontFamily: 'Almarai' }}>
            مخزون المنتجات
        </Typography>
      </Stack>

      <Card sx={{ p: 2, mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontFamily: 'Almarai', fontWeight: 'bold' }}>
            أدوات البحث
            </Typography>
            <Button 
                variant="outlined" 
                size="small"
                onClick={() => {setSearchName(""); setSearchNumber("");}}
                sx={{ fontFamily: 'Almarai', borderRadius: '8px' }}
            >
                إعادة تعيين
            </Button>
        </Stack>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="بحث برقم الصنف"
              variant="outlined"
              size="small"
              value={searchNumber}
              onChange={(e) => setSearchNumber(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
              }}
              sx={{ '& label': { fontFamily: 'Almarai' } }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="بحث باسم المنتج"
              variant="outlined"
              size="small"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
              }}
              sx={{ '& label': { fontFamily: 'Almarai' } }}
            />
          </Grid>
        </Grid>
      </Card>

      <Paper elevation={0} sx={{ height: 650, width: '100%', borderRadius: 3, overflow: 'hidden', border: '1px solid #eee' }}>
        <DataGrid
          loading={loadingInventory}
          rows={filteredRows}
          columns={columns}
          slots={{ toolbar: CustomToolbar }}
          initialState={{
            pagination: { paginationModel: { pageSize: 50 } },
          }}
          pageSizeOptions={[50, 100]}
          disableRowSelectionOnClick
          sx={{
            fontFamily: 'Almarai',
            '& .MuiDataGrid-columnHeader': {
                bgcolor: '#f8f9fa',
                color: '#333',
                fontWeight: '900'
            },
            '& .MuiDataGrid-cell:hover': {
                color: 'primary.main',
            },
            border: 'none',
          }}
        />
      </Paper>
    </Box>
  );
};

export default InventoryPage;