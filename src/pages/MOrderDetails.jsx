import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
    Container, Paper, Typography, Grid, Box, 
    Divider, CircularProgress, Button, Table, 
    TableBody, TableCell, TableContainer, TableHead, TableRow, Chip 
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { getMarketerOrders } from "../redux/actions/orderActions";

const OrderDetailsView = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loginInfo } = useSelector((state) => state.userLogin);
    const { loading, orders } = useSelector((state) => state.marketerOrders);
    const [order, setOrder] = useState(null);
    
    useEffect(() => {
        if (!orders || orders.length === 0) {
            dispatch(getMarketerOrders(loginInfo.BranchID, false));
        }
    }, [dispatch, loginInfo.BranchID, orders]);

    useEffect(() => {
        if (orders && orders.length > 0) {
            const foundOrder = orders.find((item) => item.ID.toString() === id.toString());
            setOrder(foundOrder);
        }
    }, [orders, id]);

    // Calculate total profit from items array MPric, only if outcome > 0
    const calculateTotalProfit = () => {
        if (!order?.Item || order.Item.length === 0) return 0;
        return order.Item.reduce((total, item) => {
            const mPric = Number(item.MPric) || 0;
            const outcome = Number(item.outcome) || 0;
            if (outcome > 0) {
                return total + mPric;
            }
            return total;
        }, 0);
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress />
        </Box>
    );

    if (!order && !loading) return (
        <Container sx={{ mt: 5, textAlign: 'center' }}>
            <Typography variant="h6">عذراً، لم يتم العثور على الطلبية رقم {id}</Typography>
            <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>رجوع</Button>
        </Container>
    );

    return (
        <Container maxWidth="md" sx={{ py: 4, direction: 'rtl' }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button 
                    onClick={() => navigate(-1)} 
                    variant="outlined" 
                    sx={{ minWidth: '40px', p: 1, borderRadius: '10px' }}
                >
                    <ArrowBackIosNewIcon fontSize="small" />
                </Button>
                <Typography variant="h5" fontWeight="800" fontFamily="Almarai">
                    تفاصيل الشحنة #{order?.ID}
                </Typography>
            </Box>

            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">اسم الزبون</Typography>
                        <Typography variant="body1" fontWeight="700" mb={2}>{order?.CoName}</Typography>
                        
                        <Typography variant="subtitle2" color="textSecondary">الهاتف</Typography>
                        <Typography variant="body1" fontWeight="700" mb={2}>{order?.Tel1} {order?.Tel2 && ` - ${order?.Tel2}`}</Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">المدينة والعنوان</Typography>
                        <Typography variant="body1" fontWeight="700" mb={2}>{order?.CName} - {order?.Adress}</Typography>
                        
                        <Typography variant="subtitle2" color="textSecondary">الحالة</Typography>
                        <Chip label={order?.ScName} color="primary" size="small" sx={{ fontWeight: 'bold' }} />
                    </Grid>

                    <Grid item xs={12}><Divider /></Grid>

                    <Grid item xs={6} md={3}>
                        <Typography variant="subtitle2" color="textSecondary">إجمالي الطلبية</Typography>
                        <Typography variant="h6" color="primary" fontWeight="800">
                            {Number(order?.Total || 0).toLocaleString()} د.ل
                        </Typography>
                    </Grid>
                    
                    <Grid item xs={6} md={3}>
                        <Typography variant="subtitle2" color="textSecondary">صافي التسويق</Typography>
                        <Typography variant="h6" color="success.main" fontWeight="800">
                            {calculateTotalProfit().toLocaleString()} د.ل
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle2" color="textSecondary">ملاحظات / وصف</Typography>
                        <Typography variant="body2" sx={{ bgcolor: '#f9f9f9', p: 2, borderRadius: 2 }}>
                            {order?.wasf || "لا توجد ملاحظات"}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h6" fontWeight="700" sx={{ mb: 2, mt: 2 }}>الأصناف المطلوبة</Typography>
                        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                            <Table>
                                <TableHead sx={{ bgcolor: '#fafafa' }}>
                                    <TableRow>
                                        <TableCell align="right">الصنف</TableCell>
                                        <TableCell align="center">الكمية</TableCell>
                                        <TableCell align="center">سعر الوحدة</TableCell>
                                        <TableCell align="center">الإجمالي</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {order?.Item && order.Item.length > 0 ? (
                                        order.Item.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell align="right">{item.Name}</TableCell>
                                                <TableCell align="center">{Number(item.outcome)}</TableCell>
                                                <TableCell align="center">{Number(item.Pric).toLocaleString()} د.ل</TableCell>
                                                <TableCell align="center">
                                                    {(Number(item.Pric) * Number(item.outcome)).toLocaleString()} د.ل
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">لا توجد أصناف مسجلة</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default OrderDetailsView;