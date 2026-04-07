import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress, TextField, IconButton } from "@mui/material";

// components
import DeliveryOrderCard from "../components/DeliveryOrderCard";
import ReturnReason from "../components/dialogs/ReturnReason";
import ConfirmCaseChange from "../components/dialogs/ConfirmCaseChange";

// icons
import ClearIcon from "@mui/icons-material/Clear";

// actions
import {
  getDeliveryOrders,
  setDeliveryOrdersSearchText,
} from "../redux/actions/orderActions";

const DeliveryOrdersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loginInfo } = useSelector((state) => state.userLogin);

  const { loadingDeliveryOrders, deliveryOrders, type } = useSelector(
    (state) => state.deliveryOrders
  );

  const { text } = useSelector((state) => state.deliveryOrdersSearchText);

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    text
      ? setOrders(
          deliveryOrders.filter(
            (order) =>
              String(order.ID).includes(text) ||
              order.Adress.includes(text) ||
              order.Tel1.includes(text) ||
              order.Tel2.includes(text) ||
              order.CName.includes(text)
          )
        )
      : setOrders(deliveryOrders);
  }, [text]);

  useEffect(() => {
    text
      ? setOrders(
          deliveryOrders.filter(
            (order) =>
              String(order.ID).includes(text) ||
              order.Adress.includes(text) ||
              order.Tel1.includes(text) ||
              order.Tel2.includes(text) ||
              order.CName.includes(text)
          )
        )
      : setOrders(deliveryOrders);
  }, [deliveryOrders]);

  useEffect(() => {
    switch (type) {
      case "done":
        dispatch(getDeliveryOrders(loginInfo.BranchID, 4));
        break;
      case "shipping":
        dispatch(getDeliveryOrders(loginInfo.BranchID, 3));
        break;
      case "returned":
        dispatch(getDeliveryOrders(loginInfo.BranchID, 7));
        break;
    }

    return () => {
      dispatch(setDeliveryOrdersSearchText(""));
    };
  }, []);

  return (
    <div
      className="d-flex justify-content-start align-items-center flex-column flex-wrap p-2 gap-3"
      style={{ minHeight: "90vh" }}
    >
      <ReturnReason />
      <ConfirmCaseChange />
      {loadingDeliveryOrders ? (
        <CircularProgress style={{ margin: "auto" }} />
      ) : (
        <>
          <div className="d-flex justify-content-center align-items-center flex-row flex-wrap w-100 mb-3">
            <TextField
              fullWidth
              autoComplete="off"
              style={{ maxWidth: "400px", alignSelf: "start" }}
              label="بحث"
              placeholder="رقم الطلبية أو العنوان أو رقم الهاتف"
              value={text}
              onChange={(e) =>
                dispatch(setDeliveryOrdersSearchText(e.target.value))
              }
              InputProps={{
                endAdornment: text && (
                  <IconButton
                    onClick={() => dispatch(setDeliveryOrdersSearchText(""))}
                    edge="end"
                  >
                    <ClearIcon />
                  </IconButton>
                ),
              }}
            />
          </div>
          <div className="d-flex justify-content-center align-items-start flex-row flex-wrap gap-5 p-1">
            {orders.map((order) => {
              return (
                <DeliveryOrderCard
                  key={order.ID}
                  orderNumber={order.ID}
                  storeName={order.ShName}
                  date={new Date(order.ShDate.date).toLocaleDateString("en-GB")}
                  address={order.Adress}
                  phone={order.Tel1 || order.Tel2}
                  amount={order.Total}
                  description={order.wasf}
                  reasonText={order.ResText}
                  reasonName={order.ReName}
                  storePhone1={order.StoreNumber1} 
                  storePhone2={order.StoreNumber2}
                  storePhone3={order.StoreNumber3}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default DeliveryOrdersPage;
