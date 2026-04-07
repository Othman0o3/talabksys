import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Button, Box, Typography, Paper, 
  Divider, Stack, CardActionArea 
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
  storePhone1,storePhone2,storePhone3,
}) => {
  const dispatch = useDispatch();
  const { type } = useSelector((state) => state.deliveryOrders);

  const handleReturnRequest = () => dispatch(changeOrderCaseToReturning(orderNumber, storeName));
  const handleConfirmRequest = () => dispatch(changeOrderCaseToConfirm(orderNumber, storeName));

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        mb: 2, 
        borderRadius: '20px', 
        overflow: 'hidden',
        border: '1px solid #e0e0e0',
        direction: 'rtl'
      }}
    >
      <Box sx={{ p: 2, bgcolor: '#f8f9fa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="caption" color="textSecondary" display="block">رقم الشحنة</Typography>
          <Typography variant="h6" fontWeight="900" color="primary">#{orderNumber}</Typography>
        </Box>
        <Box sx={{ textAlign: 'left', bgcolor: 'white', px: 2, py: 1, borderRadius: '12px', border: '1px solid #eee' }}>
          <Typography variant="caption" color="textSecondary" display="block">المبلغ لتحصيل</Typography>
          <Typography variant="h6" fontWeight="900" color="success.main">
            {parseFloat(amount).toLocaleString("en-GB")} <small style={{fontSize: '12px'}}>د.ل</small>
          </Typography>
        </Box>
      </Box>

      <Box sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Box display="flex" alignItems="flex-start">
            <LocationOnIcon sx={{ color: 'error.main', ml: 1, mt: 0.5 }} />
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" lineHeight={1.2}>
                {address}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <StorefrontIcon sx={{ fontSize: 18, ml: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">{storeName}</Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">{date}</Typography>
          </Box>

          {description && (
            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#fff9c4', p: 1, borderRadius: '8px' }}>
              <InfoOutlinedIcon sx={{ fontSize: 16, ml: 1 }} />
              <Typography variant="caption" fontWeight="bold">{description}</Typography>
            </Box>
          )}

          <Button 
            fullWidth 
            variant="contained" 
            color="primary" 
            size="large"
            href={`tel:${phone}`}
            startIcon={<PhoneEnabledIcon sx={{ ml: 1 }} />}
            sx={{ 
              borderRadius: '12px', 
              py: 1.5, 
              fontSize: '1.1rem', 
              boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
              direction: 'ltr' 
            }}
          >
            إتصال بالزبون
          </Button>

        {[...new Set([storePhone1, storePhone2, storePhone3])]
          .filter(Boolean)
          .map((phone, index, array) => (
            <Button 
              key={index}
              fullWidth 
              variant="outlined" 
              color="secondary" 
              size="medium"
              href={`tel:${phone}`}
              startIcon={<PhoneEnabledIcon sx={{ ml: 1 }} />}
              sx={{ borderRadius: '12px', py: 1, direction: 'ltr' }}
            >
              اتصال بالمتجر {array.length > 1 ? index + 1 : ''}
            </Button>
          ))
        }
          {type === "returned" && (
            <Box sx={{ p: 1.5, bgcolor: '#ffebee', borderRadius: '12px', border: '1px solid #ffcdd2' }}>
              <Typography variant="body2" color="error.main" fontWeight="bold">سبب الإرجاع: {reasonName}</Typography>
              <Typography variant="caption" display="block">{reasonText}</Typography>
            </Box>
          )}

          <Divider />

          <Box display="flex" gap={2}>
            {type === "shipping" ? (
              <>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  color="error" 
                  onClick={handleReturnRequest}
                  startIcon={<ReplyAllIcon />}
                  sx={{ borderRadius: '12px', py: 1.2 }}
                >
                  إرجاع
                </Button>
                <Button 
                  fullWidth 
                  variant="contained" 
                  color="success" 
                  onClick={handleConfirmRequest}
                  startIcon={<TaskAltIcon />}
                  sx={{ borderRadius: '12px', py: 1.2 }}
                >
                  تم التسليم
                </Button>
              </>
            ) : (
              <Button 
                fullWidth 
                variant="contained" 
                color="success" 
                onClick={handleConfirmRequest}
                startIcon={<TaskAltIcon />}
                sx={{ borderRadius: '12px', py: 1.5 }}
              >
                تأكيد العملية
              </Button>
            )}
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
};

export default DeliveryOrderCard;