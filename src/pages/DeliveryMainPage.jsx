import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Container } from "react-bootstrap";
import { CircularProgress, Box, Typography, Paper, Divider, Avatar, CardActionArea } from "@mui/material";

// Icons
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ReplyAllIcon from "@mui/icons-material/ReplyAll";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PaymentsIcon from '@mui/icons-material/Payments';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import {
  changeDeliveryOrderSearchType,
  getDeliveryOrdersSummary,
} from "../redux/actions/orderActions";

const DeliveryMainPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loginInfo } = useSelector((state) => state.userLogin);
  const { loadingDeliveryOrdersSummary, deliveryOrdersSummary } = useSelector(
    (state) => state.deliveryOrdersSummary
  );

  useEffect(() => {
    dispatch(getDeliveryOrdersSummary(loginInfo.BranchID));
  }, [dispatch, loginInfo.BranchID]);

  const handleOpenOrdersPage = (type) => {
    dispatch(changeDeliveryOrderSearchType(type));
    navigate("/orders");
  };

  const OrderActionRow = ({ title, count, icon, color, type }) => (
    <Paper 
      elevation={0} 
      sx={{ 
        mb: 2, 
        borderRadius: '20px', 
        border: '1px solid #f0f0f0',
        overflow: 'hidden',
        background: '#fff'
      }}
    >
      <CardActionArea onClick={() => handleOpenOrdersPage(type)} sx={{ p: 2.5 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: `${color}15`, color: color, width: 50, height: 50 }}>
              {icon}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="800">{title}</Typography>
              <Typography variant="body2" color="textSecondary">اضغط لعرض التفاصيل</Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6" fontWeight="900" color={color}>{count}</Typography>
            <ChevronLeftIcon sx={{ color: '#ccc' }} />
          </Box>
        </Box>
      </CardActionArea>
    </Paper>
  );

  if (loadingDeliveryOrdersSummary) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#fbfbfb', minHeight: '100vh', pb: 5 }}>
      <Box 
        sx={{ 
          bgcolor: 'var(--primary-color)', 
          pt: 4, pb: 8, px: 3, 
          borderBottomLeftRadius: '30px', 
          borderBottomRightRadius: '30px',
          color: 'white'
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" fontWeight="400" sx={{ opacity: 0.8 , color: '#fff'}}>مرحباً بك،</Typography>
            <Typography variant="h5" fontWeight="900" sx={{color:'#fff'}} >{loginInfo.UserName || 'كابتن التوصيل'}</Typography>
          </Box>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 50, height: 50, fontWeight: 'bold' }}>
            {loginInfo.Name ? loginInfo.Name[0] : 'D'}
          </Avatar>
        </Box>
      </Box>

      <Container maxWidth="md" sx={{ mt: -6, direction: 'rtl' }}>
        <Paper 
          elevation={4} 
          sx={{ 
            p: 3, 
            borderRadius: '25px', 
            mb: 4, 
            background: 'linear-gradient(135deg, #fff 0%, #f9f9f9 100%)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
          }}
        >
          <Row>
            <Col xs={6} style={{ borderLeft: '1px solid #eee' }}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <AccountBalanceWalletIcon sx={{ color: '#ff9800', mb: 1 }} />
                <Typography variant="h6" fontWeight="900">
                    {deliveryOrdersSummary?.almahfaza || 0}
                </Typography>
                <Typography variant="caption" color="textSecondary">في المحفظة</Typography>
              </Box>
            </Col>
            <Col xs={6}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <PaymentsIcon sx={{ color: '#4caf50', mb: 1 }} />
                <Typography variant="h6" fontWeight="900">
                    {deliveryOrdersSummary?.DelgAmount || 0}
                </Typography>
                <Typography variant="caption" color="textSecondary">إجمالي عمولتك</Typography>
              </Box>
            </Col>
          </Row>
        </Paper>

        <Typography variant="h6" fontWeight="800" mb={2} px={1}>مهام اليوم</Typography>
        
        <OrderActionRow 
          title="  قيد التوصيل"
          count={deliveryOrdersSummary?.Count_case3 || 0}
          icon={<LocalShippingIcon />}
          color="#2196f3"
          type="shipping"
          fontWeight="700"
          sx={{
          }}
/>

        <OrderActionRow 
          title="  مكتملة"
          count={deliveryOrdersSummary?.Count_case4 || 0}
          icon={<ShoppingBagIcon />}
          color="#4caf50"
          type="done"
        />

        <OrderActionRow 
          title="  راجعة"
          count={deliveryOrdersSummary?.Count_case7 || 0}
          icon={<ReplyAllIcon />}
          color="#f44336"
          type="returned"
        />

        <Box 
          sx={{ 
            mt: 3, p: 2, borderRadius: '15px', 
            bgcolor: '#e3f2fd', border: '1px dashed #2196f3',
            textAlign: 'center' 
          }}
        >
          <Typography variant="body2" color="#1976d2" fontWeight="700">
            إجمالي قيمة المبيعات المسجلة: {deliveryOrdersSummary?.Total || 0} د.ل
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default DeliveryMainPage;