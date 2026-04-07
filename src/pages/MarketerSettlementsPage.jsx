import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    Container, Box, Typography, Paper, 
    CircularProgress, IconButton, Alert,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, InputAdornment, Chip
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// Icons
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

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

            return docNum.includes(lowerSearchText) || 
                note.includes(lowerSearchText) || 
                kind.includes(lowerSearchText);
        });
    }, [searchText, financeData]);

    const formatDate = (dateValue) => {
        if (!dateValue) return "---";
        const dateObj = new Date(dateValue.date || dateValue);
        return dateObj.toLocaleDateString('ar-LY', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    return (
        <Box sx={{ bgcolor: '#f4f6f8', minHeight: '100vh', pb: 5 }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1, direction: 'rtl', bgcolor: 'white', borderBottom: '1px solid #eee' }}>
                <IconButton onClick={() => navigate(-1)}>
                    <ArrowForwardIosIcon sx={{ fontSize: 18 }} />
                </IconButton>
                <Typography variant="h6" fontWeight="800">السجل المالي للمسوق</Typography>
            </Box>

            <Container maxWidth="lg" sx={{ mt: 3, direction: 'rtl' }}>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, alignItems: 'center', justifyContent: 'space-between' }}>
                    <TextField 
                        placeholder="ابحث برقم العملية أو الملاحظات..."
                        variant="outlined"
                        size="small"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        sx={{ bgcolor: 'white', width: { xs: '100%', md: '400px' }, borderRadius: '10px' }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    
                    <Paper sx={{ px: 3, py: 1, borderRadius: '10px', display: 'flex', alignItems: 'center', gap: 2, border: '1px solid #e0e0e0', elevation: 0 }}>
                        <AccountBalanceWalletIcon color="primary" />
                        <Box>
                            <Typography variant="caption" color="textSecondary">إجمالي العمليات</Typography>
                            <Typography variant="subtitle1" fontWeight="900" sx={{ mt: -0.5 }}>{filteredData.length}</Typography>
                        </Box>
                    </Paper>
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" py={10}><CircularProgress /></Box>
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : (
                    <TableContainer component={Paper} sx={{ borderRadius: '15px', overflow: 'hidden', border: '1px solid #eee', elevation: 0 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }}>رقم العملية</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }}>التاريخ</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }}>البيان / الملاحظات</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }}>النوع</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }}>القيمة</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData.map((item) => {
                                    const isIncome = parseFloat(item.Ciradet) > 0;
                                    const amount = isIncome ? item.Ciradet : item.Debit;
                                    
                                    return (
                                        <TableRow key={item.ID} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>{item.DocNum}</TableCell>
                                            <TableCell align="right" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                                                {formatDate(item.MDate)}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography variant="body2" fontWeight="500">
                                                    {item.Note || (isIncome ? "إيداع عمولة" : "عملية سحب")}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip 
                                                    label={item.Kind || (isIncome ? "إيداع" : "سحب")} 
                                                    size="small" 
                                                    variant="outlined"
                                                    sx={{ fontSize: '0.7rem' }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography 
                                                    fontWeight="900" 
                                                    color={isIncome ? 'success.main' : 'error.main'}
                                                    sx={{ direction: 'ltr' }}
                                                >
                                                    {isIncome ? `+` : `-`} {parseFloat(amount).toLocaleString("en-GB")}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                        {filteredData.length === 0 && (
                            <Box sx={{ py: 5, textAlign: 'center' }}>
                                <Typography color="textSecondary">لا توجد نتائج مطابقة للبحث</Typography>
                            </Box>
                        )}
                    </TableContainer>
                )}
            </Container>
        </Box>
    );
};

export default MarketerFinancePage;