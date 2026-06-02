import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Container, Typography, Grid, Box, CircularProgress, 
  Button, Paper, Chip 
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// Icons
import AddIcon from '@mui/icons-material/Add';
import EqualizerIcon from "@mui/icons-material/Equalizer";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import StorefrontIcon from '@mui/icons-material/Storefront';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

// Components & Actions
import StatCard from '../components/StatCard';
import { getMarketerSummary, getMarketerOrders } from '../redux/actions/orderActions';
import { getMarketerFinance } from '../redux/actions/settlementsACtions'; 

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

const MarketerPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loginInfo } = useSelector((state) => state.userLogin); 
  const marketerSummary = useSelector((state) => state.marketerSummary) || {};
  const { loading: summaryLoading, summary } = marketerSummary;
  const marketerOrders = useSelector((state) => state.marketerOrders) || { orders: [] };

  // Financial data from Redux
  const { financeData = [] } = useSelector((state) => state.marketerFinance);

  // Calculate financial data
  const { totalProfit, totalDebt } = useMemo(() => {
    const profit = financeData.reduce((acc, item) => acc + (parseFloat(item.Debit) || 0), 0);
    const orders = Array.isArray(marketerOrders?.orders) ? marketerOrders.orders : [];
    const debt = orders.reduce((acc, order) => {
        if (order.ScName === "تم التسليم") {
            return acc + (parseFloat(order.Total) || 0);
        }
        return acc;
    }, 0);
    return { totalProfit: profit, totalDebt: debt };
  }, [financeData, marketerOrders.orders]);

  useEffect(() => {
    if (loginInfo && loginInfo.BranchID) {
        const id = loginInfo.BranchID;
        dispatch(getMarketerSummary(id));
        dispatch(getMarketerOrders(id, false));
        dispatch(getMarketerFinance(id)); 
    }
  }, [dispatch, loginInfo]);

  // دالة التعامل مع الانتقال عند الضغط
  const handleSelection = (newSelectionModel) => {
    if (newSelectionModel.length > 0) {
      const selectedId = newSelectionModel[0];
      navigate(`/order-view/${selectedId}`);
    }
  };

  const columns = [
    { field: 'ID', headerName: 'رقم الشحنة', width: 100 },
    { field: 'ShName', headerName: 'المتجر', width: 150 },
    { field: 'CoName', headerName: 'الزبون', width: 180 },  
    { field: 'Tel1', headerName: 'الهاتف', width: 130 },
    { 
      field: 'Total', 
      headerName: 'إجمالي الطلب', 
      width: 120, 
      renderCell: (params) => `${Number(params.value || 0).toLocaleString()} د.ل` 
    },
    { 
      field: 'ScName', 
      headerName: 'الحالة', 
      width: 180,
      renderCell: (params) => {
        const statusText = params.value; 
        const style = getStatusStyle(statusText);
        return (
          <Chip 
            label={statusText || "غير محدد"} 
            color={style.color} 
            size="small" 
            sx={{ fontWeight: 'bold', fontFamily: 'Almarai' }} 
          />
        );
      }
    },
  ];

  const safeRows = Array.isArray(marketerOrders?.orders) 
    ? marketerOrders.orders.filter(row => typeof row === 'object' && row !== null && row.ID !== undefined) 
    : [];

  return (
    <Container maxWidth="xl" sx={{ py: 4, direction: 'rtl' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 900, fontFamily: 'Almarai' }}>
            مرحباً، {loginInfo?.UserName || 'المسوق'}
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon sx={{ ml: 1 }} />} 
          onClick={() => navigate('/اضافة طلب')}
          sx={{ borderRadius: 2, px: 3, fontWeight: 'bold', fontFamily: 'Almarai' }}
        >
          طلبية جديدة
        </Button>
      </Box>
      
      {summaryLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>
      ) : (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12} md={2.4}>
              <StatCard title="المدين" value={`${totalDebt.toLocaleString()} د.ل`} icon={<AccountBalanceWalletIcon />} color="#f44336" />
            </Grid>
            <Grid item xs={12} md={2.4}>
              <StatCard title="أرباحي (العمولة)" value={`${totalProfit.toLocaleString()} د.ل`} icon={<AttachMoneyIcon />} color="#4caf50" />
            </Grid>
            <Grid item xs={12} md={2.4}>
              <StatCard title="طلبات اليوم" value={summary?.Count_today || 0} icon={<EqualizerIcon />} color="#2196f3" />
            </Grid>
            <Grid item xs={12} md={2.4}>
              <StatCard title="إجمالي الطلبيات" value={summary?.Count || 0} icon={<EqualizerIcon />} color="#ff9800" />
            </Grid>
            <Grid item xs={12} md={2.4}>
              <StatCard title="المتاجر" value={summary?.stores || 0} icon={<StorefrontIcon />} color="#9c27b0" />
            </Grid>
          </Grid>

          <Box sx={{ mt: 5 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 800, fontFamily: 'Almarai' }}>آخر الطلبيات</Typography>
            <Paper sx={{ width: '100%', borderRadius: 3, overflow: 'hidden', border: '1px solid #eee' }}>
              <DataGrid
                rows={safeRows}
                columns={columns}
                getRowId={(row) => row.ID}
                autoHeight
                pageSize={10}
                loading={marketerOrders?.loading}
                onRowSelectionModelChange={handleSelection}
                sx={{
                    border: 'none',
                    fontFamily: 'Almarai',
                    '& .MuiDataGrid-row': { 
                      cursor: 'pointer',
                      touchAction: 'manipulation' 
                    },
                    '& .MuiDataGrid-cell:focus': {
                      outline: 'none'
                    },
                    '& .MuiDataGrid-columnHeaders': { backgroundColor: '#fafafa' }
                }}
              />
            </Paper>
          </Box>
        </>
      )}
    </Container>
  );
};

export default MarketerPage;