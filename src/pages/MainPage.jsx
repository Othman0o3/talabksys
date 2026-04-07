import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  Box, Grid, Typography, CircularProgress, Card, CardContent,
  Container, TextField, Button, Avatar, List, ListItem, 
  ListItemIcon, ListItemText, ListItemButton, Paper
} from "@mui/material";

// Actions & Constants
import { 
  getMainOrdersSummary, 
  getOrdersAll 
} from "../redux/actions/orderActions";
import { CONFIRM_ADD_ORDER_MESSAGE } from "../redux/constants/orderConstants";
import OrderSavedMessage from "../components/dialogs/OrderSavedMessage";
import OrdersDataGrid from "../components/OrdersTable"; 

// Icons
import EqualizerIcon from "@mui/icons-material/Equalizer";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import ReplyAllIcon from "@mui/icons-material/ReplyAll";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import StorefrontIcon from "@mui/icons-material/Storefront";
import BarChartIcon from "@mui/icons-material/BarChart";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

const StatCard = ({ title, value, icon, color, onClick }) => (
  <Card 
    onClick={onClick}
    sx={{ 
      borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0',
      cursor: onClick ? 'pointer' : 'default', transition: 'all 0.3s ease', height: '100%',
      '&:hover': onClick ? { transform: 'translateY(-5px)', borderColor: color, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' } : {}
    }}
  >
    <CardContent sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Avatar sx={{ bgcolor: `${color}15`, color: color, width: 35, height: 35 }}>
          {React.cloneElement(icon, { sx: { fontSize: 20 } })}
        </Avatar>
        <Typography variant="caption" sx={{ fontWeight: 700, color: '#555', fontFamily: 'Almarai' }}>{title}</Typography>
      </Box>
      <Typography variant="h5" sx={{ fontWeight: 800, textAlign: 'right', fontFamily: 'Almarai' }}>{value}</Typography>
    </CardContent>
  </Card>
);

const MainPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchID, setSearchID] = useState("");

  const { loginInfo } = useSelector((state) => state.userLogin);
  const { loadingMainOrdersSummary, mainOrdersSummary } = useSelector((state) => state.mainOrdersSummary);
  const { loadingOrders, orders } = useSelector((state) => state.orders);
  
  const [rows, setRows] = useState([]);

  const handleTrack = () => {
    if (searchID.trim()) navigate(`/tracking/${searchID.trim()}`);
  };

  useEffect(() => {
    if (loginInfo?.BranchID) {
      dispatch(getMainOrdersSummary(loginInfo.BranchID));
      dispatch(getOrdersAll(loginInfo.BranchID, 0, 10)); 
    }
    return () => { dispatch({ type: CONFIRM_ADD_ORDER_MESSAGE }); };
  }, [dispatch, loginInfo]);

  useEffect(() => {
    if (orders && orders.length > 0) {
      const lastTen = orders.slice(0, 10); 
      setRows(lastTen.map((row) => ({
        id: row.ID,
        orderNumber: row.ID,
        date: row.ShDate?.date ? new Date(row.ShDate.date).toLocaleDateString("en-GB") : "",
        customerName: row.CoName,
        state: row.ScName,
        city: row.CName,
        phone1: row.Tel1,
        DelegateNumber1: row.DelegateNumber1,
        DelegateNumber2: row.DelegateNumber2,
      })));
    }
  }, [orders]);

  const getSummaryVal = (key) => mainOrdersSummary?.kind1?.[0]?.[key] || 0;

  const statusCards = [
    { label: "اليوم", key: "Count_todayk1", icon: <AccessTimeIcon />, color: "#2196f3" },
    { label: "تحت الإجراء", key: "Count_case1k1", icon: <ManageHistoryIcon />, color: "#ff9800" },
    { label: "قيد الشحن", key: "Count_case3k1", icon: <LocalShippingIcon />, color: "#9c27b0" },
    { label: "تم تسليمها", key: "Count_case4k1", icon: <ShoppingBagIcon />, color: "#4caf50" },
    { label: "راجع", key: "Count_case7k1", icon: <ReplyAllIcon />, color: "#f44336" },
    { label: "تم الإسترداد", key: "Count_case10k1", icon: <SettingsBackupRestoreIcon />, color: "#e91e63" },
    { label: "تم تسويتها", key: "Count_case5k1", icon: <TaskAltIcon />, color: "#009688" },
  ];

  return (
    <Box sx={{ bgcolor: '#fbfbfb', minHeight: '100vh', py: 4, direction: 'rtl' }}>
      <OrderSavedMessage />
      <Container maxWidth="xl">
        
        <Box sx={{ textAlign: 'center', mb: 6, mt: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, fontFamily: 'Almarai' }}>تتبع شحنتك</Typography>
          <Paper elevation={0} sx={{ display: 'flex', mx: 'auto', maxWidth: 600, borderRadius: '50px', p: 0.8, border: '1px solid #ddd' }}>
            <TextField 
              fullWidth placeholder="رقم الشحنة..." value={searchID}
              onChange={(e) => setSearchID(e.target.value)}
              variant="standard" 
              InputProps={{ disableUnderline: true, sx: { px: 3, fontFamily: 'Almarai' } }}
            />
            <Button variant="contained" onClick={handleTrack} sx={{ bgcolor: 'primary.main', borderRadius: '50px', px: 4 }}>تتبع</Button>
          </Paper>
        </Box>

        {loadingMainOrdersSummary ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
        ) : (
          <>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6} md={6}><StatCard title="إجمالي الطلبيات" value={getSummaryVal('Total_k1')} icon={<EqualizerIcon />} color="#1976d2" /></Grid>
              <Grid item xs={6} md={6}><StatCard title="المحفظة" value={`${parseFloat(getSummaryVal('almahfaza')).toLocaleString()} د.ل`} icon={<AttachMoneyIcon />} color="#2e7d32" /></Grid>
            </Grid>

            <Grid container spacing={1.5} sx={{ mb: 5 }}>
              {statusCards.map((item, index) => (
                <Grid item xs={6} sm={4} md={3} lg={1.7} key={index} sx={{ flexGrow: 1 }}>
                  <StatCard title={item.label} value={getSummaryVal(item.key)} icon={item.icon} color={item.color} onClick={() => navigate("/orders")} />
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} lg={9}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: 'Almarai' }}>آخر 10 طلبيات</Typography>
                  <Button endIcon={<KeyboardArrowLeftIcon />} onClick={() => navigate("/orders")} sx={{ fontWeight: 'bold' }}>عرض السجل الكامل</Button>
                </Box>
                <OrdersDataGrid 
                  rows={rows} 
                  loading={loadingOrders} 
                  hideFooter={true} 
                  onRowClick={(p) => navigate(`/order-details/${p.row.id}`)}
                />
              </Grid>

              <Grid item xs={12} lg={3}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, fontFamily: 'Almarai' }}>إجراءات سريعة</Typography>
                <Paper sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid #f0f0f0' }}>
                  <List disablePadding>
                    <ListItem disablePadding divider>
                      <ListItemButton onClick={() => navigate("/order-details")} sx={{ py: 2 }}>
                        <ListItemIcon><AddCircleOutlineIcon color="primary" /></ListItemIcon>
                        <ListItemText primary="إضافة طلب جديد" primaryTypographyProps={{ fontWeight: 700, fontFamily: 'Almarai' }} />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding divider>
                      <ListItemButton onClick={() => navigate("/orders")} sx={{ py: 2 }}>
                        <ListItemIcon><StorefrontIcon color="primary" /></ListItemIcon>
                        <ListItemText primary="جميع الطلبيات" primaryTypographyProps={{ fontWeight: 700, fontFamily: 'Almarai' }} />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => navigate("/settlements")} sx={{ py: 2 }}>
                        <ListItemIcon><BarChartIcon color="primary" /></ListItemIcon>
                        <ListItemText primary="التسويات المالية" primaryTypographyProps={{ fontWeight: 700, fontFamily: 'Almarai' }} />
                      </ListItemButton>
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
};
export default MainPage;