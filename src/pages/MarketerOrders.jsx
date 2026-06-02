import React, { useState, useEffect } from 'react';
import { 
    TextField, Button, MenuItem, Grid, Divider, IconButton, 
    Typography, Paper, Container, CircularProgress, InputAdornment, Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addAlertMessage } from '../redux/actions/systemActions';
import { getCities, getPlaces } from '../redux/actions/cityActions';
import { getMarketerStores, addMarketerOrder , getMarketerItemsStores } from '../redux/actions/orderActions';
import axiosFrmData from '../redux/axiosInstances/axiosFrmData';

const AddOrderPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loginInfo } = useSelector((state) => state.userLogin);
    const { stores = [] } = useSelector((state) => state.marketerStores) || {};
    const { cities = [] } = useSelector((state) => state.cities);
    const { places = [] } = useSelector((state) => state.places);

    const [availableItems, setAvailableItems] = useState([]); 
    const [loadingItems, setLoadingItems] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [orderData, setOrderData] = useState({
        CoName: '',      
        Tel1: '',        
        Tel2: '',       
        Adress: '',      
        CitieID: '',     
        StorID: '',     
        ShDate: new Date().toISOString().split('T')[0],
        wasf: '',       
        Amount: '0', 
        Bar1: '1',      
        IDStory: '1',
        Cooling: '0',      
        Packaging: '0',   
        PackagingCost: '0', 
        PackagingAmount: '0', 
        Fragile: '0',     
        CanOpen: '0',      
        ItemsData: []
    });

    useEffect(() => {
        dispatch(getCities());
        dispatch(getPlaces());
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
            Total: String(selectedItem.Price),
            balance: Number(selectedItem.Balance || 0),
            itemName: selectedItem.Name,
            MPric: String(selectedItem.MPric || "0") 
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
        dispatch(addAlertMessage("يرجى إضافة صنف واحد على الأقل", "error"));
        return;
    }
    const outOfStockItems = orderData.ItemsData.filter(item => {
        const requestedQty = Number(item.outcome);
        const availableQty = Number(item.balance);
        return requestedQty > availableQty || availableQty <= 0;
    });

    if (outOfStockItems.length > 0) {
        const itemNames = outOfStockItems.map(i => i.itemName).join(", ");
        dispatch(addAlertMessage(`الكمية المطلوبة غير متوفرة للأصناف: ${itemNames}`, "error"));
        return;
    }
    setIsSubmitting(true);

    const selectedStore = stores.find(s => String(s.StoreID) === String(orderData.StorID));
    const finalMosaID = selectedStore?.MosaID ? String(selectedStore.MosaID) : String(loginInfo?.BranchID || "0");

    try {
        const formData = new FormData();

        // Basic Fields
        formData.append("CoName", String(orderData.CoName));
        formData.append("Tel1", String(orderData.Tel1));
        formData.append("Tel2", orderData.Tel2 ? String(orderData.Tel2) : "0");
        formData.append("Adress", String(orderData.Adress));
        formData.append("CitieID", String(orderData.CitieID));
        formData.append("StorID", String(orderData.StorID));
        formData.append("ShDate", String(orderData.ShDate));
        formData.append("wasf", orderData.wasf ? String(orderData.wasf) : "-");

        // Packaging & Options
        formData.append("PackagingCost", String(orderData.PackagingAmount || "0")); 
        formData.append("Fragile", String(orderData.Fragile));
        formData.append("Cooling", String(orderData.Cooling));
        formData.append("CanOpen", String(orderData.CanOpen));
        formData.append("Packaging", String(orderData.PackagingCost)); 

        formData.append("HalaID", "0");
        formData.append("RemoneID", "0");
        formData.append("Bar1", String(orderData.Bar1));
        formData.append("IDStory", String(orderData.IDStory));
        formData.append("TimeIn", new Date().toLocaleString("sv-SE").replace("T", " "));
        formData.append("MosaID", finalMosaID);
        formData.append("UserID", loginInfo?.SerUser ? String(loginInfo.SerUser) : finalMosaID);
        
        // Calculate total MPric from all items (Unit Commission * Quantity)
        const totalMPric = orderData.ItemsData.reduce((sum, item) => {
            const unitMPric = parseFloat(item.MPric) || 0;
            const quantity = Number(item.outcome) || 0;
            return sum + (unitMPric * quantity);
        }, 0);
        formData.append("MPric", totalMPric.toString()); 

        const totalItemsCount = orderData.ItemsData.reduce((acc, item) => acc + Number(item.outcome || 0), 0);
        formData.append("Count", totalItemsCount.toString());

        const totalAmount = orderData.ItemsData.reduce((sum, item) => sum + Number(item.Total || 0), 0) + Number(orderData.PackagingAmount || 0);
        formData.append("Amount", totalAmount.toString());

        const sanitizedItems = orderData.ItemsData.map(item => {
            const unitMPric = parseFloat(item.MPric) || 0;
            const quantity = Number(item.outcome) || 0;
            return {
                ItemNum: String(item.ItemNum),
                price: String(item.price),
                outcome: String(item.outcome),
                Total: String(item.Total),
                MPric: String(unitMPric * quantity) 
            };
        });
        formData.append("ItemsData", JSON.stringify(sanitizedItems));

        const response = await dispatch(addMarketerOrder(formData));
        
        dispatch(addAlertMessage("تم إرسال الطلبية وحفظها بنجاح"));
        setTimeout(() => navigate(-1), 1000);

    } catch (error) {
        console.error("Save Error:", error);
        dispatch(addAlertMessage("حدث خطأ أثناء الحفظ", "error"));
    } finally {
        setIsSubmitting(false);
    }
};

    const BooleanSelect = ({ label, value, field }) => (
        <Grid item xs={6} md={2}>
            <TextField
                fullWidth select size="small" label={label}
                value={value}
                onChange={(e) => setOrderData({...orderData, [field]: e.target.value})}
            >
                <MenuItem value="0">لا</MenuItem>
                <MenuItem value="1">نعم</MenuItem>
            </TextField>
        </Grid>
    );

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4, direction: 'rtl' }}>
            <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
                <Typography variant="h5" mb={4} fontWeight={800} color="primary" sx={{ textAlign: 'center', fontFamily: 'Almarai' }}>
                    إضافة طلبية جديدة
                </Typography>
                
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth select label="المتجر المصدر" value={orderData.StorID} onChange={handleStoreChange} required>
                                {stores.map((s) => <MenuItem key={s.ID} value={s.StoreID}>{s.ShName}</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth select label="مدينة الزبون" value={orderData.CitieID} onChange={(e) => setOrderData({...orderData, CitieID: e.target.value})} required>
                                {cities.map((city) => <MenuItem key={city.ID} value={city.ID}>{city.CName}</MenuItem>)}
                            </TextField>
                        </Grid>

                        <Grid item xs={12} md={6}><TextField fullWidth label="اسم الزبون" required value={orderData.CoName} onChange={(e) => setOrderData({...orderData, CoName: e.target.value})} /></Grid>
                        <Grid item xs={12} md={6}><TextField fullWidth label="رقم الهاتف" required value={orderData.Tel1} onChange={(e) => setOrderData({...orderData, Tel1: e.target.value})} /></Grid>
                        <Grid item xs={12}><TextField fullWidth label="العنوان" required value={orderData.Adress} onChange={(e) => setOrderData({...orderData, Adress: e.target.value})} /></Grid>

                        <Divider sx={{ width: '100%', my: 2 }} />
                        <Typography variant="subtitle2" sx={{ px: 3, fontWeight: 'bold', width: '100%' }}>إضافات الشحن:</Typography>
                        
                        <BooleanSelect label="تبريد" value={orderData.Cooling} field="Cooling" />
                        
                        <BooleanSelect label="تغليف" value={orderData.Packaging} field="Packaging" />

                        <Grid item xs={6} md={2.5}>
                            <TextField
                                fullWidth select size="small" label="دفع التغليف"
                                value={orderData.PackagingCost}
                                onChange={(e) => setOrderData({...orderData, PackagingCost: e.target.value})}
                            >
                                <MenuItem value="0">على المرسل</MenuItem>
                                <MenuItem value="1">على المستقبل</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={6} md={2.5}>
                            <TextField
                                fullWidth 
                                size="small" 
                                label="قيمة التغليف"
                                value={orderData.PackagingAmount}
                                onChange={(e) => setOrderData({...orderData, PackagingAmount: e.target.value})}
                                InputProps={{ endAdornment: <InputAdornment position="end">د.ل</InputAdornment> }}
                            />
                        </Grid>

                        <BooleanSelect label="قابل للكسر" value={orderData.Fragile} field="Fragile" />
                        
                        <Grid item xs={6} md={2}>
                            <TextField
                                fullWidth select size="small" label="يسمح بالفتح"
                                value={orderData.CanOpen}
                                onChange={(e) => setOrderData({...orderData, CanOpen: e.target.value})}
                            >
                                <MenuItem value="0">لا</MenuItem>
                                <MenuItem value="1">نعم</MenuItem>
                            </TextField>
                        </Grid>

                        <Divider sx={{ width: '100%', my: 2 }} />
                        <Grid item xs={12} md={4}>
                            <TextField fullWidth label="إجمالي المبلغ" value={orderData.Amount} InputProps={{ readOnly: true, endAdornment: <InputAdornment position="end">د.ل</InputAdornment> }} sx={{ bgcolor: '#f9f9f9' }} />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField fullWidth select label="فرع الاستلام" value={orderData.Bar1} onChange={(e) => setOrderData({...orderData, Bar1: e.target.value})} required>
                                {places.map((place) => <MenuItem key={place.ID} value={place.ID}>{place.BName}</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField fullWidth select label="المساحة التخزينية" value={orderData.IDStory} onChange={(e) => setOrderData({...orderData, IDStory: e.target.value})} required>
                                <MenuItem value="1">طرابلس</MenuItem>
                                <MenuItem value="2">بنغازي</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12}><TextField fullWidth multiline rows={2} label="ملاحظات" value={orderData.wasf} onChange={(e) => setOrderData({...orderData, wasf: e.target.value})} /></Grid>

                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                            <Typography variant="h6" fontWeight="bold">الأصناف</Typography>
                            <Button 
                                startIcon={<AddIcon />} variant="outlined" 
                                onClick={() => setOrderData({...orderData, ItemsData: [...orderData.ItemsData, { ItemNum: '', outcome: "1", price: "0", Total: "0", MPric: "0" }]})} 
                                disabled={!orderData.StorID || loadingItems}
                            >
                                إضافة صنف
                            </Button>
                        </Grid>

                        {orderData.ItemsData.map((item, index) => (
                            <Grid container spacing={2} key={index} sx={{ p: 2, m: 0, mb: 1, bgcolor: '#fafafa', borderRadius: 2, border: '1px solid #eee', alignItems: 'center' }}>
                                <Grid item xs={12} md={5}>
                                    <TextField fullWidth select size="small" label="الصنف" required value={item.ItemNum} onChange={(e) => handleItemSelect(index, e.target.value)}>
                                        {availableItems.map((it) => (
                                            <MenuItem key={it.ID} value={it.ID}>{it.Name} ({it.Price} د.ل)</MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={4} md={2}>
                                    <TextField 
                                        fullWidth 
                                        size="small" 
                                        type="number" 
                                        label="الكمية" 
                                        value={item.outcome} 
                                        error={Number(item.outcome) > Number(item.balance)}
                                        helperText={Number(item.outcome) > Number(item.balance) ? `المتوفر: ${item.balance}` : ""}
                                        onChange={(e) => handleQuantityChange(index, e.target.value)} 
                                    />
                                </Grid>
                                <Grid item xs={5} md={3}>
                                    <Typography variant="caption" color="textSecondary" display="block">
                                        العمولة: {(parseFloat(item.MPric) * Number(item.outcome || 0)).toLocaleString()} د.ل
                                    </Typography>
                                    <Typography variant="body2" fontWeight="bold">{item.Total} د.ل</Typography>
                                </Grid>
                                <Grid item xs={2} md={1}>
                                    <IconButton color="error" onClick={() => setOrderData({ ...orderData, ItemsData: orderData.ItemsData.filter((_, i) => i !== index) })}><DeleteIcon /></IconButton>
                                </Grid>
                            </Grid>
                        ))}

                        <Grid item xs={12} mt={3}>
                            <Button 
                                type="submit" variant="contained" fullWidth size="large" disabled={isSubmitting}
                                sx={{ py: 1.5, borderRadius: '12px', fontWeight: 'bold' }}
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