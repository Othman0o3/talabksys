import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  ListItemText,
  DialogTitle,
  Slide,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
import {
  changeOrderCaseToConfirmReturn,
  clearOrderCase,
  getReturnReasons,
} from "../../redux/actions/orderActions";
import { CircularProgress } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ReturnReason = () => {
  const dispatch = useDispatch();

  const { loadingReturnReasons, returnReasons } = useSelector(
    (state) => state.returnReasons
  );

  const { orderId, storeName, reasonId, toCase } = useSelector(
    (state) => state.changeOrderCase
  );

  const handleReturn = (reasonId, reasonText) => {
    dispatch(
      changeOrderCaseToConfirmReturn(orderId, storeName, reasonId, reasonText)
    );
  };

  useEffect(() => {
    dispatch(getReturnReasons());
  }, []);

  return (
    <Dialog
      open={
        (orderId !== "") & (reasonId === "") & (toCase === 7) ? true : false
      }
      TransitionComponent={Transition}
      keepMounted
    >
      <DialogTitle>{"يرجى تحديد سبب الترجيع"}</DialogTitle>
      <DialogContent>
        {loadingReturnReasons ? (
          <CircularProgress style={{ margin: "auto" }} />
        ) : (
          <List>
            {returnReasons.map((reason, index) => {
              return (
                <ListItem disablePadding key={index++}>
                  <ListItemButton
                    onClick={() => handleReturn(reason.ID, reason.ReName)}
                  >
                    <ListItemText primary={reason.ReName} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => dispatch(clearOrderCase())}>إلغاء</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReturnReason;
