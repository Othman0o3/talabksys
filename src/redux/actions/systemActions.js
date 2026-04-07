import * as consts from "../constants/systemConstants";

export const addAlertMessage =
  (text, type = "info") =>
  (dispatch) => {
    dispatch({
      type: consts.ADD_ALERT_MESSAGE,
      payload: { type: type, text: text },
    });
    window.scrollTo(0, 0);
  };

export const removeAlertMessage = (messageId) => (dispatch) => {
  dispatch({ type: consts.REMOVE_ALERT_MESSAGE, payload: messageId });
};

export const setOrdersSearchDate = (dateFrom, dateTo) => (dispatch) => {
  dispatch({
    type: consts.SET_ORDERS_SEARCH_DATE,
    payload: { dateFrom: dateFrom, dateTo: dateTo },
  });
};

export const setStoreOrdersSearchDate = (dateFrom, dateTo) => (dispatch) => {
  dispatch({
    type: consts.SET_STORE_ORDERS_SEARCH_DATE,
    payload: { dateFrom: dateFrom, dateTo: dateTo },
  });
};
