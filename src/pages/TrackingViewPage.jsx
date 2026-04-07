import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Box, Container, Paper, Typography, Stepper, Step, StepLabel, 
    Divider, Grid, Avatar, Chip, CircularProgress, Button, Stack
} from '@mui/material';
import { 
    LocalShipping, Receipt, Person, Store, EventNote, 
    History, Phone, Map, AttachMoney, ChevronRight
} from '@mui/icons-material';

const TrackingView = () => {
    const { OrderID } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const primaryColor = 'var(--primary-color)';
    const secondaryColor = 'var(--secondary-color)';

    useEffect(() => {
        if (!OrderID) return;
        setLoading(true);
        fetch(`https://fvtion.com/API/talabk/get/OrderTracking.php?OrderID=${OrderID}`)
        .then(res => res.json())
        .then(json => {
            if (!json || json.length === 0 || json.error) setData(null);
            else {
                const last = json[json.length - 1];
                setData({
                    fullHistory: json,
                    order_id: last.OrderID,
                    store_name: last.StoreName,
                    status_text: last.Status,
                    delegate_name: last.Delegate || "لم يعين بعد",
                    delegate_phone: last.Phone,
                    total_price: last.TotalAmount,
                    date: last.Date,
                    city: last.City || "غير محدد"
                });
            }
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [OrderID]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 20 }}><CircularProgress sx={{ color: primaryColor }} /></Box>;

    if (!data) return <Box sx={{ textAlign: 'center', mt: 10 }}>طلب غير موجود</Box>;

    return (
        <Container maxWidth="lg" sx={{ py: 4, direction: 'rtl' }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button onClick={() => navigate(-1)} sx={{ color: '#666' }}><ChevronRight /> عودة</Button>
                <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'Almarai' }}>تفاصيل الشحنة </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Stack spacing={2}>
                        <Paper sx={{ p: 3, borderRadius: 4, bgcolor: secondaryColor, color: '#fff' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <AttachMoney sx={{ opacity: 0.8 }} />
                                <Typography sx={{ fontFamily: 'Almarai' , color:'#fff'}}>القيمة الإجمالية</Typography>
                            </Box>
                            <Typography variant="h3" sx={{ fontWeight: 900 , color:'#fff'}}>{data.total_price} <small style={{ fontSize: '1rem' }}>د.ل</small></Typography>
                        </Paper>

                        <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #eee' }}>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontFamily: 'Almarai' }}>المندوب المسؤول</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: primaryColor }}><Person /></Avatar>
                                <Box>
                                    <Typography sx={{ fontWeight: 'bold' }}>{data.delegate_name}</Typography>
                                    <Typography variant="caption" color="text.secondary">{data.delegate_phone || "لا يوجد رقم"}</Typography>
                                </Box>
                            </Box>
                        </Paper>
                </Stack>

                </Grid>

                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid #eee' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 800 }}>سجل الحركات </Typography>
                                <Typography variant="caption" color="text.secondary">تتبع تفصيلي لكل حالة مر بها الطلب</Typography>
                            </Box>
                            <Chip label={data.status_text} sx={{ bgcolor: primaryColor, color: '#fff', fontWeight: 'bold' }} />
                        </Box>

                        <Stack spacing={3}>
                            {data.fullHistory.slice().reverse().map((log, index) => (
                                <Box key={index} sx={{ 
                                    display: 'flex', gap: 3, p: 2, 
                                    bgcolor: index === 0 ? 'rgba(221, 36, 41, 0.03)' : 'transparent',
                                    borderRadius: 3,
                                    borderRight: index === 0 ? `4px solid ${primaryColor}` : '4px solid #eee'
                                }}>
                                    <Box sx={{ minWidth: 100 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{log.Date.split(' ')[0]}</Typography>
                                        <Typography variant="caption" color="text.secondary">{log.Date.split(' ')[1]}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontWeight: 'bold', color: index === 0 ? primaryColor : '#333' }}>
                                            {log.Status}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            بواسطة: {log.Delegate || "النظام الآلي"}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default TrackingView;