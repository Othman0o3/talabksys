import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Button, Box, Typography, Paper, 
  Divider, Stack 
} from "@mui/material";

// Icons
import ReplyAllIcon from "@mui/icons-material/ReplyAll";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StorefrontIcon from '@mui/icons-material/Storefront';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import {
  changeOrderCaseToConfirm,
  changeOrderCaseToReturning,
} from "../redux/actions/orderActions";

const DeliveryOrderCard = ({
  orderNumber, storeName, date, address,
  phone, amount, description, reasonText, reasonName,
  storePhone1, storePhone2, storePhone3, // تم إرجاعهم هنا
}) => {
  const dispatch = useDispatch();
  const { type } = useSelector((state) => state.deliveryOrders);

  const handleReturnRequest = () => dispatch(changeOrderCaseToReturning(orderNumber, storeName));
  const handleConfirmRequest = () => dispatch(changeOrderCaseToConfirm(orderNumber, storeName));

  return (
    <Paper 
      elevation={2} 
      sx={{ mb: 2, borderRadius: '20px', overflow: 'hidden', border: '1px solid #e0e0e0', direction: 'rtl' }}
    >
      {/* Header */}
      <Box sx={{ p: 2, bgcolor: '#f8f9fa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="caption" color="textSecondary" display="block">رقم الشحنة</Typography>
          <Typography variant="h6" fontWeight="900" color="primary">#{orderNumber}</Typography>
        </Box>
        <Box sx={{ textAlign: 'left', bgcolor: 'white', px: 2, py: 1, borderRadius: '12px', border: '1px solid #eee' }}>
          <Typography variant="caption" color="textSecondary" display="block">المبلغ</Typography>
          <Typography variant="h6" fontWeight="900" color="success.main">
            {parseFloat(amount).toLocaleString("en-GB")} <small>د.ل</small>
          </Typography>
        </Box>
      </Box>

      <Box sx={{ p: 2 }}>
        <Stack spacing={2}>
          {/* معلومات العنوان والمتجر */}
          <Box display="flex" alignItems="flex-start">
            <LocationOnIcon sx={{ color: 'error.main', ml: 1, mt: 0.5 }} />
            <Typography variant="subtitle1" fontWeight="bold">{address}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <StorefrontIcon sx={{ fontSize: 18, ml: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">{storeName}</Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">{date}</Typography>
          </Box>

          {/* الملاحظات إن وجدت */}
          {description && (
            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#fff9c4', p: 1, borderRadius: '8px' }}>
              <InfoOutlinedIcon sx={{ fontSize: 16, ml: 1 }} />
              <Typography variant="caption" fontWeight="bold">{description}</Typography>
            </Box>
          )}

          {/* زر اتصال الزبون */}
          <Button 
            fullWidth variant="contained" color="primary" 
            href={`tel:${phone}`}
            startIcon={<PhoneEnabledIcon sx={{ ml: 1 }} />}
            sx={{ borderRadius: '12px', py: 1.5, fontWeight: 'bold' }}
          >
            إتصال بالزبون
          </Button>

          {/* أزرار اتصال المتاجر */}
          {(storePhone1 || storePhone2 || storePhone3) && (
            <Stack direction="row" spacing={1}>
              {storePhone1 && (
                <Button fullWidth variant="outlined" color="secondary" size="small" href={`tel:${storePhone1}`} sx={{ borderRadius: '10px' }}>
                  متجر 1
                </Button>
              )}
              {storePhone2 && (
                <Button fullWidth variant="outlined" color="secondary" size="small" href={`tel:${storePhone2}`} sx={{ borderRadius: '10px' }}>
                  متجر 2
                </Button>
              )}
              {storePhone3 && (
                <Button fullWidth variant="outlined" color="secondary" size="small" href={`tel:${storePhone3}`} sx={{ borderRadius: '10px' }}>
                  متجر 3
                </Button>
              )}
            </Stack>
          )}

          <Divider />

          {/* منطق الأزرار بناءً على الحالة */}
          {type === "shipping" ? (
            <Box display="flex" gap={2}>
              <Button 
                fullWidth variant="outlined" color="error" 
                onClick={handleReturnRequest}
                startIcon={<ReplyAllIcon />}
                sx={{ borderRadius: '12px' }}
              >
                إرجاع
              </Button>
              <Button 
                fullWidth variant="contained" color="success" 
                onClick={handleConfirmRequest}
                startIcon={<TaskAltIcon />}
                sx={{ borderRadius: '12px' }}
              >
                تم التسليم
              </Button>
            </Box>
          ) : type === "returned" || type === "returning" ? (
            <Stack spacing={2}>
              <Box sx={{ p: 1.5, bgcolor: '#ffebee', borderRadius: '12px', border: '1px solid #ffcdd2' }}>
                <Typography variant="body2" color="error.main" fontWeight="bold">
                  سبب الإرجاع: {reasonName || "غير محدد"}
                </Typography>
                <Typography variant="caption">{reasonText || "لا توجد ملاحظات إضافية"}</Typography>
              </Box>
              <Button 
                fullWidth variant="contained" color="success" 
                onClick={handleConfirmRequest}
                startIcon={<TaskAltIcon />}
                sx={{ borderRadius: '12px', py: 1.5, fontWeight: 'bold' }}
              >
                تغيير الحالة لـ "تم التسليم"
              </Button>
            </Stack>
          ) : (
            <Box sx={{ textAlign: 'center', p: 1, bgcolor: '#e8f5e9', borderRadius: '10px' }}>
              <Typography color="success.main" fontWeight="bold">✓ الشحنة مسلمة</Typography>
            </Box>
          )}
        </Stack>
      </Box>
    </Paper>
  );
};

export default DeliveryOrderCard;