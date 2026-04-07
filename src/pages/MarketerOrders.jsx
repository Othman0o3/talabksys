import React, { useState, useEffect } from 'react';
import { 
    TextField, Button, MenuItem, Grid, Divider, IconButton, 
    Typography, Paper, Container, CircularProgress, Box, InputAdornment
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { getMarketerStores, addMarketerOrder } from '../redux/actions/orderActions';
import axiosFrmData from '../redux/axiosInstances/axiosFrmData';

const AddOrderPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux State
    const { loginInfo } = useSelector((state) => state.userLogin);
    const { stores = [] } = useSelector((state) => state.marketerStores) || {};

    // Local State
    const [availableItems, setAvailableItems] = useState([]); 
    const [loadingItems, setLoadingItems] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [orderData, setOrderData] = useState({
        CoName: '',      
        Tel1: '',        
        Tel2: '',       
        Adress: '',      
        CitieID: '',     
        StorID: '', // سيتم تخزين الـ StoreID (مثل 817) هنا     
        ShDate: new Date().toISOString().split('T')[0],
        HalaID: '0',     
        RemoneID: '0',   
        wasf: '',       
        Count: '1',     
        Amount: '0', 
        Bar1: '1',      
        IDStory: '1',  
        ItemsData: []
    });

    const citiesList = [
        { id: '1', name: 'طرابلس' },
        { id: '2', name: 'بنغازي' },
        { id: '3', name: 'مصراتة' },
        { id: '4', name: 'الزاوية' },
        { id: '5', name: 'زليتن' },
    ];

    useEffect(() => {
        if (loginInfo?.BranchID) {
            dispatch(getMarketerStores(loginInfo.BranchID));
        }
    }, [dispatch, loginInfo]);

    useEffect(() => {
        const totalAmount = orderData.ItemsData.reduce((sum, item) => {
            return sum + (Number(item.Total) || 0);
        }, 0);

        setOrderData(prev => ({
            ...prev,
            Amount: Math.round(totalAmount).toString() 
        }));
    }, [orderData.ItemsData]);

    const handleStoreChange = async (e) => {
        const selectedStoreID = e.target.value;
        
        const selectedStore = stores.find(s => String(s.StoreID) === String(selectedStoreID));
        
        setOrderData({ ...orderData, StorID: selectedStoreID, ItemsData: [] });
        setAvailableItems([]);
        setLoadingItems(true);

        try {
            const fd = new FormData();
            fd.append("BranchID", loginInfo.BranchID);
            
            const { data } = await axiosFrmData.post("/misuq/Misuq_items_stores.php", fd);
            
            const storeName = selectedStore?.ShName || selectedStore?.MName;
            const storePackage = data.find(s => s.ShName === storeName);
            
            if (storePackage && storePackage.Item) {
                setAvailableItems(storePackage.Item);
            }
        } catch (e) { 
            console.error("خطأ في جلب الأصناف:", e); 
        }
        setLoadingItems(false);
    };

    const handleItemSelect = (index, itemID) => {
        const selectedItem = availableItems.find(it => String(it.ID) === String(itemID));
        if (!selectedItem) return;

        const newItems = [...orderData.ItemsData];
        newItems[index] = {
            ItemNum: String(selectedItem.ID),   
            price: String(selectedItem.Price), 
            outcome: "1",
            Total: String(selectedItem.Price)
        };
        setOrderData({ ...orderData, ItemsData: newItems });
    };

    const handleQuantityChange = (index, qty) => {
        const newItems = [...orderData.ItemsData];
        const currentItem = newItems[index];
        const newQty = Number(qty) < 1 ? 1 : Number(qty);

        newItems[index] = {
            ...currentItem,
            outcome: String(newQty),
            Total: String(newQty * Number(currentItem.price || 0))
        };
        setOrderData({ ...orderData, ItemsData: newItems });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (orderData.ItemsData.length === 0) {
            alert("يرجى إضافة صنف واحد على الأقل");
            return;
        }

        setIsSubmitting(true);
        
        try {
            const formData = new FormData();
            
            formData.append("CoName", orderData.CoName);
            formData.append("Tel1", orderData.Tel1);
            formData.append("Tel2", orderData.Tel2 || "");
            formData.append("Adress", orderData.Adress);
            formData.append("CitieID", orderData.CitieID);
            formData.append("StorID", orderData.StorID); 
            formData.append("ShDate", orderData.ShDate);
            formData.append("HalaID", "0");
            formData.append("RemoneID", "0");
            formData.append("wasf", orderData.wasf || "");
            formData.append("Amount", orderData.Amount);
            formData.append("IDStory", orderData.IDStory);
            
            formData.append("MosaID", loginInfo?.BranchID);
            formData.append("UserID", loginInfo?.BranchID);
            
            const totalCount = orderData.ItemsData.reduce((acc, it) => acc + Number(it.outcome || 0), 0);
            formData.append("Count", totalCount.toString());

            formData.append("ItemsData", JSON.stringify(orderData.ItemsData));

            const response = await dispatch(addMarketerOrder(formData));
            alert("تم إرسال الطلبية وحفظها بنجاح");
            setTimeout(() => navigate(-1), 1500);

        } catch (error) {
            console.error("فشل الإرسال:", error);
            alert("حدث خطأ أثناء الحفظ، يرجى التأكد من البيانات");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
                <Typography variant="h5" mb={4} fontWeight={800} color="primary" sx={{ textAlign: 'center' }}>
                    إضافة طلبية جديدة (المسوقين)
                </Typography>
                
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField 
                                fullWidth select label="المتجر المصدر" 
                                value={orderData.StorID} 
                                onChange={handleStoreChange} required
                            >
                                {stores.map((s) => (
                                    <MenuItem key={s.ID} value={s.StoreID}>
                                        {s.ShName}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth select label="مدينة الزبون" value={orderData.CitieID} onChange={(e) => setOrderData({...orderData, CitieID: e.target.value})} required>
                                {citiesList.map((city) => <MenuItem key={city.id} value={city.id}>{city.name}</MenuItem>)}
                            </TextField>
                        </Grid>

                        <Divider sx={{ width: '100%', my: 1 }} />

                        <Grid item xs={12} md={6}>
                            <TextField fullWidth label="اسم الزبون" required value={orderData.CoName} onChange={(e) => setOrderData({...orderData, CoName: e.target.value})} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth label="رقم الهاتف" required value={orderData.Tel1} onChange={(e) => setOrderData({...orderData, Tel1: e.target.value})} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="العنوان" required value={orderData.Adress} onChange={(e) => setOrderData({...orderData, Adress: e.target.value})} />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField fullWidth label="ملاحظات (وصف)" value={orderData.wasf} onChange={(e) => setOrderData({...orderData, wasf: e.target.value})} />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField 
                                fullWidth label="إجمالي المبلغ" value={orderData.Amount} 
                                InputProps={{ readOnly: true, endAdornment: <InputAdornment position="end">د.ل</InputAdornment> }}
                                sx={{ bgcolor: '#f9f9f9' }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth select label="فرع الاستلام" value={orderData.IDStory} onChange={(e) => setOrderData({...orderData, IDStory: e.target.value})}>
                                <MenuItem value="1">طرابلس</MenuItem>
                                <MenuItem value="2">بنغازي</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                            <Typography variant="h6" fontWeight="bold">الأصناف</Typography>
                            <Button 
                                startIcon={<AddIcon />} variant="outlined" 
                                onClick={() => setOrderData({...orderData, ItemsData: [...orderData.ItemsData, { ItemNum: '', outcome: "1", price: "0", Total: "0" }]})} 
                                disabled={!orderData.StorID || loadingItems}
                            >
                                إضافة صنف
                            </Button>
                        </Grid>

                        {loadingItems && <CircularProgress size={24} sx={{ m: 'auto', display: 'block' }} />}

                        {orderData.ItemsData.map((item, index) => (
                            <Grid container spacing={2} key={index} sx={{ p: 2, m: 0, mb: 1, bgcolor: '#fafafa', borderRadius: 2, border: '1px solid #eee' }}>
                                <Grid item xs={12} md={5}>
                                    <TextField 
                                        fullWidth select size="small" label="اختر الصنف" required 
                                        value={item.ItemNum}
                                        onChange={(e) => handleItemSelect(index, e.target.value)}
                                    >
                                        {availableItems.map((it) => (
                                            <MenuItem key={it.ID} value={it.ID}>
                                                {it.Name} ({it.Price} د.ل)
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={5} md={3}>
                                    <TextField 
                                        fullWidth size="small" type="number" label="الكمية" 
                                        value={item.outcome} 
                                        onChange={(e) => handleQuantityChange(index, e.target.value)} 
                                    />
                                </Grid>
                                <Grid item xs={5} md={3} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="body2" fontWeight="bold">{item.Total} د.ل</Typography>
                                </Grid>
                                <Grid item xs={2} md={1}>
                                    <IconButton color="error" onClick={() => setOrderData({ ...orderData, ItemsData: orderData.ItemsData.filter((_, i) => i !== index) })}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}

                        <Grid item xs={12} mt={3}>
                            <Button 
                                type="submit" variant="contained" fullWidth size="large" disabled={isSubmitting}
                                sx={{ py: 1.5, borderRadius: '12px' }}
                                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                            >
                                {isSubmitting ? 'جاري الحفظ...' : 'تأكيد الطلبية'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default AddOrderPage;