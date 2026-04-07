import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import {
  TextField,
  Button,
  Autocomplete,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  CircularProgress,
  Checkbox,
  Stack,
  Divider
} from "@mui/material";
import { getCities, getPlaces } from "../redux/actions/cityActions";
import CustomDatePicker from "../components/CustomDatePicker";
import StoreOrderDetailsGridView from "../components/grid-view/StoreOrderDetailsGridView";
import {
  addStoreOrder,
  getStorages,
  updateOrder,
} from "../redux/actions/orderActions";
import { getItems } from "../redux/actions/itemActions";

// دالة مساعدة لتنسيق التاريخ للسيرفر
const formatDateToString = (dateValue) => {
  const d = new Date(dateValue);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} 00:00:00.000`;
};

const StoreOrderDetailsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  // Redux States
  const { loginInfo } = useSelector((state) => state.userLogin);
  const { loadingCities, cities } = useSelector((state) => state.cities);
  const { loadingPlaces, places } = useSelector((state) => state.places);
  const { storeOrders } = useSelector((state) => state.storeOrders);
  const { storages } = useSelector((state) => state.storages);
  const { items } = useSelector((state) => state.items);

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [city, setCity] = useState(null);
  const [place, setPlace] = useState(null);
  const [storage, setStorage] = useState(null);
  const [item, setItem] = useState(null);
  const [address, setAddress] = useState("");
  const [date, setDate] = useState(Date.now());
  const [description, setDescription] = useState("");
  const [transaction, setTransaction] = useState("0");
  const [deliveryPrice, setDeliveryPrice] = useState("0");
  const [itemQuantity, setItemQuantity] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [balance, setBalance] = useState("");
  const [total, setTotal] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [shippmentPrice, setShippmentPrice] = useState(0);

  // Special Status State
  const [isCooling, setIsCooling] = useState("0"); 
  const [isPackaging, setIsPackaging] = useState("0");
  const [isFragile, setIsFragile] = useState("0");
  const [canOpen, setCanOpen] = useState("0");

  // Errors state
  const [itemErr, setItemErr] = useState("");
  const [itemQuantityErr, setItemQuantityErr] = useState("");
  const [itemPriceErr, setItemPriceErr] = useState("");
  const [storageErr, setStorageErr] = useState("");
  const [preventUpdate, setPreventUpdate] = useState(false);

  // Handlers
  const handlePhone1Change = (e) => setPhone1(e.target.value.replace(/[^0-9+]/g, "").slice(0, 10));
  const handlePhone2Change = (e) => setPhone2(e.target.value.replace(/[^0-9+]/g, "").slice(0, 10));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (preventUpdate || orderItems.length === 0) {
        if(orderItems.length === 0) alert("يرجى إضافة أصناف للسلة أولاً");
        return;
    }

    const amount = orderItems.reduce((acc, i) => acc + Number(i.Total), 0);
    const count = orderItems.reduce((acc, i) => acc + Number(i.outcome), 0);
    const shDateStr = formatDateToString(date);

    const commonData = {
      CoName: customerName,
      Tel1: phone1,
      Tel2: phone2,
      Adress: address,
      wasf: description,
      Count: count,
      Amount: amount,
      ShDate: shDateStr,
      IDStory: storage?.ynum,
      StorID: loginInfo.BranchID,
      Cooling: isCooling,
      Packaging: isPackaging,
      Fragile: isFragile,
      CanOpen: canOpen,
      RemoneID: transaction.toString(),
      HalaID: deliveryPrice.toString(),
      ItemsData: JSON.stringify(orderItems.map(i => ({
        ItemNum: i.itemNum,
        price: i.price,
        outcome: i.outcome,
        Total: i.Total,
        IDate: i.IDate || shDateStr,
        IDStor: i.IDStor || loginInfo.BranchID,
        IDStory: i.IDStory || storage?.ynum
      })))
    };

    if (id) {
      dispatch(updateOrder({ ...commonData, ID: id, CitiesID: city?.ID, Bar1: place?.ID?.toString() }));
    } else {
      dispatch(addStoreOrder({ 
        ...commonData, 
        CitieID: city?.ID, 
        Bar1: place?.ID,
        UserID: loginInfo.SerUser,
        TimeIn: new Date().toLocaleTimeString("en-US", { hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit" })
      }));
    }
    navigate("/store-order");
  };

  const handleAddItem = () => {
    if (!item) return setItemErr("يرجى إختيار الصنف");
    if (!itemQuantity || itemQuantity < 1) return setItemQuantityErr("الكمية غير صحيحة");
    if (!itemPrice) return setItemPriceErr("يرجى إدخال السعر");
    if (!storage) return setStorageErr("يرجى إختيار المساحة");

    const itemUsedInBasket = orderItems.find(i => i.itemNum === item.ID);
    const currentQtyInBasket = itemUsedInBasket ? Number(itemUsedInBasket.outcome) : 0;
    
    if (Number(itemQuantity) + currentQtyInBasket > item.Balance) {
      return setItemQuantityErr("الكمية المتوفرة لا تكفي");
    }

    const newItem = {
      id: item.ID,
      itemNum: item.ID,
      itemName: item.Name,
      price: Number(itemPrice),
      outcome: Number(itemQuantity),
      Total: Number(itemQuantity) * Number(itemPrice),
      IDate: formatDateToString(date),
      IDStor: loginInfo.BranchID,
      IDStory: storage.ynum,
    };

    const existingIdx = orderItems.findIndex(i => i.itemNum === newItem.itemNum);
    if (existingIdx !== -1) {
      const updated = [...orderItems];
      updated[existingIdx].outcome = Number(updated[existingIdx].outcome) + Number(itemQuantity);
      updated[existingIdx].Total = updated[existingIdx].outcome * Number(itemPrice);
      setOrderItems(updated);
    } else {
      setOrderItems([...orderItems, newItem]);
    }
    
    // Reset item fields
    setItem(null);
    setItemQuantity("");
    setBalance("");
    setTotal("");
  };

  useEffect(() => {
    const totalAmount = orderItems.reduce((acc, i) => acc + Number(i.Total), 0);
    setShippmentPrice(totalAmount);
  }, [orderItems]);

  useEffect(() => {
    if (itemPrice && itemQuantity) setTotal(Number(itemPrice) * Number(itemQuantity));
    else setTotal("");
  }, [itemPrice, itemQuantity]);

  // Load Data for Edit
  useEffect(() => {
    if (cities.length > 0 && places.length > 0 && storages.length > 0 && id) {
      const storeOrder = storeOrders.find(item => item.ID == id);
      if (storeOrder) {
        setCustomerName(storeOrder.CoName);
        setPhone1(storeOrder.Tel1);
        setPhone2(storeOrder.Tel2);
        setAddress(storeOrder.Adress);
        setCity(cities.find(c => c.CName === storeOrder.CName) || null);
        setPlace(places.find(p => p.ID === Number(storeOrder.Bar1)) || null);
        setStorage(storages.find(s => s.ynum === storeOrder.IDStory) || null);
        setDate(storeOrder.ShDate.date);
        setTransaction(storeOrder.RemoneID.toString());
        setDeliveryPrice(storeOrder.HalaID.toString());
        setDescription(storeOrder.wasf);
        setIsCooling(storeOrder.Cooling || "0");
        setIsPackaging(storeOrder.Packaging || "0");
        setIsFragile(storeOrder.Fragile || "0");
        setCanOpen(storeOrder.CanOpen || "0");
        setOrderItems(storeOrder.Item.map((it, idx) => ({
          id: it.ItemNum,
          itemNum: it.ItemNum,
          itemName: it.Name,
          outcome: it.outcome,
          price: it.Pric,
          Total: it.Pric * it.outcome,
        })));
        setPreventUpdate(storeOrder.ShCase !== 1);
      }
    }
  }, [id, cities, places, storages, storeOrders]);

  useEffect(() => {
    dispatch(getCities());
    dispatch(getPlaces());
    dispatch(getStorages());
    dispatch(getItems(loginInfo.BranchID));
  }, [dispatch, loginInfo.BranchID]);

  return (
    <form onSubmit={handleSubmit} className="store-order-details-page">
      {loadingCities || loadingPlaces ? (
        <CircularProgress style={{ display: 'block', margin: "50px auto" }} />
      ) : (
        <>
          <Row style={{ margin: "10px auto" }}>
            {/* Customer Data */}
            <Col sm={12} lg={id ? 6 : 4} style={{ marginBottom: "30px" }}>
              <div className="order-details-data-container">
                <h4>بيانات الزبون</h4>
                <div className="order-details-customer">
                  <Row spacing={1.5}>
                    <Col xs={12} md={6} className="mb-3">
                      <TextField fullWidth required label="اسم المستلم" value={customerName} onChange={(e) => setCustomerName(e.target.value)} disabled={preventUpdate} />
                    </Col>
                    <Col xs={12} md={6} className="mb-3">
                      <TextField required fullWidth label="رقم الهاتف 1" value={phone1} onChange={handlePhone1Change} disabled={preventUpdate} />
                    </Col>
                    <Col xs={12} md={6} className="mb-3">
                      <TextField required fullWidth label="العنوان" value={address} onChange={(e) => setAddress(e.target.value)} disabled={preventUpdate} />
                    </Col>
                    <Col xs={12} md={6} className="mb-3">
                      <TextField fullWidth label="رقم الهاتف 2" value={phone2} onChange={handlePhone2Change} disabled={preventUpdate} />
                    </Col>
                    <Col xs={12} className="mb-3">
                      <Autocomplete options={cities} getOptionLabel={(o) => o.CName} value={city} onChange={(e, v) => setCity(v)} disabled={preventUpdate}
                        renderInput={(p) => <TextField {...p} required label="المدينة" />} />
                    </Col>
                    <Col xs={12}>
                      <CustomDatePicker label="تاريخ الشحنة" value={date} setValue={setDate} disabled={preventUpdate} />
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>

            {/* Shipment Data */}
            <Col sm={12} lg={id ? 6 : 4} style={{ marginBottom: "30px" }}>
              <div className="order-details-data-container">
                <h4>بيانات الشحنة</h4>
                <div className="order-details-customer">
                  <Row>
                    <Col xs={12} md={6} className="mb-3">
                      <Autocomplete options={places} getOptionLabel={(o) => o.BName} value={place} onChange={(e, v) => setPlace(v)} disabled={preventUpdate}
                        renderInput={(p) => <TextField {...p} required label="مكان الإستلام" />} />
                    </Col>
                    <Col xs={12} md={6} className="mb-3">
                      <Autocomplete options={storages} getOptionLabel={(o) => o.yname} value={storage} onChange={(e, v) => { setStorage(v); setStorageErr(""); }} disabled={preventUpdate}
                        renderInput={(p) => <TextField {...p} required label="المساحة التخزينية" error={!!storageErr} helperText={storageErr} />} />
                    </Col>
                    <Col xs={12} className="mb-3">
                      <TextField fullWidth label="قيمة الشحنة" value={Number(shippmentPrice).toLocaleString()} disabled />
                    </Col>
                    <Col xs={12} className="mb-2">
                      <TextField fullWidth label="وصف الشحنة" value={description} onChange={(e) => setDescription(e.target.value)} disabled={preventUpdate} />
                    </Col>
                    
                    {/* الخيارات الخاصة - التبريد والتغليف */}
                    <Col xs={12} className="mb-2">
                        <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
                            <FormControlLabel control={<Checkbox size="small" checked={isCooling === "1"} onChange={(e) => setIsCooling(e.target.checked ? "1" : "0")} disabled={preventUpdate} />} label="تبريد" />
                            <FormControlLabel control={<Checkbox size="small" checked={isPackaging === "1"} onChange={(e) => setIsPackaging(e.target.checked ? "1" : "0")} disabled={preventUpdate} />} label="تغليف" />
                            <FormControlLabel control={<Checkbox size="small" checked={isFragile === "1"} onChange={(e) => setIsFragile(e.target.checked ? "1" : "0")} disabled={preventUpdate} />} label="قابل للكسر" />
                            <FormControlLabel control={<Checkbox size="small" checked={canOpen === "1"} onChange={(e) => setCanOpen(e.target.checked ? "1" : "0")} disabled={preventUpdate} />} label="فتح الطرد" />
                        </Stack>
                    </Col>

                    <Divider sx={{ my: 1, width: '100%' }} />

                    <Col xs={12} className="text-center">
                      <FormControl component="fieldset">
                        <FormLabel component="legend" sx={{ fontSize: '0.8rem' }}>سداد التوصيل</FormLabel>
                        <RadioGroup row value={deliveryPrice} onChange={(e) => setDeliveryPrice(e.target.value)}>
                          <FormControlLabel value="0" control={<Radio size="small" disabled={preventUpdate} />} label="المستلم" />
                          <FormControlLabel value="1" control={<Radio size="small" disabled={preventUpdate} />} label="المرسل" />
                        </RadioGroup>
                      </FormControl>
                      <FormControl component="fieldset" sx={{ ml: 2 }}>
                        <FormLabel component="legend" sx={{ fontSize: '0.8rem' }}>سداد الحوالة</FormLabel>
                        <RadioGroup row value={transaction} onChange={(e) => setTransaction(e.target.value)}>
                          <FormControlLabel value="0" control={<Radio size="small" disabled={preventUpdate} />} label="المستلم" />
                          <FormControlLabel value="1" control={<Radio size="small" disabled={preventUpdate} />} label="المرسل" />
                        </RadioGroup>
                      </FormControl>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>

            {/* Item Data (Only in Create Mode) */}
            {!id && (
              <Col sm={12} lg={4}>
                <div className="order-details-data-container">
                  <h4>بيانات الصنف</h4>
                  <div className="order-details-customer">
                    <Row>
                      <Col xs={12} className="mb-3">
                        <Autocomplete options={items.filter(i => i.Balance > 0)} getOptionLabel={(o) => `${o.Name} (متوفر: ${o.Balance})`} value={item} 
                          onChange={(e, v) => { setItem(v); setItemPrice(v?.Price || ""); setBalance(v?.Balance || ""); setItemErr(""); }}
                          renderInput={(p) => <TextField {...p} label="اسم الصنف" error={!!itemErr} helperText={itemErr} />} />
                      </Col>
                      <Col xs={6} className="mb-3">
                        <TextField fullWidth type="number" label="الكمية" value={itemQuantity} error={!!itemQuantityErr} helperText={itemQuantityErr}
                          onChange={(e) => { setItemQuantity(e.target.value); setItemQuantityErr(""); }} />
                      </Col>
                      <Col xs={6} className="mb-3">
                        <TextField fullWidth type="number" label="السعر" value={itemPrice} error={!!itemPriceErr} helperText={itemPriceErr}
                          onChange={(e) => { setItemPrice(e.target.value); setItemPriceErr(""); }} />
                      </Col>
                      <Col xs={6}>
                        <TextField fullWidth disabled label="الرصيد" value={balance} />
                      </Col>
                      <Col xs={6}>
                        <TextField fullWidth disabled label="الإجمالي" value={total} />
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
            )}
          </Row>

          {/* Action Buttons */}
          <Row className="mt-4 justify-content-center">
            {!id && (
              <Col xs={12} sm={3} className="mb-2">
                <Button fullWidth variant="contained" className="secondary-btn" onClick={handleAddItem}>إضافة للسلة</Button>
              </Col>
            )}
            <Col xs={12} sm={3} className="mb-2">
              <Button fullWidth type="submit" variant="contained" className="secondary-btn" disabled={preventUpdate}>
                {id ? "تعديل الشحنة" : "تسجيل الشحنة"}
              </Button>
            </Col>
            {!id && (
                <Col xs={12} sm={3} className="mb-2">
                    <Button fullWidth variant="contained" className="primary-btn" onClick={() => setOrderItems([])}>إفراغ السلة</Button>
                </Col>
            )}
            <Col xs={12} sm={3} className="mb-2">
              <Button fullWidth variant="contained" className="primary-btn" onClick={() => navigate("/store-order")}>رجوع</Button>
            </Col>
          </Row>

          <StoreOrderDetailsGridView rows={orderItems} setRows={setOrderItems} preventUpdate={preventUpdate} id={id} />
        </>
      )}
    </form>
  );
};

export default StoreOrderDetailsPage;