import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, CircularProgress, TextField, Stack, Card, Typography, Grid, Button ,Paper} from "@mui/material";
import { DataGrid, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import { getSettlements } from "../redux/actions/settlementsACtions";

const SettlementsPage = () => {
  const dispatch = useDispatch();
  const { loginInfo } = useSelector((state) => state.userLogin);
  const { loadingSettlements, settlements = [] } = useSelector((state) => state.settlements);

  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchDoc, setSearchDoc] = useState("");
  const [searchDate, setSearchDate] = useState("");

  useEffect(() => {
    if (settlements) {
        const mappedRows = settlements.map((row) => ({
            id: row.ID,
            docNumber: row.DocNum,
            date: row.MDate?.date ? new Date(row.MDate.date).toLocaleDateString("en-GB") : "---",
            description: row.Note,
            amount: parseFloat(row.Debit) || 0, 
            paid: parseFloat(row.Ciradet) || 0,
            rawDate: row.MDate?.date ? new Date(row.MDate.date) : null, 
        }));
        setRows(mappedRows);
        setFilteredRows(mappedRows);
    }
  }, [settlements]);

  useEffect(() => {
    let result = rows;

    if (searchDoc) {
      result = result.filter((row) => 
        String(row.docNumber).includes(searchDoc)
      );
    }

    if (searchDate) {
      result = result.filter((row) => {
        if (!row.rawDate) return false;
        const rowDate = row.rawDate;
        const rowYear = rowDate.getFullYear();
        const rowMonth = String(rowDate.getMonth() + 1).padStart(2, '0');
        const rowDay = String(rowDate.getDate()).padStart(2, '0');
        const formattedRowDate = `${rowYear}-${rowMonth}-${rowDay}`;
        return formattedRowDate === searchDate;
      });
    }

    setFilteredRows(result);
  }, [searchDoc, searchDate, rows]);

  useEffect(() => {
    if (loginInfo?.BranchID) {
        dispatch(getSettlements(loginInfo.BranchID));
    }
  }, [dispatch, loginInfo?.BranchID]);

function CustomToolbar() {
    return (
      <GridToolbarContainer sx={{ p: 1, justifyContent: 'flex-end' }}>
        <GridToolbarExport 
            sx={{ fontFamily: 'Almarai', fontWeight: 'bold' }} 
            color="primary" 
            printOptions={{
                allColumns: true,      
                includeCheckboxes: false,
                hideFooter: true,     
                hideToolbar: true,    
            }}
        />
      </GridToolbarContainer>
    );
  }

  const columns = [
    { 
      field: "docNumber", 
      headerName: "رقم المستند", 
      flex: 1, 
      minWidth: 120,
      headerAlign: 'right', 
      align: 'right' 
    },
    { 
      field: "date", 
      headerName: "التاريخ", 
      flex: 1, 
      minWidth: 120,
      headerAlign: 'right', 
      align: 'right' 
    },
    { 
      field: "description", 
      headerName: "البيان", 
      flex: 2, 
      minWidth: 250,
      headerAlign: 'right', 
      align: 'right' 
    },
    { 
      field: "amount", 
      headerName: "المدين (مطلوب)", 
      type: 'number',
      flex: 1, 
      minWidth: 130,
      headerAlign: 'center', 
      align: 'center',
      valueFormatter: (params) => params.value ? params.value.toLocaleString() : "0",
      renderCell: (params) => (
        <span style={{ color: 'red', fontWeight: 'bold' }}>
            {params.value ? params.value.toLocaleString() : "0"}
        </span>
      )
    },
    { 
      field: "paid", 
      headerName: "الدائن (مدفوع)", 
      type: 'number',
      flex: 1, 
      minWidth: 130,
      headerAlign: 'center', 
      align: 'center',
      valueFormatter: (params) => params.value ? params.value.toLocaleString() : "0",
      renderCell: (params) => (
        <span style={{ color: 'green', fontWeight: 'bold' }}>
            {params.value ? params.value.toLocaleString() : "0"}
        </span>
      )
    },
  ];

  return (
    <Box sx={{ p: 3, direction: 'rtl' }}>
      <Card sx={{ p: 3, mb: 3, borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
        <Typography variant="h6" sx={{ mb: 3, fontFamily: 'Almarai', fontWeight: 'bold', color: '#333' }}>
          البحث والفلترة في التسويات
        </Typography>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="بحث برقم المستند"
              variant="outlined"
              size="small"
              value={searchDoc}
              onChange={(e) => setSearchDoc(e.target.value)}
              sx={{ '& label': { fontFamily: 'Almarai' } }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="date"
              label="فلترة بالتاريخ"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              size="small"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              sx={{ '& label': { fontFamily: 'Almarai' } }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button 
              variant="outlined" 
              fullWidth
              onClick={() => {setSearchDoc(""); setSearchDate("");}}
              sx={{ fontFamily: 'Almarai', borderRadius: '8px' }}
            >
              إعادة تعيين الفلترة
            </Button>
          </Grid>
        </Grid>
      </Card>

      <Paper sx={{ height: 650, width: '100%', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <DataGrid
          loading={loadingSettlements}
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
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f8f9fa',
                borderBottom: '2px solid #eee'
            },
            '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #f5f5f5'
            },
            '& .MuiDataGrid-columnHeaderTitle': { 
                fontWeight: '800',
                color: '#555'
            },
          }}
        />
      </Paper>
    </Box>
  );
};

export default SettlementsPage;