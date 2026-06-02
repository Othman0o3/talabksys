import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, CircularProgress, Typography, Paper } from "@mui/material";
import { DataGrid, arSD } from "@mui/x-data-grid";

// Actions
import { 
    changeStoreOrderSearchType, 
    getShowRoomOrders 
} from "../redux/actions/orderActions";

const columns = [
  { field: "orderNumber", headerName: "رقم الطلب", width: 120, headerAlign: 'center', align: 'center' },
  { field: "date", headerName: "التاريخ", width: 160, headerAlign: 'center', align: 'center' },
  { field: "code", headerName: "الكود", width: 130, headerAlign: 'center', align: 'center' },
  { field: "item", headerName: "الصنف", flex: 1, minWidth: 200, headerAlign: 'right', align: 'right' },
  { field: "quantity", headerName: "الكمية", width: 100, headerAlign: 'center', align: 'center' },
  { 
    field: "price", 
    headerName: "السعر", 
    width: 130, 
    headerAlign: 'center', 
    align: 'center',
    valueFormatter: (params) => `${Number(params.value).toLocaleString()} د.ل`
  },
  { 
    field: "total", 
    headerName: "الإجمالي", 
    width: 150, 
    headerAlign: 'center', 
    align: 'center',
    renderCell: (params) => (
      <Typography fontWeight="bold" color="primary.main">
        {Number(params.value).toLocaleString()} د.ل
      </Typography>
    )
  },
];

const ShowRoomOrdersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loginInfo } = useSelector((state) => state.userLogin);
  const { loadingStoreOrders, storeOrders, totalRecords } = useSelector(
    (state) => state.storeOrders
  );

  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 50,
  });

  const fetchOrders = useCallback(() => {
    if (loginInfo?.BranchID) {
      dispatch(getShowRoomOrders(loginInfo.BranchID));
    }
  }, [dispatch, loginInfo?.BranchID]);

  useEffect(() => {
    dispatch(changeStoreOrderSearchType("show-room"));
    fetchOrders();

    return () => {
      dispatch(changeStoreOrderSearchType("all"));
    };
  }, [dispatch, fetchOrders]);

  useEffect(() => {
    if (storeOrders && Array.isArray(storeOrders)) {
      const mappedRows = storeOrders.map((row, index) => ({
        id: row.ID || index + 1,
        orderNumber: row.OrderNum || "---",
        date: row.IDate?.date 
          ? new Date(row.IDate.date).toLocaleDateString("en-GB") 
          : "غير متوفر",
        code: row.Code || "---",
        item: row.Name || "صنف غير معروف",
        quantity: Number(row.outcome) || 0,
        price: Number(row.Pric) || 0,
        total: (Number(row.outcome) || 0) * (Number(row.Pric) || 0),
      }));
      setRows(mappedRows);
    } else {
      setRows([]);
    }
  }, [storeOrders]);

  return (
    <Box sx={{ p: 3, direction: 'rtl' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 800, fontFamily: 'Almarai' }}>
        مبيعات المعرض (Show Room)
      </Typography>

      {loadingStoreOrders ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={0} sx={{ width: "100%", height: "70vh", border: '1px solid #eee', borderRadius: 3, overflow: 'hidden' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[50]}
            disableRowSelectionOnClick
            rowCount={totalRecords || rows.length}
            paginationMode="server" 
            localeText={arSD.components.MuiDataGrid.defaultProps.localeText}
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f8f9fa',
                color: 'var(--primary-color)',
                fontWeight: 'bold',
              },
              '& .MuiDataGrid-cell:hover': {
                color: 'primary.main',
              },
            }}
          />
        </Paper>
      )}
    </Box>
  );
};

export default ShowRoomOrdersPage;