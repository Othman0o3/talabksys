import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    Box, CircularProgress, TextField, Stack, Card, Typography, 
    Grid, Button, Paper, Divider, useMediaQuery, useTheme 
} from "@mui/material";
import { DataGrid, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";

// Icons
import FilterListIcon from '@mui/icons-material/FilterList';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

// Actions
import { getSettlements } from "../redux/actions/settlementsACtions";
/* ID(pin):16385
DocNum(pin):17925
Debit(pin):"85.000"
Ciradet(pin):".000"
Note(pin):"تسوية مطالبة رقم17925 باسم حاتم الحسنوني"
Kind(pin):14
UserID(pin):403 */
const SettlementsPage = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const { loginInfo } = useSelector((state) => state.userLogin);
    const { loadingSettlements, settlements = [] } = useSelector((state) => state.settlements);

    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [searchDoc, setSearchDoc] = useState("");
    const [searchDate, setSearchDate] = useState("");

    useEffect(() => {
        if (settlements) {
            const mappedRows = settlements.map((row) => ({
                id: row.ID,
                docNumber: row.DocNum,
                date: row.MDate?.date ? new Date(row.MDate.date).toLocaleDateString("en-GB") : "---",
                description: row.Note,
                amount: parseFloat(row.Debit) || 0,
                paid: parseFloat(row.Ciradet) || 0,
                rawDate: row.MDate?.date ? new Date(row.MDate.date) : null,
            }));
            setRows(mappedRows);
            setFilteredRows(mappedRows);
        }
    }, [settlements]);

    useEffect(() => {
        let result = rows;
        if (searchDoc) {
            result = result.filter((row) => String(row.docNumber).includes(searchDoc));
        }
        if (searchDate) {
            result = result.filter((row) => {
                if (!row.rawDate) return false;
                const d = row.rawDate;
                const formatted = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                return formatted === searchDate;
            });
        }
        setFilteredRows(result);
    }, [searchDoc, searchDate, rows]);

    useEffect(() => {
        if (loginInfo?.BranchID) {
            dispatch(getSettlements(loginInfo.BranchID));
        }
    }, [dispatch, loginInfo?.BranchID]);

    function CustomToolbar() {
        return (
            <GridToolbarContainer sx={{ p: 1, justifyContent: 'flex-end' }}>
                <GridToolbarExport
                    sx={{ fontFamily: 'Almarai', fontWeight: 'bold' }}
                    color="primary"
                    printOptions={{ allColumns: true, includeCheckboxes: false }}
                />
            </GridToolbarContainer>
        );
    }

    const columns = [
        { field: "docNumber", headerName: "رقم المستند", flex: 1, minWidth: 100, headerAlign: 'right', align: 'right' },
        { field: "date", headerName: "التاريخ", flex: 1, minWidth: 100, headerAlign: 'right', align: 'right' },
        { field: "description", headerName: "البيان", flex: 2, minWidth: 200, headerAlign: 'right', align: 'right' },
        { 
            field: "amount", headerName: "المطلوب", flex: 1, minWidth: 100, headerAlign: 'center', align: 'center',
            renderCell: (p) => <Typography sx={{ color: 'green', fontWeight: '900' }}>{p.value.toLocaleString()}</Typography>
        },
        { 
            field: "paid", headerName: "المدفوع", flex: 1, minWidth: 100, headerAlign: 'center', align: 'center',
            renderCell: (p) => <Typography sx={{ color: 'red', fontWeight: '900' }}>{p.value.toLocaleString()}</Typography>
        },
    ];

    return (
        <Box sx={{ p: { xs: 1, md: 3 }, direction: 'rtl', bgcolor: '#fbfbfb', minHeight: '100vh' }}>
            
            <Card sx={{ p: 2, mb: 2, borderRadius: '15px', boxShadow: 'none', border: '1px solid #eee' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                    <FilterListIcon color="primary" />
                    <Typography variant="subtitle1" sx={{ fontFamily: 'Almarai', fontWeight: 'bold' }}>
                        الفلترة والبحث
                    </Typography>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth label="رقم المستند" size="small"
                            value={searchDoc} onChange={(e) => setSearchDoc(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth type="date" label="التاريخ"
                            InputLabelProps={{ shrink: true }} size="small"
                            value={searchDate} onChange={(e) => setSearchDate(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Button 
                            variant="outlined" fullWidth size="medium"
                            onClick={() => {setSearchDoc(""); setSearchDate("");}}
                            sx={{ fontFamily: 'Almarai', borderRadius: '10px' }}
                        >
                            إعادة تعيين
                        </Button>
                    </Grid>
                </Grid>
            </Card>

            {loadingSettlements ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
            ) : (
                <>
                    <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                            <Button 
                                variant="contained" 
                                startIcon={<FileDownloadIcon sx={{ ml: 1 }} />}
                                onClick={() => alert('ميزة التصدير متاحة من خلال جهاز الكمبيوتر')}
                                sx={{ borderRadius: '10px', fontFamily: 'Almarai', fontWeight: 'bold' }}
                            >
                                تصدير البيانات (Excel/PDF)
                            </Button>
                        </Box>
                        
                        <Stack spacing={1.5}>
                            {filteredRows.map((row) => (
                                <Paper key={row.id} sx={{ p: 2, borderRadius: '15px', border: '1px solid #eee', elevation: 0 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: '900', color: 'primary.main' }}>
                                            <ReceiptIcon sx={{ fontSize: 18 }} /> #{row.docNumber}
                                        </Typography>
                                        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                                            <CalendarMonthIcon sx={{ fontSize: 16 }} /> {row.date}
                                        </Typography>
                                    </Box>
                                    
                                    <Typography variant="body2" sx={{ mb: 2, fontWeight: '500', color: '#555' }}>
                                        {row.description}
                                    </Typography>
                                    
                                    <Divider sx={{ mb: 1.5, borderStyle: 'dashed' }} />
                                    
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Box>
                                            <Typography variant="caption" color="textSecondary" display="block">مطلوب (مدين)</Typography>
                                            <Typography sx={{ color: 'green', fontWeight: '900' }}>{row.amount.toLocaleString()} د.ل</Typography>
                                        </Box>
                                        <Box sx={{ textAlign: 'left' }}>
                                            <Typography variant="caption" color="textSecondary" display="block">مدفوع (دائن)</Typography>
                                            <Typography sx={{ color: 'red', fontWeight: '900' }}>{row.paid.toLocaleString()} د.ل</Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            ))}
                        </Stack>
                    </Box>

                    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                        <Paper sx={{ height: 650, borderRadius: '15px', overflow: 'hidden', border: '1px solid #eee' }}>
                            <DataGrid
                                rows={filteredRows}
                                columns={columns}
                                slots={{ toolbar: CustomToolbar }}
                                initialState={{ pagination: { paginationModel: { pageSize: 50 } } }}
                                disableRowSelectionOnClick
                                sx={{
                                    fontFamily: 'Almarai',
                                    border: 'none',
                                    '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f8f9fa' }
                                }}
                            />
                        </Paper>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default SettlementsPage;