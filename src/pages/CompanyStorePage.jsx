import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  Box, Grid, Typography, CircularProgress, Card, CardContent,
  Container, Avatar, Paper, Stack
} from "@mui/material";

// Actions
import {
  changeStoreOrderSearchType,
  getMainOrdersSummary,
} from "../redux/actions/orderActions";

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

// نفس الـ StatCard المستعمل في الصفحة الرئيسية لتوحيد الثيم
const StatCard = ({ title, value, icon, color, onClick }) => (
  <Card 
    onClick={onClick}
    sx={{ 
      borderRadius: 4, 
      boxShadow: '0 4px 12px rgba(0,0,0,0.03)', 
      border: '1px solid #f0f0f0',
      cursor: onClick ? 'pointer' : 'default', 
      transition: 'all 0.3s ease', 
      height: '100%',
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

const CompanyStorePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loginInfo } = useSelector((state) => state.userLogin);
  const { loadingMainOrdersSummary, mainOrdersSummary } = useSelector(
    (state) => state.mainOrdersSummary
  );

  const openStoreOrders = (type) => {
    dispatch(changeStoreOrderSearchType(type));
    navigate("/store-order");
  };

  useEffect(() => {
    if (loginInfo?.BranchID) {
      dispatch(getMainOrdersSummary(loginInfo.BranchID));
    }
  }, [dispatch, loginInfo]);

  const getStoreVal = (key) => mainOrdersSummary?.kind2?.[0]?.[key] || 0;
  const getGeneralVal = (key) => mainOrdersSummary?.kind1?.[0]?.[key] || 0;

  const statusCards = [
    { label: "اليوم", key: "Count_todayk2", icon: <AccessTimeIcon />, type: "today", color: "#2196f3" },
    { label: "تحت الإجراء", key: "Count_case1k2", icon: <ManageHistoryIcon />, type: "proccessing", color: "#ff9800" },
    { label: "قيد الشحن", key: "Count_case3k2", icon: <LocalShippingIcon />, type: "shipping", color: "#9c27b0" },
    { label: "تم تسليمها", key: "Count_case4k2", icon: <ShoppingBagIcon />, type: "delivered", color: "#4caf50" },
    { label: "راجع", key: "Count_case7k2", icon: <ReplyAllIcon />, type: "returnedBack", color: "#f44336" },
    { label: "تم الإسترداد", key: "Count_case10k2", icon: <SettingsBackupRestoreIcon />, type: "returned", color: "#e91e63" },
    { label: "تم تسويتها", key: "Count_case5k2", icon: <TaskAltIcon />, type: "done", color: "#009688" },
  ];

  return (
    <Box sx={{ bgcolor: 'var(--background-color-2)', minHeight: '100vh', py: 4, direction: 'rtl' }}>
      <Container maxWidth="xl">
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'Almarai', color: 'var(--primary-text-color)' }}>
              لوحة تحكم مساحات التخزين
          </Typography>
          <Typography variant="body2" sx={{ color: '#777', fontFamily: 'Almarai' }}>متابعة حالة المخزن والطلبيات الحالية</Typography>
        </Box>

        {loadingMainOrdersSummary ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 10 }}>
            <CircularProgress sx={{ color: 'var(--primary-color)' }} />
          </Box>
        ) : (
          <>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6} md={6}>
                <StatCard 
                  title="إجمالي طلبيات المخزن" 
                  value={getStoreVal('Total_k2')} 
                  icon={<EqualizerIcon />} 
                  color="var(--secondary-color)" 
                />
              </Grid>
              <Grid item xs={6} md={6}>
                <StatCard 
                  title="المحفظة" 
                  value={`${parseFloat(getGeneralVal('almahfaza')).toLocaleString()} د.ل`} 
                  icon={<AttachMoneyIcon />} 
                  color="var(--primary-color)" 
                />
              </Grid>
            </Grid>

            <Grid container spacing={1.5} sx={{ mb: 4 }}>
              {statusCards.map((item, index) => (
                <Grid item xs={6} sm={4} md={3} lg={1.7} key={index} sx={{ flexGrow: 1 }}>
                  <StatCard 
                    title={item.label} 
                    value={getStoreVal(item.key)} 
                    icon={item.icon} 
                    color={item.color} 
                    onClick={() => openStoreOrders(item.type)} 
                  />
                </Grid>
              ))}
              <Grid item xs={6} sm={4} md={3} lg={1.7} sx={{ flexGrow: 1 }}>
                  <StatCard 
                    title="مبيعات Show Room" 
                    value={getGeneralVal('showroom')} 
                    icon={<AttachMoneyIcon />} 
                    color="#607d8b" 
                    onClick={() => {
                        dispatch(changeStoreOrderSearchType("show-room"));
                        navigate("/show-room-orders");
                    }} 
                  />
              </Grid>
            </Grid>

          </>
        )}
      </Container>
    </Box>
  );
};

export default CompanyStorePage;