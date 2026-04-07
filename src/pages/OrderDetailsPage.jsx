import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  Box, Grid, Typography, CircularProgress, TextField, 
  Button, Autocomplete, Radio, RadioGroup, FormControlLabel, 
  FormControl, FormLabel, Paper, Stack, Divider, IconButton , Container
} from "@mui/material";

// Icons
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SaveIcon from "@mui/icons-material/Save";

// Components & Actions
import CustomDatePicker from "../components/CustomDatePicker";
import { getCities, getPlaces } from "../redux/actions/cityActions";
import { addOrder, changeOrderSearchType, updateOrder } from "../redux/actions/orderActions";

const OrderDetailsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const { loginInfo } = useSelector((state) => state.userLogin);
  const { cities } = useSelector((state) => state.cities);
  const { places } = useSelector((state) => state.places);
  const { loadingAddOrder, loadingUpdateOrder, orders } = useSelector((state) => state.orders);

  const [customerName, setCustomerName] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [city, setCity] = useState(null);
  const [place, setPlace] = useState(null);
  const [address, setAddress] = useState("");
  const [date, setDate] = useState(Date.now());
  const [amount, setAmount] = useState("");
  const [pcsCount, setPcsCount] = useState("");
  const [description, setDescription] = useState("");
  const [transaction, setTransaction] = useState("0");
  const [deliveryPrice, setDeliveryPrice] = useState("0");
  
  const [isCooling, setIsCooling] = useState("0"); 
  const [isPackaging, setIsPackaging] = useState("0");
  const [isFragile, setIsFragile] = useState("0");
  const [canOpen, setCanOpen] = useState("0");

  const [preventUpdate, setPreventUpdate] = useState(false);

  // Form Handlers
  const handlePhoneChange = (setter) => (e) => {
    const value = e.target.value.replace(/[^0-9+]/g, "").slice(0, 10);
    setter(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (preventUpdate) return;

    const shDate = new Date(date);
    const shDateString = `${shDate.getFullYear()}-${String(shDate.getMonth() + 1).padStart(2, "0")}-${String(shDate.getDate()).padStart(2, "0")} 00:00:00.000`;

    const commonData = {
      CoName: customerName,
      Tel1: phone1,
      Tel2: phone2,
      Adress: address,
      HalaID: deliveryPrice.toString(),
      RemoneID: transaction.toString(),
      wasf: description,
      Count: pcsCount,
      Bar1: place?.ID?.toString(),
      Amount: amount.toString(),
      Cooling: isCooling,
      Packaging: isPackaging,
      Fragile: isFragile,
      CanOpen: canOpen
    };

    if (id) {
      dispatch(updateOrder({ ...commonData, ID: id, CitiesID: city?.ID }));
    } else {
      dispatch(addOrder({
        ...commonData,
        CitieID: city?.ID,
        ShDate: shDateString,
        StorID: loginInfo.BranchID.toString(),
        TimeIn: new Date().toLocaleTimeString("en-US", { hour12: false }),
        UserID: loginInfo.SerUser.toString(),
      }));
    }
    dispatch(changeOrderSearchType("all"));
    navigate("/orders");
  };

  useEffect(() => {
    dispatch(getCities());
    dispatch(getPlaces());
  }, [dispatch]);

  useEffect(() => {
    if (cities.length > 0 && places.length > 0 && id) {
      const order = orders.find((item) => item.ID == id);
      if (order) {
        setCustomerName(order.CoName);
        setPhone1(order.Tel1);
        setPhone2(order.Tel2);
        setAddress(order.Adress);
        setCity(cities.find((c) => c.CName === order.CName) || null);
        setDate(order.ShDate?.date || Date.now());
        setTransaction(order.RemoneID || "0");
        setDeliveryPrice(order.HalaID || "0");
        setDescription(order.wasf || "");
        setPlace(places.find((p) => p.ID == order.Bar1) || null);
        setAmount(order.Amount || "");
        setPcsCount(order.Count || "");
        setPreventUpdate(order.ShCase !== 1);
      }
    }
  }, [id, cities, places, orders]);

  return (
    <Box sx={{ bgcolor: 'var(--background-color-2)', minHeight: '100vh', py: { xs: 2, md: 4 }, direction: 'rtl' }}>
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <ArrowBackIosNewIcon sx={{ fontSize: 18, color: 'var(--primary-color)' }} />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'Almarai' }}>
            {id ? "تعديل بيانات الشحنة" : "إضافة شحنة جديدة"}
          </Typography>
        </Stack>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: '16px', border: '1px solid #f0f0f0', height: '100%' }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                  <PersonOutlineIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Almarai' }}>بيانات الزبون</Typography>
                </Stack>
                <Stack spacing={2.5}>
                  <TextField required fullWidth label="اسم المستلم" value={customerName} onChange={(e) => setCustomerName(e.target.value)} disabled={preventUpdate} />
                  <Stack direction="row" spacing={2}>
                    <TextField required fullWidth label="رقم الهاتف 1" placeholder="09xxxxxxx" value={phone1} onChange={handlePhoneChange(setPhone1)} disabled={preventUpdate} />
                    <TextField fullWidth label="رقم الهاتف 2" placeholder="09xxxxxxx" value={phone2} onChange={handlePhoneChange(setPhone2)} disabled={preventUpdate} />
                  </Stack>
                  <Autocomplete
                    options={cities}
                    getOptionLabel={(option) => option.CName}
                    value={city}
                    onChange={(_, v) => setCity(v)}
                    disabled={preventUpdate}
                    renderInput={(params) => <TextField {...params} required label="المدينة" />}
                  />
                  <TextField required fullWidth label="العنوان بالتفصيل" value={address} onChange={(e) => setAddress(e.target.value)} disabled={preventUpdate} />
                  <CustomDatePicker label="تاريخ الشحنة" value={date} setValue={setDate} disabled={preventUpdate} />
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: '16px', border: '1px solid #f0f0f0' }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                  <LocalShippingIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Almarai' }}>بيانات الشحنة</Typography>
                </Stack>
                <Stack spacing={2.5}>
                  <Autocomplete
                    options={places}
                    getOptionLabel={(option) => option.BName}
                    value={place}
                    onChange={(_, v) => setPlace(v)}
                    disabled={preventUpdate}
                    renderInput={(params) => <TextField {...params} required label="مكان الإستلام" />}
                  />
                  <Stack direction="row" spacing={2}>
                    <TextField required fullWidth type="number" label="قيمة الشحنة" value={amount} onChange={(e) => setAmount(e.target.value)} disabled={preventUpdate} />
                    <TextField required fullWidth type="number" label="عدد القطع" value={pcsCount} onChange={(e) => setPcsCount(e.target.value)} disabled={preventUpdate} />
                  </Stack>
                  <TextField fullWidth multiline rows={2} label="وصف الشحنة (اختياري)" value={description} onChange={(e) => setDescription(e.target.value)} disabled={preventUpdate} />
                  
                  <Divider />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <RadioField label="سداد التوصيل" value={deliveryPrice} onChange={setDeliveryPrice} options={[{v:"0", l:"المستلم"}, {v:"1", l:"المرسل"}]} disabled={preventUpdate} />
                    </Grid>
                    <Grid item xs={6}>
                      <RadioField label="سداد الحوالة" value={transaction} onChange={setTransaction} options={[{v:"0", l:"المستلم"}, {v:"1", l:"المرسل"}]} disabled={preventUpdate} />
                    </Grid>
                    <Grid item xs={6}>
                      <RadioField label="تحتاج تبريد" value={isCooling} onChange={setIsCooling} options={[{v:"0", l:"نعم"}, {v:"1", l:"لا"}]} disabled={preventUpdate} />
                    </Grid>
                    <Grid item xs={6}>
                      <RadioField label="تحتاج تغليف" value={isPackaging} onChange={setIsPackaging} options={[{v:"0", l:"نعم"}, {v:"1", l:"لا"}]} disabled={preventUpdate} />
                    </Grid>
                    <Grid item xs={6}>
                      <RadioField label="قابلة للكسر" value={isFragile} onChange={setIsFragile} options={[{v:"0", l:"نعم"}, {v:"1", l:"لا"}]} disabled={preventUpdate} />
                    </Grid>
                    <Grid item xs={6}>
                      <RadioField label="فتح الشحنة" value={canOpen} onChange={setCanOpen} options={[{v:"0", l:"نعم"}, {v:"1", l:"لا"}]} disabled={preventUpdate} />
                    </Grid>
                  </Grid>
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            {!preventUpdate && (
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={(loadingAddOrder || loadingUpdateOrder) ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                sx={{ bgcolor: 'var(--primary-color)', px: 6, borderRadius: '12px', fontWeight: 'bold', height: '50px' }}
                disabled={loadingAddOrder || loadingUpdateOrder}
              >
                {id ? "حفظ التعديلات" : "إضافة الشحنة"}
              </Button>
            )}
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate(-1)}
              sx={{ px: 6, borderRadius: '12px', fontWeight: 'bold', borderColor: '#ddd', color: '#555' }}
            >
              إلغاء
            </Button>
          </Box>
        </form>
      </Container>
    </Box>
  );
};

const RadioField = ({ label, value, onChange, options, disabled }) => (
  <FormControl component="fieldset">
    <FormLabel sx={{ fontSize: '0.85rem', fontWeight: 700, mb: 0.5, fontFamily: 'Almarai' }}>{label}</FormLabel>
    <RadioGroup row value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((opt) => (
        <FormControlLabel 
          key={opt.v} 
          value={opt.v} 
          control={<Radio size="small" disabled={disabled} />} 
          label={<Typography sx={{ fontSize: '0.9rem', fontFamily: 'Almarai' }}>{opt.l}</Typography>} 
        />
      ))}
    </RadioGroup>
  </FormControl>
);

export default OrderDetailsPage;