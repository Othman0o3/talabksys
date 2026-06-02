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
  changeStoreOrderSearchType,
  getStoreOrdersAll,
  getStoreOrdersByDate,
  getStoreOrdersByType,
  searchStoreOrdersByText,
} from "../redux/actions/orderActions";
import { CONFIRM_ADD_STORE_ORDER_MESSAGE } from "../redux/constants/orderConstants";
import StoreOrderSavedMessage from "../components/dialogs/StoreOrderSavedMessage";

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

const StoreOrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loginInfo } = useSelector((state) => state.userLogin);
  const {
    loadingStoreOrders,
    storeOrders,
    type,
    totalRecords,
  } = useSelector((state) => state.storeOrders);

  const { dateFrom, dateTo } = useSelector(
    (state) => state.storeOrdersSearchDate
  );

  // States
  const [rows, setRows] = useState([]);
  const [localDateFrom, setLocalDateFrom] = useState(dateFrom);
  const [localDateTo, setLocalDateTo] = useState(dateTo);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 50,
  });
  const [isDateSearching, setIsDateSearching] = useState(false);

  // Columns Definition
  const columns = [
    { field: "orderNumber", headerName: "رقم الطلب", width: 120, renderCell: (p) => <strong>#{p.value}</strong> },
    { field: "date", headerName: "التاريخ", width: 130 },
    { field: "customerName", headerName: "اسم العميل", width: 220 },
    { 
      field: "state", 
      headerName: "الحالة", 
      width: 170,
      renderCell: (params) => {
        const style = getStatusStyle(params.value);
        return <Chip label={params.value} color={style.color} size="small" sx={{ fontWeight: 'bold', fontFamily: 'Almarai' }} />;
      }
    },
    { field: "city", headerName: "المدينة", width: 130 },
    { field: "phone1", headerName: "الهاتف 1", width: 130 },
    { field: "address", headerName: "العنوان", width: 250 },
    { field: "returnState", headerName: "الإرجاع", width: 150 },
    { field: "reason", headerName: "السبب", width: 200 },
  ];

  // Handlers
  const handleSearchByDate = () => {
    setIsDateSearching(true);
    dispatch(changeStoreOrderSearchType("date"));
    dispatch(getStoreOrdersByDate(loginInfo.BranchID, localDateFrom, localDateTo));
  };

  const handleSearchByText = () => {
    if (searchText) {
        dispatch(searchStoreOrdersByText(loginInfo.BranchID, searchText));
    }
  };

  const handlePaginationChange = (model) => {
    if (isDateSearching) return;
    const page = model.page;

    switch (type) {
      case "all": dispatch(getStoreOrdersAll(loginInfo.BranchID, page)); break;
      case "today": dispatch(getStoreOrdersByType(loginInfo.BranchID, 0, true, page)); break;
      case "delivered": dispatch(getStoreOrdersByType(loginInfo.BranchID, 4, false, page)); break;
      case "proccessing": dispatch(getStoreOrdersByType(loginInfo.BranchID, 1, false, page)); break;
      case "done": dispatch(getStoreOrdersByType(loginInfo.BranchID, 5, false, page)); break;
      case "shipping": dispatch(getStoreOrdersByType(loginInfo.BranchID, 3, false, page)); break;
      case "returned": dispatch(getStoreOrdersByType(loginInfo.BranchID, 10, false, page)); break;
      case "returnedBack": dispatch(getStoreOrdersByType(loginInfo.BranchID, 7, false, page)); break;
      default: dispatch(getStoreOrdersAll(loginInfo.BranchID, page));
    }
    setPagination(model);
  };

  // --- Row Click Handler ---
  const handleRowClick = (params) => {
    // Navigate to the order details page using the row's ID
    // Based on your previous code, it seems to be '/order-view/' for marketer orders,
    // but the button above uses '/store-order-details'. 
    // I will use '/order-view/' as it matches the OrderDetailsView component we worked on earlier.
    // If your route is different, please adjust the path below.
    navigate(`/store-order-details/${params.id}`);
  };

  useEffect(() => {
    if (storeOrders) {
      setRows(storeOrders.map((row) => ({
        id: row.ID,
        orderNumber: row.ID,
        date: new Date(row.ShDate.date).toLocaleDateString("en-GB"),
        customerName: row.CoName,
        state: row.ScName,
        phone1: row.Tel1,
        phone2: row.Tel2,
        address: row.Adress,
        city: row.CName,
        returnState: row.ReName,
        reason: row.ResText,
      })));
    } else {
      setRows([]);
    }
  }, [storeOrders]);

  useEffect(() => {
    !isDateSearching && handlePaginationChange(pagination);
    return () => {
      dispatch({ type: CONFIRM_ADD_STORE_ORDER_MESSAGE });
    };
  }, []);

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', direction: 'rtl', p: { xs: 2, md: 4 } }}>
      <StoreOrderSavedMessage />
      
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
              <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <ArrowBackIosNewIcon sx={{ fontSize: 18, color: 'var(--primary-color)' }} />
              </IconButton>
              <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'Almarai' }}>طلبيات المخزن</Typography>
          </Stack>
          <Button 
            variant="contained" 
            startIcon={<AddIcon sx={{ ml: 1 }} />} 
            sx={{ bgcolor: 'var(--primary-color)', borderRadius: '10px', px: 3 }} 
            onClick={() => navigate("/store-order-details")}
          >
              إضافة طلبية مخزن
          </Button>
        </Stack>
        
        <Paper sx={{ p: 2, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} alignItems="center">
            <TextField 
                fullWidth 
                placeholder="رقم الطلبية، الهاتف، أو اسم المستلم..." 
                size="small" 
                value={searchText} 
                onChange={(e) => setSearchText(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && handleSearchByText()}
                InputProps={{
                    startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'var(--primary-color)' }} /></InputAdornment>,
                    endAdornment: searchText && (
                        <IconButton onClick={() => setSearchText("")} size="small"><ClearIcon /></IconButton>
                    )
                }}
            />
            <Stack direction="row" spacing={1} alignItems="center" sx={{ width: { xs: '100%', lg: 'auto' } }}>
                <CustomDatePicker label="من" value={localDateFrom} setValue={setLocalDateFrom} />
                <Typography sx={{ color: '#ccc' }}>—</Typography>
                <CustomDatePicker label="إلى" value={localDateTo} setValue={setLocalDateTo} />
            </Stack>
            <Button 
                variant="contained" 
                onClick={handleSearchByDate} 
                sx={{ bgcolor: 'var(--primary-color)', px: 4, height: '40px', borderRadius: '8px', minWidth: '120px' }}
            >
                بحث 
            </Button>
          </Stack>
        </Paper>
      </Box>

      <Paper sx={{ borderRadius: '16px', border: '1px solid #f0f0f0', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        {loadingStoreOrders ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}><CircularProgress /></Box>
        ) : (
            <Box sx={{ width: '100%' }}> 
                <DataGrid
                    rows={rows}
                    columns={columns}
                    autoHeight
                    density="compact"
                    paginationMode={!isDateSearching ? "server" : "client"}
                    rowCount={totalRecords || 0}
                    pageSizeOptions={[50]}
                    paginationModel={pagination}
                    onPaginationModelChange={handlePaginationChange}
                    disableRowSelectionOnClick
                    onRowClick={handleRowClick}
                    sx={{
                        border: 'none',
                        fontFamily: 'Almarai',
                        '& .MuiDataGrid-columnHeaders': { 
                            bgcolor: '#fafafa', 
                            borderBottom: '1px solid #eee',
                            fontWeight: 'bold'
                        },
                        '& .MuiDataGrid-cell': { 
                            borderBottom: '1px solid #f5f5f5',
                            cursor: 'pointer' 
                        },
                        '& .MuiDataGrid-footerContainer': {
                            borderTop: '1px solid #eee'
                        }
                    }}
                />
            </Box>
        )}
      </Paper>
    </Box>
  );
};

export default StoreOrderPage;