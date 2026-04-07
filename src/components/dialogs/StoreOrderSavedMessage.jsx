import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
} from "@mui/material";

// icons
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { CONFIRM_ADD_STORE_ORDER_MESSAGE } from "../../redux/constants/orderConstants";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StoreOrderSavedMessage = () => {
  const dispatch = useDispatch();

  const { orderId } = useSelector((state) => state.storeOrders);

  return (
    <Dialog
      open={orderId ? true : false}
      TransitionComponent={Transition}
      keepMounted
    >
      <DialogTitle style={{ minWidth: "300px" }}>
        {"تم حفظ الطلبية"}
      </DialogTitle>
      <DialogContent>
        <div
          style={{
            display: "flex",
            flexFlow: "row wrap",
            justifyContent: "start",
            alignItems: "center",
          }}
        >
          <div className="d-flex flex-row gap-2 flex-wrap mb-3">
            <p style={{ margin: 0 }}>رقم الطلبية: </p>
            <p style={{ margin: 0 }}>{orderId}</p>
          </div>
          <CheckCircleOutlineRoundedIcon
            style={{ fontSize: "3rem", color: "green", margin: "5px auto" }}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => dispatch({ type: CONFIRM_ADD_STORE_ORDER_MESSAGE })}
        >
          موافق
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StoreOrderSavedMessage;
