import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; 
import {
    Box, Container, Paper, Typography, Grid, Avatar, Chip, 
    CircularProgress, Button, Stack
} from '@mui/material';
import {
    Person, AttachMoney, ChevronRight, LockOutlined, History, 
    Store
} from '@mui/icons-material';

const TrackingView = () => {
    const { OrderID } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isUnauthorized, setIsUnauthorized] = useState(false);

    // جلب بيانات المستخدم من Redux
    const { loginInfo } = useSelector((state) => state.userLogin);

    const primaryColor = 'var(--primary-color)';
    const secondaryColor = 'var(--secondary-color)';

    useEffect(() => {
        if (!OrderID) return;
        setLoading(true);
        setIsUnauthorized(false);

        fetch(`https://fvtion.com/API/talabk/get/OrderTracking.php?OrderID=${OrderID}`)
            .then(res => res.json())
            .then(json => {
                if (!json || json.length === 0 || json.error) {
                    setData(null);
                } else {
                    const last = json[json.length - 1];


                    const orderStoreName = last.StoreName?.trim();
                    const userShName = loginInfo?.UserName?.trim();
                    const userMName = loginInfo?.MName?.trim();

                    console.log("الاسم في الطلبية:", `"${orderStoreName}"`);
                    console.log("الاسم في loginInfo (ShName):", `"${userShName}"`);
                    console.log("الاسم في loginInfo (MName):", `"${userMName}"`);

                    const isOwner = (orderStoreName === userShName || orderStoreName === userMName);
                    const isAdmin = loginInfo?.UserType === "Admin";

                    if (!isAdmin && !isOwner) {
                        setIsUnauthorized(true);
                        setData(null);
                    } else {
                        setData({
                            fullHistory: json,
                            order_id: last.OrderID,
                            store_name: last.StoreName,
                            status_text: last.Status,
                            delegate_name: last.Delegate || "لم يعين بعد",
                            delegate_phone: last.Phone,
                            total_price: last.TotalAmount,
                            date: last.Date,
                        });
                    }
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("خطأ في الاتصال:", err);
                setLoading(false);
                setData(null);
            });
    }, [OrderID, loginInfo]);

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <CircularProgress sx={{ color: primaryColor }} />
        </Box>
    );

    if (isUnauthorized) return (
        <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 15, direction: 'rtl' }}>
            <Paper elevation={0} sx={{ p: 5, borderRadius: 4, border: '1px solid #ffcdd2', bgcolor: '#fff5f5' }}>
                <LockOutlined sx={{ fontSize: 80, color: '#d32f2f', mb: 2 }} />
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ fontFamily: 'Almarai' }}>
                    وصول غير مصرح به
                </Typography>
                <Typography color="text.secondary" mb={4} sx={{ fontFamily: 'Almarai' }}>
                    عذراً، هذه الطلبية تابعة لمتجر آخر ولا تملك صلاحية عرضها.
                </Typography>
                <Button 
                    variant="contained" 
                    fullWidth 
                    onClick={() => navigate(-1)} 
                    sx={{ bgcolor: secondaryColor, borderRadius: 2, py: 1.5 }}
                >
                    العودة للخلف
                </Button>
            </Paper>
        </Container>
    );

    if (!data) return (
        <Box sx={{ textAlign: 'center', mt: 10, direction: 'rtl' }}>
            <Typography variant="h6" color="text.secondary">طلب غير موجود</Typography>
            <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>رجوع</Button>
        </Box>
    );

    return (
        <Container maxWidth="lg" sx={{ py: 4, direction: 'rtl' }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button onClick={() => navigate(-1)} sx={{ color: '#666', minWidth: 'auto' }}>
                        <ChevronRight fontSize="large" />
                    </Button>
                    <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'Almarai' }}>
                        تتبع الشحنة #{data.order_id}
                    </Typography>
                </Box>
                <Chip label={data.status_text} sx={{ bgcolor: primaryColor, color: '#fff', fontWeight: 'bold' }} />
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Stack spacing={2}>
                        <Paper sx={{ p: 3, borderRadius: 4, bgcolor: secondaryColor, color: '#fff' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <AttachMoney sx={{ opacity: 0.8 }} />
                                <Typography sx={{ fontFamily: 'Almarai' }}>القيمة الإجمالية</Typography>
                            </Box>
                            <Typography variant="h3" sx={{ fontWeight: 900 ,color: '#fff'}}>
                                {data.total_price} <small style={{ fontSize: '1rem' }}>د.ل</small>
                            </Typography>
                        </Paper>

                        <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #eee' }}>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>المتجر</Typography>
                            <Typography sx={{ fontWeight: 'bold' }}>{data.store_name}</Typography>
                        </Paper>

                        <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #eee' }}>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>المندوب المسؤول</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: primaryColor }}><Person /></Avatar>
                                <Box>
                                    <Typography sx={{ fontWeight: 'bold' }}>{data.delegate_name}</Typography>
                                    <Typography variant="caption" color="text.secondary">{data.delegate_phone || "بدون رقم"}</Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Stack>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid #eee' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
                            <History color="primary" />
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>سجل الحركات</Typography>
                        </Box>

                        <Stack spacing={2}>
                            {data.fullHistory.slice().reverse().map((log, index) => (
                                <Box key={index} sx={{
                                    display: 'flex', gap: 3, p: 2,
                                    bgcolor: index === 0 ? 'rgba(221, 36, 41, 0.03)' : 'transparent',
                                    borderRadius: 3,
                                    borderRight: index === 0 ? `4px solid ${primaryColor}` : '4px solid #eee'
                                }}>
                                    <Box sx={{ minWidth: 100 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                            {log.Date}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {log.Time}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontWeight: 'bold', color: index === 0 ? primaryColor : '#333' }}>
                                            {log.Status}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            بواسطة: {log.Delegate || "النظام"}
                                        </Typography>
                                        {log.ReasonForReturn && (
                                            <Typography variant="caption" sx={{ color: 'red', display: 'block', mt: 0.5 }}>
                                                السبب: {log.ReasonForReturn}
                                            </Typography>
                                        )}
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