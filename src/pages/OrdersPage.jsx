import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  Box, IconButton, CircularProgress, TextField, Button, 
  Paper, Typography, Stack, Chip, InputAdornment 
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CustomDatePicker from "../components/CustomDatePicker";

// Icons
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ClearIcon from "@mui/icons-material/Clear";

// Actions
import {
  changeOrderSearchType,
  getOrdersAll,
  getOrdersByDate,
} from "../redux/actions/orderActions";
import { setOrdersSearchDate } from "../redux/actions/systemActions";
import OrderSavedMessage from "../components/dialogs/OrderSavedMessage";

const getStatusStyle = (status) => {
  const styles = {
    "تم التسليم": { color: "success" },
    "تمت التسوية": { color: "success" },
    "مكتمل": { color: "success" },
    "تحت الاجراء": { color: "info" },
    "قيد التنفيذ": { color: "info" },
    "قيد الشحن": { color: "secondary" },
    "راجع في الطريق الى الفرع": { color: "secondary" },
    "راجع": { color: "error" },
    "تم الالغاء": { color: "error" },
    "تم الاسترداد": { color: "warning" },
    "في المكتب انتظار الاستلام": { color: "default" },
    "تأجيل": { color: "default" },
  };
  return styles[status] || { color: "default" };
};

const OrdersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loginInfo } = useSelector((state) => state.userLogin);
  const { loadingOrders, orders, totalRecords } = useSelector((state) => state.orders);
  const { dateFrom, dateTo } = useSelector((state) => state.ordersSearchDate);

  const [rows, setRows] = useState([]);
  const [localDateFrom, setLocalDateFrom] = useState(dateFrom);
  const [localDateTo, setLocalDateTo] = useState(dateTo);
  const [searchText, setSearchText] = useState("");
  const [isDateSearching, setIsDateSearching] = useState(false);

  const columns = [
    { field: "orderNumber", headerName: "رقم الطلب", width: 100, renderCell: (p) => <strong>#{p.value}</strong> },
    { field: "date", headerName: "التاريخ", width: 120 },
    { field: "customerName", headerName: "اسم العميل", width: 200 },
    { field: "state", headerName: "الحالة", width: 180,
      renderCell: (params) => {
        const style = getStatusStyle(params.value);
        return <Chip label={params.value} color={style.color} size="small" sx={{ fontWeight: 'bold', fontFamily: 'Almarai' }} />;
      }
    },
    { field: "phone1", headerName: "الهاتف 1", width: 130 },
    { field: "phone2", headerName: "الهاتف 2", width: 130 },
    { field: "city", headerName: "المدينة", width: 120 },
    { field: "address", headerName: "العنوان", width: 300 },
    { field: "DelegateNumber1", headerName: "رقم المندوب 1", width: 150 },
    { field: "DelegateNumber2", headerName: "رقم المندوب 2", width: 150 },
    { field: "returnState", headerName: "الإرجاع", width: 130 },
    { field: "reason", headerName: "السبب", width: 250 },
  ];

  const handleSearch = () => {
    setIsDateSearching(true);
    dispatch(changeOrderSearchType("date"));
    dispatch(getOrdersByDate(loginInfo.BranchID, localDateFrom, localDateTo));
  };

  useEffect(() => {
    if (orders) {
      setRows(orders.map((row) => ({
        id: row.ID,
        orderNumber: row.ID,
        date: new Date(row.ShDate.date).toLocaleDateString("en-GB"),
        customerName: row.CoName,
        state: row.ScName,
        phone1: row.Tel1,
        phone2: row.Tel2,
        address: row.Adress,
        DelegateNumber1: row.DelegateNumber1, 
        DelegateNumber2: row.DelegateNumber2,
        city: row.CName,
        returnState: row.ReName,
        reason: row.ResText,
      })));
    }
  }, [orders]);

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', direction: 'rtl', p: { xs: 2, md: 4 } }}>
      <OrderSavedMessage />
      
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
              <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <ArrowBackIosNewIcon sx={{ fontSize: 18, color: 'var(--primary-color)' }} />
              </IconButton>
              <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'Almarai' }}>قائمة الطلبيات</Typography>
          </Stack>
          <Button variant="contained" startIcon={<AddIcon sx={{ ml: 1 }} />} sx={{ bgcolor: 'var(--primary-color)', borderRadius: '10px' }} onClick={() => navigate("/order-details")}>
              إضافة طلب
          </Button>
        </Stack>
        
        <Paper sx={{ p: 2, borderRadius: '16px' }}>
          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} alignItems="center">
            <TextField 
                fullWidth 
                placeholder="بحث..." 
                size="small" 
                value={searchText} 
                onChange={(e) => setSearchText(e.target.value)} 
                InputProps={{
                    startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'var(--primary-color)' }} /></InputAdornment>,
                    endAdornment: searchText && <IconButton onClick={() => setSearchText("")} size="small"><ClearIcon /></IconButton>
                }}
            />
            <Stack direction="row" spacing={1} alignItems="center">
                <CustomDatePicker label="من" value={localDateFrom} setValue={setLocalDateFrom} />
                <Typography sx={{ color: '#ccc' }}>—</Typography>
                <CustomDatePicker label="إلى" value={localDateTo} setValue={setLocalDateTo} />
            </Stack>
            <Button variant="contained" onClick={handleSearch} sx={{ bgcolor: 'var(--primary-color)', px: 4, height: '40px' }}>بحث</Button>
          </Stack>
        </Paper>
      </Box>

      <Paper sx={{ borderRadius: '16px', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
        {loadingOrders ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}><CircularProgress /></Box>
        ) : (
            <Box sx={{ width: '100%', overflowX: 'auto' }}> 
                <Box sx={{ minWidth: 1800 }}> 
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        autoHeight
                        paginationMode={!isDateSearching ? "server" : "client"}
                        rowCount={totalRecords || 0}
                        pageSizeOptions={[50]}
                        initialState={{ pagination: { paginationModel: { pageSize: 50 } } }}
                        disableRowSelectionOnClick
                        onRowClick={(e) => navigate(`/order-details/${e.row.id}`)}
                        sx={{
                            border: 'none',
                            '& .MuiDataGrid-main': {
                                overflow: 'visible', 
                            },
                            '& .MuiDataGrid-columnHeaders': { 
                                bgcolor: '#fafafa', 
                                fontFamily: 'Almarai',
                                borderBottom: '1px solid #eee'
                            },
                            '& .MuiDataGrid-cell': { fontFamily: 'Almarai' },
                            '& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell': {
                                position: 'relative !important',
                            }
                        }}
                    />
                </Box>
            </Box>
        )}
      </Paper>
    </Box>
  );
};

export default OrdersPage;