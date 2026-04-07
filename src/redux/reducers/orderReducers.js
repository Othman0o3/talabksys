import * as consts from "../constants/orderConstants";

export const mainOrdersSummaryReducer = (state = {}, action) => {
  switch (action.type) {
    case consts.GET_MAIN_ORDERS_SUMMARY_REQUEST:
      return {
        ...state,
        loadingMainOrdersSummary: true,
        errMsgMainOrdersSummary: null,
        mainOrdersSummary: null,
      };

    case consts.GET_MAIN_ORDERS_SUMMARY_SUCCESS:
      return {
        ...state,
        loadingMainOrdersSummary: false,
        mainOrdersSummary: action.payload,
      };

    case consts.GET_MAIN_ORDERS_SUMMARY_FAIL:
      return {
        ...state,
        loadingMainOrdersSummary: false,
        errMsgMainOrdersSummary: action.payload,
      };

    default:
      return state;
  }
};

export const ordersReducer = (state = {}, action) => {
  switch (action.type) {
    case consts.GET_ORDERS_REQUEST:
      return {
        ...state,
        loadingOrders: true,
        errMsgOrders: null,
        orders: [],
      };

    case consts.GET_ORDERS_SUCCESS:
      return {
        ...state,
        loadingOrders: false,
        orders: action.payload.Orders,
        totalRecords: action.payload.TotalOrders,
      };

    case consts.GET_ORDERS_FAIL:
      return {
        ...state,
        loadingOrders: false,
        errMsgOrders: action.payload,
      };

    case consts.ADD_ORDER_REQUEST:
      return {
        ...state,
        loadingAddOrder: true,
        errMsgOrders: null,
      };

    case consts.ADD_ORDER_SUCCESS:
      return {
        ...state,
        loadingAddOrder: false,
        errMsgOrders: action.payload.message,
        orderId: action.payload.OrderID || "",
      };

    case consts.ADD_ORDER_FAIL:
      return {
        ...state,
        loadingAddOrder: false,
        errMsgOrders: action.payload,
      };

    case consts.CONFIRM_ADD_ORDER_MESSAGE:
      return {
        ...state,
        orderId: "",
      };

    case consts.UPDATE_ORDER_REQUEST:
      return {
        ...state,
        loadingUpdateOrder: true,
        errMsgOrders: null,
      };

    case consts.UPDATE_ORDER_SUCCESS:
      return {
        ...state,
        loadingUpdateOrder: false,
        errMsgOrders: action.payload,
      };

    case consts.UPDATE_ORDER_FAIL:
      return {
        ...state,
        loadingUpdateOrder: false,
        errMsgOrders: action.payload,
      };

    case consts.CHANGE_ORDER_SEARCH_TYPE:
      return {
        ...state,
        type: action.payload,
      };

    default:
      return state;
  }
};

export const storeOrdersReducer = (state = {}, action) => {
  switch (action.type) {
    case consts.GET_STORE_ORDERS_REQUEST:
      return {
        ...state,
        loadingStoreOrders: true,
        errMsgStoreOrders: null,
        storeOrders: [],
        totalRecords: 0,
      };

    case consts.GET_STORE_ORDERS_SUCCESS:
      return {
        ...state,
        loadingStoreOrders: false,
        storeOrders: action.payload.Orders,
        totalRecords: action.payload.TotalOrders,
      };

    case consts.GET_STORE_ORDERS_FAIL:
      return {
        ...state,
        loadingStoreOrders: false,
        errMsgStoreOrders: action.payload,
      };

    case consts.ADD_STORE_ORDER_REQUEST:
      return {
        ...state,
        loadingAddStoreOrder: true,
        errMsgStoreOrders: null,
      };

    case consts.ADD_STORE_ORDER_SUCCESS:
      return {
        ...state,
        loadingAddStoreOrder: false,
        errMsgStoreOrders: action.payload.message,
        orderId: action.payload.OrderID || "",
      };

    case consts.ADD_STORE_ORDER_FAIL:
      return {
        ...state,
        loadingAddStoreOrder: false,
        errMsgStoreOrders: action.payload,
      };

    case consts.CONFIRM_ADD_STORE_ORDER_MESSAGE:
      return {
        ...state,
        orderId: "",
      };

    case consts.CHANGE_STORE_ORDER_SEARCH_TYPE:
      return {
        ...state,
        type: action.payload,
      };

    default:
      return state;
  }
};

export const storagesReducer = (state = {}, action) => {
  switch (action.type) {
    case consts.GET_STORAGES_REQUEST:
      return {
        ...state,
        loadingStorages: true,
        errMsgStorages: null,
        storages: [],
      };

    case consts.GET_STORAGES_SUCCESS:
      return {
        ...state,
        loadingStorages: false,
        storages: action.payload,
      };

    case consts.GET_STORAGES_FAIL:
      return {
        ...state,
        loadingStorages: false,
        errMsgStorages: action.payload,
      };

    default:
      return state;
  }
};

