import * as consts from "../constants/orderConstants";
import axiosFrmData from "../axiosInstances/axiosFrmData";
import { addAlertMessage } from "./systemActions";

export const getMainOrdersSummary = (branchId) => async (dispatch) => {
  try {
    dispatch({
      type: consts.GET_MAIN_ORDERS_SUMMARY_REQUEST,
    });
    const { data } = await axiosFrmData.post("store/orders-summary.php", {
      BranchID: branchId,
    });

    dispatch({
      type: consts.GET_MAIN_ORDERS_SUMMARY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : error.response.data.message
        ? error.response.data.message
        : error.message;

    dispatch(addAlertMessage(message, "error"));
    dispatch({
      type: consts.GET_MAIN_ORDERS_SUMMARY_FAIL,
      payload:
        error instanceof Error
          ? error.message
          : error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getOrdersByType =
  (branchId, shCase, time, page) => async (dispatch) => {
    try {
      dispatch({
        type: consts.GET_ORDERS_REQUEST,
      });
      const { data } = await axiosFrmData.post("store/web_order_data.php", {
        BranchID: branchId,
        ShCase: shCase,
        kind: 1,
        time: time,
        page: ++page,
      });
      dispatch({
        type: consts.GET_ORDERS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : error.response.data.message
          ? error.response.data.message
          : error.message;

      dispatch(addAlertMessage(message, "error"));
      dispatch({
        type: consts.GET_ORDERS_FAIL,
        payload:
          error instanceof Error
            ? error.message
            : error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const getOrdersByDate =
  (branchId, dateFrom, dateTo) => async (dispatch) => {
    const shDateFrom = new Date(dateFrom);
    const shDateStrnigFrom = `${shDateFrom.getFullYear()}-${String(
      shDateFrom.getMonth() + 1
    ).padStart(2, "0")}-${String(shDateFrom.getDate()).padStart(
      2,
      "0"
    )} 00:00:00.000`;

    const shDateTo = new Date(dateTo);
    const shDateStrnigTo = `${shDateTo.getFullYear()}-${String(
      shDateTo.getMonth() + 1
    ).padStart(2, "0")}-${String(shDateTo.getDate()).padStart(
      2,
      "0"
    )} 00:00:00.000`;
    try {
      dispatch({
        type: consts.GET_ORDERS_REQUEST,
      });

      const { data } = await axiosFrmData.post("store/web_Search_history.php", {
        BranchID: branchId,
        selectedDate1: shDateStrnigFrom,
        selectedDate2: shDateStrnigTo,
        Kind: 1,
      });
      dispatch({
        type: consts.GET_ORDERS_SUCCESS,
        payload: { Orders: data, TotalOrders: data.lenght },
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : error.response.data.message
          ? error.response.data.message
          : error.message;

      dispatch(addAlertMessage(message, "error"));
      dispatch({
        type: consts.GET_ORDERS_FAIL,
        payload:
          error instanceof Error
            ? error.message
            : error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const getOrdersAll = (branchId, page) => async (dispatch) => {
  try {
    dispatch({
      type: consts.GET_ORDERS_REQUEST,
    });

    const { data } = await axiosFrmData.post("store/All_orders.php", {
      BranchID: branchId,
      Kind: 1,
      page: ++page,
    });

    // data in this case is a list and reducer expect object:
    // {Orders: orders list, totalRecords:list lenght}
    dispatch({
      type: consts.GET_ORDERS_SUCCESS,
      payload: { Orders: data.Orders, TotalOrders: data.TotalOrders },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : error.response.data.message
        ? error.response.data.message
        : error.message;

    dispatch(addAlertMessage(message, "error"));
    dispatch({
      type: consts.GET_ORDERS_FAIL,
      payload:
        error instanceof Error
          ? error.message
          : error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getShowRoomOrders = (branchId) => async (dispatch) => {
  try {
    dispatch({
      type: consts.GET_STORE_ORDERS_REQUEST,
    });
    const { data } = await axiosFrmData.post("store/showroom.php", {
      BranchID: branchId,
      ShCase: 5,
      kind: 16,
      time: false,
    });

    dispatch({
      type: consts.GET_STORE_ORDERS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : error.response.data.message
        ? error.response.data.message
        : error.message;

    dispatch(addAlertMessage(message, "error"));
    dispatch({
      type: consts.GET_STORE_ORDERS_FAIL,
      payload:
        error instanceof Error
          ? error.message
          : error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getStoreOrdersByType =
  (branchId, shCase, time, page) => async (dispatch) => {
    try {
      dispatch({
        type: consts.GET_STORE_ORDERS_REQUEST,
      });
      const { data } = await axiosFrmData.post("store/web_order_data.php", {
        BranchID: branchId,
        ShCase: shCase,
        kind: 2,
        time: time,
        page: ++page,
      });

      dispatch({
        type: consts.GET_STORE_ORDERS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : error.response.data.message
          ? error.response.data.message
          : error.message;

      dispatch(addAlertMessage(message, "error"));
      dispatch({
        type: consts.GET_STORE_ORDERS_FAIL,
        payload:
          error instanceof Error
            ? error.message
            : error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const getStoreOrdersByDate =
  (branchId, dateFrom, dateTo) => async (dispatch) => {
    const shDateFrom = new Date(dateFrom);
    const shDateStrnigFrom = `${shDateFrom.getFullYear()}-${String(
      shDateFrom.getMonth() + 1
    ).padStart(2, "0")}-${String(shDateFrom.getDate()).padStart(
      2,
      "0"
    )} 00:00:00.000`;

    const shDateTo = new Date(dateTo);
    const shDateStrnigTo = `${shDateTo.getFullYear()}-${String(
      shDateTo.getMonth() + 1
    ).padStart(2, "0")}-${String(shDateTo.getDate()).padStart(
      2,
      "0"
    )} 00:00:00.000`;

    try {
      dispatch({
        type: consts.GET_STORE_ORDERS_REQUEST,
      });
      const { data } = await axiosFrmData.post("store/Search_history.php", {
        BranchID: branchId,
        selectedDate1: shDateStrnigFrom,
        selectedDate2: shDateStrnigTo,
        Kind: 2,
        page: 1,
      });
      // data in this case is a list and reducer expect object:
      // {Orders: orders list, totalRecords:list lenght}
      dispatch({
        type: consts.GET_STORE_ORDERS_SUCCESS,
        payload: { Orders: data, totalRecords: data.lenght },
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : error.response.data.message
          ? error.response.data.message
          : error.message;

      dispatch(addAlertMessage(message, "error"));
      dispatch({
        type: consts.GET_STORE_ORDERS_FAIL,
        payload:
          error instanceof Error
            ? error.message
            : error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const getStoreOrdersAll = (branchId, page) => async (dispatch) => {
  try {
    dispatch({
      type: consts.GET_STORE_ORDERS_REQUEST,
    });
    const { data } = await axiosFrmData.post("store/All_orders.php", {
      BranchID: branchId,
      Kind: 2,
      page: ++page,
    });
    // data in this case is a list and reducer expect object:
    // {Orders: orders list, totalRecords:list lenght}
    dispatch({
      type: consts.GET_STORE_ORDERS_SUCCESS,
      payload: { Orders: data.Orders, TotalOrders: data.TotalOrders },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : error.response.data.message
        ? error.response.data.message
        : error.message;

    dispatch(addAlertMessage(message, "error"));
    dispatch({
      type: consts.GET_STORE_ORDERS_FAIL,
      payload:
        error instanceof Error
          ? error.message
          : error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const changeOrderSearchType = (type) => (dispatch) => {
  dispatch({
    type: consts.CHANGE_ORDER_SEARCH_TYPE,
    payload: type,
  });
};

export const changeStoreOrderSearchType = (type) => (dispatch) => {
  dispatch({
    type: consts.CHANGE_STORE_ORDER_SEARCH_TYPE,
    payload: type,
  });
};

export const addOrder = (orderData) => async (dispatch) => {
  try {
    dispatch({
      type: consts.ADD_ORDER_REQUEST,
    });

    const { data } = await axiosFrmData.post(
      "store/web_add_order.php",
      orderData
    );
    dispatch({
      type: consts.ADD_ORDER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : error.response.data.message
        ? error.response.data.message
        : error.message;

    dispatch(addAlertMessage(message, "error"));
    dispatch({
      type: consts.ADD_ORDER_FAIL,
      payload:
        error instanceof Error
          ? error.message
          : error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateOrder = (orderData) => async (dispatch) => {
  try {
    dispatch({
      type: consts.UPDATE_ORDER_REQUEST,
    });

    const { data } = await axiosFrmData.post("store/web_Edit.php", orderData);
    dispatch({
      type: consts.UPDATE_ORDER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : error.response.data.message
        ? error.response.data.message
        : error.message;

    dispatch(addAlertMessage(message, "error"));
    dispatch({
      type: consts.UPDATE_ORDER_FAIL,
      payload:
        error instanceof Error
          ? error.message
          : error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const addStoreOrder = (orderData) => async (dispatch) => {
  try {
    dispatch({
      type: consts.ADD_STORE_ORDER_REQUEST,
    });

    const { data } = await axiosFrmData.post(
      "store/web_Add_StorageS.php",
      orderData
    );
    dispatch({
      type: consts.ADD_STORE_ORDER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : error.response.data.message
        ? error.response.data.message
        : error.message;

    dispatch(addAlertMessage(message, "error"));
    dispatch({
      type: consts.ADD_STORE_ORDER_FAIL,
      payload:
        error instanceof Error
          ? error.message
          : error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getStorages = (orderData) => async (dispatch) => {
  try {
    dispatch({
      type: consts.GET_STORAGES_REQUEST,
    });

    const { data } = await axiosFrmData.post(
      "get/get_Storage_space.php",
      orderData
    );
    dispatch({
      type: consts.GET_STORAGES_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : error.response.data.message
        ? error.response.data.message
        : error.message;

    dispatch(addAlertMessage(message, "error"));
    dispatch({
      type: consts.GET_STORAGES_FAIL,
      payload:
        error instanceof Error
          ? error.message
          : error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getDeliveryOrdersSummary = (branchId) => async (dispatch) => {
  try {
    dispatch({
      type: consts.GET_MAIN_ORDERS_DELIVERY_SUMMARY_REQUEST,
    });

    const { data } = await axiosFrmData.post("mandub/web_mandub.php", {
      BranchID: branchId,
    });
    dispatch({
      type: consts.GET_MAIN_ORDERS_DELIVERY_SUMMARY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : error.response.data.message
        ? error.response.data.message
        : error.message;

    dispatch(addAlertMessage(message, "error"));
    dispatch({
      type: consts.GET_MAIN_ORDERS_DELIVERY_SUMMARY_FAIL,
      payload:
        error instanceof Error
          ? error.message
          : error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const changeDeliveryOrderSearchType = (type) => async (dispatch) => {
  dispatch({
    type: consts.CHANGE_DELIVERY_ORDER_SEARCH_TYPE,
    payload: type,
  });
};

export const getDeliveryOrders = (branchId, shCase) => async (dispatch) => {
  try {
    dispatch({
      type: consts.GET_DELIVERY_ORDERS_REQUEST,
    });

    const { data } = await axiosFrmData.post("mandub/MandubOrder.php", {
      BranchID: branchId,
      Case: shCase,
    });
    dispatch({
      type: consts.GET_DELIVERY_ORDERS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : error.response.data.message
        ? error.response.data.message
        : error.message;

    dispatch(addAlertMessage(message, "error"));
    dispatch({
      type: consts.GET_DELIVERY_ORDERS_FAIL,
      payload:
        error instanceof Error
          ? error.message
          : error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getReturnReasons = () => async (dispatch) => {
  try {
    dispatch({
      type: consts.GET_RETURN_REASONS_REQUEST,
    });
    const { data } = await axiosFrmData.post("get/Reasons.php");
    dispatch({
      type: consts.GET_RETURN_REASONS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : error.response.data.message
        ? error.response.data.message
        : error.message;

    dispatch(addAlertMessage(message, "error"));
    dispatch({
      type: consts.GET_RETURN_REASONS_FAIL,
      payload:
        error instanceof Error
          ? error.message
          : error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const returnShippment =
  (orderId, branchId, reasonId, note) => async (dispatch) => {
    try {
      dispatch({
        type: consts.UPDATE_DELIVERY_ORDER_REQUEST,
      });
      const { data } = await axiosFrmData.post("mandub/mandubEdit.php", {
        ID: orderId,
        BranchID: branchId,
        ReasonsID: reasonId,
        ResText: note,
        shCase: 7,
      });
      dispatch({
        type: consts.UPDATE_DELIVERY_ORDER_SUCCESS,
        payload: data,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : error.response.data.message
          ? error.response.data.message
          : error.message;

      dispatch(addAlertMessage(message, "error"));
      dispatch({
        type: consts.UPDATE_DELIVERY_ORDER_FAIL,
        payload:
          error instanceof Error
            ? error.message
            : error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const confirmShippment =
  (orderId, branchId, note) => async (dispatch) => {
    try {
      dispatch({
        type: consts.UPDATE_DELIVERY_ORDER_REQUEST,
      });
      const { data } = await axiosFrmData.post("mandub/mandubEdit.php", {
        ID: orderId,
        BranchID: branchId,
        ReasonsID: 0,
        ResText: note,
        shCase: 4,
      });
      dispatch({
        type: consts.UPDATE_DELIVERY_ORDER_SUCCESS,
        payload: data,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : error.response.data.message
          ? error.response.data.message
          : error.message;

      dispatch(addAlertMessage(message, "error"));
      dispatch({
        type: consts.UPDATE_DELIVERY_ORDER_FAIL,
        payload:
          error instanceof Error
            ? error.message
            : error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
//

export const searchOrdersByText =
  (branchId, searchText) => async (dispatch) => {
    try {
      dispatch({
        type: consts.GET_ORDERS_REQUEST,
      });
      const { data } = await axiosFrmData.post("store/web_Search.php", {
        BranchID: branchId,
        query: searchText,
        Kind: 1,
      });

      dispatch({
        type: consts.GET_ORDERS_SUCCESS,
        payload: { Orders: data, TotalOrders: data.lenght },
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : error.response.data.message
          ? error.response.data.message
          : error.message;

      dispatch(addAlertMessage(message, "error"));
      dispatch({
        type: consts.GET_ORDERS_FAIL,
        payload:
          error instanceof Error
            ? error.message
            : error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const searchStoreOrdersByText =
  (branchId, searchText) => async (dispatch) => {
    try {
      dispatch({
        type: consts.GET_STORE_ORDERS_REQUEST,
      });
      const { data } = await axiosFrmData.post("store/web_Search.php", {
        BranchID: branchId,
        query: searchText,
        Kind: 2,
      });
      dispatch({
        type: consts.GET_STORE_ORDERS_SUCCESS,
        payload: { Orders: data, TotalOrders: data.lenght },
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : error.response.data.message
          ? error.response.data.message
          : error.message;

      dispatch(addAlertMessage(message, "error"));
      dispatch({
        type: consts.GET_STORE_ORDERS_FAIL,
        payload:
          error instanceof Error
            ? error.message
            : error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const changeOrderCaseToReturning =
  (orderId, storeName) => (dispatch) => {
    dispatch({
      type: consts.CHANGE_ORDER_CASE,
      payload: {
        orderId: orderId,
        storeName: storeName,
        toCase: 7,
      },
    });
  };

export const changeOrderCaseToConfirmReturn =
  (orderId, storeName, reasonId, reasonText) => (dispatch) => {
    dispatch({
      type: consts.CHANGE_ORDER_CASE,
      payload: {
        orderId: orderId,
        storeName: storeName,
        reasonId: reasonId,
        reasonText: reasonText,
        toCase: 7,
      },
    });
  };

export const changeOrderCaseToConfirm = (orderId, storeName) => (dispatch) => {
  dispatch({
    type: consts.CHANGE_ORDER_CASE,
    payload: { orderId: orderId, storeName: storeName, toCase: 4 },
  });
};

export const clearOrderCase = (orderId, storeName) => (dispatch) => {
  dispatch({
    type: consts.CHANGE_ORDER_CASE,
    payload: {
      orderId: "",
      storeName: "",
      reasonId: "",
      reasonText: "",
      toCase: "",
    },
  });
};

export const setDeliveryOrdersSearchText = (text) => (dispatch) => {
  dispatch({
    type: consts.SET_DELIVER_ORDERS_SEARCH_TEXT,
    payload: text,
  });
};





//  ADD (Marketer Order)
export const ADD_MARKETER_ORDER_REQUEST = (orderData) => async (dispatch) => {
  try {
    dispatch({
      type: consts.ADD_MARKETER_ORDER_REQUEST,
    });

    const { data } = await axiosFrmData.post(
      "misuq/misuq_addOrder.php",
      orderData
    );

    dispatch({
      type: consts.ADD_MARKETER_ORDER_SUCCESS,
      payload: data,
    });
    
    dispatch(addAlertMessage("تم إضافة الطلبية بنجاح", "success"));

  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;

    dispatch(addAlertMessage(message, "error"));
    dispatch({
      type: consts.ADD_MARKETER_ORDER_FAIL,
      payload: message,
    });
  }
};

export const getMarketerSummary = (branchId) => async (dispatch) => {
  try {
    dispatch({ type: consts.GET_MARKETER_SUMMARY_REQUEST });

    const { data } = await axiosFrmData.post("misuq/misuq.php", {
      BranchID: branchId,
    });

    dispatch({
      type: consts.GET_MARKETER_SUMMARY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch({
      type: consts.GET_MARKETER_SUMMARY_FAIL,
      payload: message,
    });
  }
};

export const getMarketerOrders = (branchId, fetchTodayOnly = true) => async (dispatch) => {
  try {
    dispatch({ type: consts.GET_MARKETER_ORDERS_REQUEST });

    const today = new Date();
    const nowTimeStr = today.toISOString().split('T')[0] + " 00:00:00";

    const formData = new FormData();
    formData.append("BranchID", branchId);
    formData.append("time", fetchTodayOnly ? "true" : "false");
    formData.append("nowtime", nowTimeStr); 

    const { data } = await axiosFrmData.post("/misuq/MisuqOrder.php", formData);

    dispatch({
      type: consts.GET_MARKETER_ORDERS_SUCCESS,
      payload: Array.isArray(data) ? data : [], 
    });
  } catch (error) {
    dispatch({
      type: consts.GET_MARKETER_ORDERS_FAIL,
      payload: error.message,
    });
  }
};
export const getMarketerStores = (branchID) => async (dispatch) => {
  try {
    dispatch({ type: consts.GET_MARKETER_STORES_REQUEST });
    const fd = new FormData();
    fd.append("BranchID", branchID);
    
    const { data } = await axiosFrmData.post("/misuq/misuq_stores.php", fd);
    const list = Array.isArray(data) ? data : (data.data || []);

    dispatch({ type: consts.GET_MARKETER_STORES_SUCCESS, payload: list });
  } catch (error) {
    dispatch({
      type: consts.GET_MARKETER_STORES_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
{/*
export const addMarketerOrder = (finalData) => async (dispatch) => {
    try {
        dispatch({ type: ADD_MARKETER_ORDER_REQUEST });

        const { data } = await axiosFrmData.post("/misuq/Misuq_addOrder.php", finalData);

        dispatch({
            type: consts.ADD_MARKETER_ORDER_SUCCESS,
            payload: data,
        });

        return data; 
    } catch (error) {
        dispatch({
            type: consts.ADD_MARKETER_ORDER_FAIL,
            payload: error.response && error.response.data.message 
                ? error.response.data.message 
                : error.message,
        });
        
        throw error; 
    }
};

*/}
export const addMarketerOrder = (formData) => async (dispatch) => {
    try {
        dispatch({ type: "ADD_MARKETER_ORDER_REQUEST" });

        const { data } = await axiosFrmData.post("/misuq/Misuq_addOrder.php", formData);

        dispatch({
            type: "ADD_MARKETER_ORDER_SUCCESS",
            payload: data,
        });

        return data; 
    } catch (error) {
        dispatch({
            type: "ADD_MARKETER_ORDER_FAIL",
            payload: error.response?.data?.message || error.message,
        });
        throw error; 
    }
};
export const getMarketerItemsStores = (branchID) => async (dispatch) => {
    try {
      dispatch({ type: consts.GET_MARKETER_STORES_REQUEST }); 
      const fd = new FormData();
      fd.append("BranchID", branchID);
      
      const { data } = await axiosFrmData.post("/misuq/Misuq_items_stores.php", fd);
      
      dispatch({ type: "GET_MARKETER_ITEMS_SUCCESS", payload: data });
    } catch (error) {
      console.error(error);
    }
};


