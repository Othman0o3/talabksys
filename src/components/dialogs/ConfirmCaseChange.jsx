import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  TextField,
} from "@mui/material";
import {
  clearOrderCase,
  confirmShippment,
  getDeliveryOrders,
  returnShippment,
  setDeliveryOrdersSearchText,
} from "../../redux/actions/orderActions";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ConfirmCaseChange = () => {
  const dispatch = useDispatch();

  const { loginInfo } = useSelector((state) => state.userLogin);
  const { type } = useSelector((state) => state.deliveryOrders);

  const { orderId, storeName, reasonId, reasonText, toCase } = useSelector(
    (state) => state.changeOrderCase
    );
    
    const { deliveryOrders } = useSelector((state) => state.deliveryOrders);
    
    const [note, setNote] = useState("");
    
    const onConfirm = () => {
    dispatch(setDeliveryOrdersSearchText(""));
    dispatch((dispatch) => {
      if (toCase === 4 && orderId !== "") {
        const order = deliveryOrders.find((i) => i.ID == orderId);
        dispatch(confirmShippment(orderId, loginInfo.BranchID, order.ResText))
        .then(() => {
          dispatch(clearOrderCase());
          setNote("");
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
              })
              .catch((error) => {
            // Handle any errors that occurred during the API requests
            console.error(error);
          });
      } else if (toCase === 7 && reasonId !== "") {
        dispatch(returnShippment(orderId, loginInfo.BranchID, reasonId, note))
        .then(() => {
          dispatch(clearOrderCase());
          setNote("");
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
          })
          .catch((error) => {
            // Handle any errors that occurred during the API requests
            console.error(error);
          });
        }
      });
    };
    
    return (
    <Dialog
      open={
        (toCase === 4 && orderId !== "") || (toCase === 7 && reasonId !== "")
          ? true
          : false
      }
      TransitionComponent={Transition}
      keepMounted
    >
      <DialogTitle style={{ minWidth: "300px" }}>{"يرجى التأكيد"}</DialogTitle>
      <DialogContent>
        <div className="d-flex flex-row gap-2 flex-wrap mb-3">
          <p style={{ margin: 0 }}>رقم الطلبية: </p>
          <p style={{ margin: 0 }}>{orderId}</p>
        </div>
        <div className="d-flex flex-row gap-2 flex-wrap mb-3">
          <p style={{ margin: 0 }}>اسم المتجر: </p>
          <p style={{ margin: 0 }}>{storeName}</p>
        </div>
        {reasonId && (
          <div className="d-flex flex-row gap-2 flex-wrap mb-3">
            <p style={{ margin: 0 }}>السبب: </p>
            <p style={{ margin: 0 }}>{reasonText}</p>
          </div>
        )}
        {toCase === 7 && reasonId !== "" && (
          <TextField
            fullWidth
            autoComplete="off"
            label="ملاحظة"
            className="my-4"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm}>تأكيد</Button>
        <Button
          onClick={() => {
            setNote("");
            dispatch(clearOrderCase());
          }}
        >
          إلغاء
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmCaseChange;