export const deliveryOrdersSummaryReducer = (state = {}, action) => {
  switch (action.type) {
    case consts.GET_MAIN_ORDERS_DELIVERY_SUMMARY_REQUEST:
      return {
        ...state,
        loadingDeliveryOrdersSummary: true,
        errMsgDeliveryOrdersSummary: null,
        deliveryOrdersSummary: null,
      };

    case consts.GET_MAIN_ORDERS_DELIVERY_SUMMARY_SUCCESS:
      return {
        ...state,
        loadingDeliveryOrdersSummary: false,
        deliveryOrdersSummary: action.payload,
      };

    case consts.GET_MAIN_ORDERS_DELIVERY_SUMMARY_FAIL:
      return {
        ...state,
        loadingDeliveryOrdersSummary: false,
        errMsgDeliveryOrdersSummary: action.payload,
      };

    default:
      return state;
  }
};

export const deliveryOrdersReducer = (state = {}, action) => {
  switch (action.type) {
    case consts.GET_DELIVERY_ORDERS_REQUEST:
      return {
        ...state,
        loadingDeliveryOrders: true,
        loadingUpdateDeliveryOrder: false,
        errMsgDeliveryOrders: null,
        deliveryOrders: [],
      };

    case consts.GET_DELIVERY_ORDERS_SUCCESS:
      return {
        ...state,
        loadingDeliveryOrders: false,
        deliveryOrders: action.payload,
      };

    case consts.GET_DELIVERY_ORDERS_FAIL:
      return {
        ...state,
        loadingDeliveryOrders: false,
        errMsgDeliveryOrders: action.payload,
      };

    case consts.CHANGE_DELIVERY_ORDER_SEARCH_TYPE:
      return {
        ...state,
        type: action.payload,
      };

    default:
      return state;
  }
};

export const returnReasonsReducer = (state = {}, action) => {
  switch (action.type) {
    case consts.GET_RETURN_REASONS_REQUEST:
      return {
        ...state,
        loadingReturnReasons: true,
        errMsgReturnReasons: null,
        returnReasons: [],
      };

    case consts.GET_RETURN_REASONS_SUCCESS:
      return {
        ...state,
        loadingReturnReasons: false,
        returnReasons: action.payload,
      };

    case consts.GET_RETURN_REASONS_FAIL:
      return {
        ...state,
        loadingReturnReasons: false,
        errMsgReturnReasons: action.payload,
      };

    default:
      return state;
  }
};

export const changeOrderCaseReducer = (state = {}, action) => {
  switch (action.type) {
    case consts.CHANGE_ORDER_CASE:
      return {
        ...state,
        orderId: action.payload.orderId,
        storeName: action.payload.storeName || "",
        reasonId: action.payload.reasonId || "",
        reasonText: action.payload.reasonText || "",
        toCase: action.payload.toCase || "",
      };

    case consts.CLEAR_ORDER_CASE:
      return {
        ...state,
        orderId: "",
        storeName: "",
        reasonText: "",
        toCase: "",
      };

    default:
      return state;
  }
};

export const deliveryOrdersSearchTextReducer = (state = {}, action) => {
  switch (action.type) {
    case consts.SET_DELIVER_ORDERS_SEARCH_TEXT:
      return {
        ...state,
        text: action.payload,
      };

    default:
      return state;
  }
};

export const marketerSummaryReducer = (state = { summary: {} }, action) => {
  switch (action.type) {
    case consts.GET_MARKETER_SUMMARY_REQUEST:
      return { loading: true };
    case consts.GET_MARKETER_SUMMARY_SUCCESS:
      return { loading: false, summary: action.payload };
    case consts.GET_MARKETER_SUMMARY_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const marketerOrdersReducer = (state = { orders: [], loading: false }, action) => {
  switch (action.type) {
    case consts.GET_MARKETER_ORDERS_REQUEST:
      return { ...state, loading: true };
    case consts.GET_MARKETER_ORDERS_SUCCESS:
      return { 
        loading: false, 
        orders: action.payload.Orders || action.payload, 
        totalRecords: action.payload.TotalOrders || 0 
      };
    case consts.GET_MARKETER_ORDERS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};



export const marketerStoresReducer = (state = { stores: [] }, action) => {
    switch (action.type) {
        case consts.GET_MARKETER_STORES_REQUEST: // التعديل هنا
            return { loading: true, stores: [] };
        case consts.GET_MARKETER_STORES_SUCCESS: // التعديل هنا
            return { loading: false, stores: action.payload };
        case consts.GET_MARKETER_STORES_FAIL: // التعديل هنا
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};