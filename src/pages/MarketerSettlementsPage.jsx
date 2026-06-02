import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    Container, Box, Typography, Paper, 
    CircularProgress, IconButton, Alert,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, InputAdornment, Chip, Stack, Divider
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// Icons
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EventIcon from '@mui/icons-material/Event';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

// Actions
import { getMarketerFinance } from "../redux/actions/settlementsACtions";

const MarketerFinancePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState("");

    const { loginInfo } = useSelector((state) => state.userLogin);
    const { loading, financeData = [], error } = useSelector((state) => state.marketerFinance);

    useEffect(() => {
        if (loginInfo?.BranchID) {
            dispatch(getMarketerFinance(loginInfo.BranchID));
        }
    }, [dispatch, loginInfo]);

    const filteredData = useMemo(() => {
        if (!searchText) return financeData;
        const lowerSearchText = searchText.toLowerCase();
        return financeData.filter(item => {
            const docNum = String(item.DocNum || "").toLowerCase();
            const note = String(item.Note || "").toLowerCase();
            const kind = String(item.Kind || "").toLowerCase();
            return docNum.includes(lowerSearchText) || note.includes(lowerSearchText) || kind.includes(lowerSearchText);
        });
    }, [searchText, financeData]);

    const formatDate = (dateValue) => {
        if (!dateValue) return "---";
        const dateObj = new Date(dateValue.date || dateValue);
        return dateObj.toLocaleDateString('ar-LY', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    return (
        <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', pb: 5 }}>
            {/* Header الثابت */}
            <Box sx={{ 
                p: 2, display: 'flex', alignItems: 'center', gap: 1, 
                direction: 'rtl', bgcolor: 'white', borderBottom: '1px solid #eee',
                position: 'sticky', top: 0, zIndex: 1000 
            }}>
                <IconButton onClick={() => navigate(-1)}>
                    <ArrowForwardIosIcon sx={{ fontSize: 18 }} />
                </IconButton>
                <Typography variant="h6" fontWeight="900" sx={{ fontFamily: 'Almarai' }}>السجل المالي</Typography>
            </Box>

            <Container maxWidth="lg" sx={{ mt: 2, direction: 'rtl' }}>
                
                {/* قسم البحث والإحصائيات */}
                <Stack spacing={2} sx={{ mb: 3 }}>
                    <TextField 
                        placeholder="ابحث برقم العملية..."
                        variant="outlined"
                        fullWidth
                        size="medium"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        sx={{ bgcolor: 'white', borderRadius: '12px', "& fieldset": { borderRadius: '12px', borderColor: '#eee' } }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="primary" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    
                    <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', display: 'flex', alignItems: 'center', gap: 2, border: '1px solid #eee', bgcolor: '#e3f2fd' }}>
                        <AccountBalanceWalletIcon color="primary" />
                        <Box>
                            <Typography variant="caption" color="textSecondary" display="block">إجمالي العمليات</Typography>
                            <Typography variant="h6" fontWeight="900">{filteredData.length}</Typography>
                        </Box>
                    </Paper>
                </Stack>

                {loading ? (
                    <Box display="flex" justifyContent="center" py={10}><CircularProgress /></Box>
                ) : error ? (
                    <Alert severity="error" sx={{ borderRadius: '12px' }}>{error}</Alert>
                ) : (
                    <>
                        {/* عرض الموبايل (Cards) - يظهر فقط في الشاشات الصغيرة */}
                        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                            <Stack spacing={2}>
                                {filteredData.map((item) => {
                                    const isIncome = parseFloat(item.Ciradet) > 0;
                                    const amount = isIncome ? item.Ciradet : item.Debit;
                                    return (
                                        <Paper key={item.ID} elevation={0} sx={{ p: 2, borderRadius: '15px', border: '1px solid #eee' }}>
                                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                                                <Box>
                                                    <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <ReceiptLongIcon sx={{ fontSize: 14 }} /> رقم {item.DocNum}
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight="800" sx={{ mt: 0.5 }}>
                                                        {item.Note || (isIncome ? "إيداع عمولة" : "عملية سحب")}
                                                    </Typography>
                                                </Box>
                                                <Typography 
                                                    variant="h6" 
                                                    fontWeight="900" 
                                                    color={isIncome ? 'success.main' : 'error.main'}
                                                    sx={{ direction: 'ltr' }}
                                                >
                                                    {isIncome ? `+` : `-`} {parseFloat(amount).toLocaleString("en-GB")}
                                                </Typography>
                                            </Box>
                                            
                                            <Divider sx={{ my: 1.5, opacity: 0.5 }} />
                                            
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <Box display="flex" alignItems="center" gap={0.5} color="text.secondary">
                                                    <EventIcon sx={{ fontSize: 16 }} />
                                                    <Typography variant="caption">{formatDate(item.MDate)}</Typography>
                                                </Box>
                                                <Chip 
                                                    label={item.Kind || (isIncome ? "إيداع" : "سحب")} 
                                                    size="small" 
                                                    color={isIncome ? "success" : "default"}
                                                    variant="soft"
                                                    sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}
                                                />
                                            </Box>
                                        </Paper>
                                    );
                                })}
                            </Stack>
                        </Box>

                        {/* عرض الكمبيوتر (Table) - يظهر في الشاشات الكبيرة */}
                        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                            <TableContainer component={Paper} sx={{ borderRadius: '15px', border: '1px solid #eee', elevation: 0 }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }}>رقم العملية</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }}>التاريخ</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }}>البيان</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }}>النوع</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }}>القيمة</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredData.map((item) => {
                                            const isIncome = parseFloat(item.Ciradet) > 0;
                                            const amount = isIncome ? item.Ciradet : item.Debit;
                                            return (
                                                <TableRow key={item.ID} hover>
                                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>{item.DocNum}</TableCell>
                                                    <TableCell align="right">{formatDate(item.MDate)}</TableCell>
                                                    <TableCell align="right">{item.Note || (isIncome ? "إيداع" : "سحب")}</TableCell>
                                                    <TableCell align="right">
                                                        <Chip label={item.Kind || "---"} size="small" />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Typography fontWeight="900" color={isIncome ? 'success.main' : 'error.main'}>
                                                            {isIncome ? `+` : `-`} {parseFloat(amount).toLocaleString("en-GB")}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        {filteredData.length === 0 && (
                            <Box sx={{ py: 10, textAlign: 'center' }}>
                                <Typography color="textSecondary">لا توجد بيانات لعرضها</Typography>
                            </Box>
                        )}
                    </>
                )}
            </Container>
        </Box>
    );
};

export default MarketerFinancePage;