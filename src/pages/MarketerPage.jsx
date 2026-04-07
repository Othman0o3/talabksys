import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Grid, Box, CircularProgress, Button, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import StatCard from '../components/StatCard';
import EqualizerIcon from "@mui/icons-material/Equalizer";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import StorefrontIcon from '@mui/icons-material/Storefront';
import { getMarketerSummary , getMarketerOrders} from '../redux/actions/orderActions';

const MarketerPage = () => {
const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false); 
  
  const userLogin = useSelector((state) => state.userLogin); 
  const { loginInfo } = userLogin; 

  const marketerSummary = useSelector((state) => state.marketerSummary) || {};
  const { loading, summary, error } = marketerSummary;

  const marketerOrders = useSelector((state) => state.marketerOrders) || { orders: [] };

useEffect(() => {
    if (loginInfo && loginInfo.BranchID) {
        const id = loginInfo.BranchID;
        dispatch(getMarketerSummary(id));
        dispatch(getMarketerOrders(loginInfo.BranchID, false));
    }
  }, [dispatch, loginInfo]);

const columns = [
  { field: 'ID', headerName: 'رقم الشحنة', width: 100 },
  { field: 'ShName', headerName: 'المتجر', width: 150 },
  { field: 'CoName', headerName: 'الزبون', width: 180 },  
  { field: 'Tel1', headerName: 'الهاتف', width: 130 },
  { field: 'Total', headerName: 'إجمالي الطلب', width: 120, renderCell: (params) => `${params.value} د.ل` },
  { 
    field: 'ShCase', 
    headerName: 'الحالة', 
    width: 130,
    renderCell: (params) => {
      return params.value === 4 ? "تم التسليم" : "قيد التنفيذ";
    }
  },
];
const safeRows = Array.isArray(marketerOrders?.orders) 
  ? marketerOrders.orders.filter(row => typeof row === 'object' && row !== null && row.ID !== undefined) 
  : [];
  return (
    <Container maxWidth="xl" sx={{ py: 4, direction: 'rtl' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'Almarai' }}>
                مرحباً، {loginInfo?.UserName || 'المسوق'}
            </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
        onClick={() => navigate('/اضافة طلب')}
          sx={{ borderRadius: 2, px: 3, fontWeight: 'bold', fontSize: '1rem' }}
        >
          طلبية جديدة
        </Button>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress sx={{ color: 'var(--primary-color)' }} />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">{error}</Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <StatCard 
                title="أرباحي (العمولة)" 
                value={`${summary?.DelgAmount || '0.00'} د.ل`} 
                icon={<AttachMoneyIcon />} 
                color="#4caf50" 
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <StatCard 
                title="طلبات اليوم" 
                value={summary?.Count_today || 0} 
                icon={<EqualizerIcon />} 
                color="#2196f3" 
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <StatCard 
                title="إجمالي الطلبيات" 
                value={summary?.Count || 0} 
                icon={<EqualizerIcon />} 
                color="#ff9800" 
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <StatCard 
                title="المتاجر المرتبطة" 
                value={summary?.stores || 0} 
                icon={<StorefrontIcon />} 
                color="#9c27b0" 
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 5 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, fontFamily: 'Almarai' }}>
              آخر الطلبيات المسجلة
            </Typography>
            <Paper sx={{ height: 400, width: '100%', borderRadius: 3, overflow: 'hidden', boxShadow: 3 }}>
              <DataGrid
                rows={safeRows}
                columns={columns}
                getRowId={(row) => row.ID}
                pageSize={5}
                loading={marketerOrders?.loading}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                sx={{
                    border: 'none',
                    fontFamily: 'Almarai',
                    '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold' }
                }}
              />
            </Paper>
          </Box>
        </>
      )}

      <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary" sx={{ fontFamily: 'Almarai' }}>
              آخر تحديث للبيانات: {new Date().toLocaleTimeString('ar-LY')}
          </Typography>
      </Box>
    </Container>
  );
};

export default MarketerPage;