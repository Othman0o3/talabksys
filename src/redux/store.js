import { configureStore, combineReducers } from "@reduxjs/toolkit";
import thunk from "redux-thunk";

import { userLoginReducer, userRegisterReducer } from "./reducers/userReducers";

import Cookies from "js-cookie";
import {
  changeOrderCaseReducer,
  deliveryOrdersReducer,
  deliveryOrdersSearchTextReducer,
  deliveryOrdersSummaryReducer,
  mainOrdersSummaryReducer,
  ordersReducer,
  returnReasonsReducer,
  storagesReducer,
  storeOrdersReducer,
  marketerSummaryReducer,
  marketerOrdersReducer,
  marketerStoresReducer,
} from "./reducers/orderReducers";
import { citiesReducer, placesReducer } from "./reducers/cityReducers";
import {
  alertMessagesReducer,
  ordersSearchDateReducer,
  storeOrdersSearchDateReducer,
} from "./reducers/systemReducer";
import { itemMoveReducer, itemsReducer } from "./reducers/itemReducers";
import {
  adjustmentsReducer,
  deliverySettlementsReducer,
  settlementsReducer,
  marketerFinanceReducer,
} from "./reducers/settlementsReducers";
import { inventoryReducer } from "./reducers/InventoryReducers";
import { deliverySummaryReducer } from "./reducers/deliveryReducers";


const rootReducer = combineReducers({
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  alertMessages: alertMessagesReducer,
  mainOrdersSummary: mainOrdersSummaryReducer,
  orders: ordersReducer,
  storeOrders: storeOrdersReducer,
  storages: storagesReducer,
  cities: citiesReducer,
  places: placesReducer,
  items: itemsReducer,
  settlements: settlementsReducer,
  inventory: inventoryReducer,
  itemMove: itemMoveReducer,
  deliverySummary: deliverySummaryReducer,
  ordersSearchDate: ordersSearchDateReducer,
  storeOrdersSearchDate: storeOrdersSearchDateReducer,
  deliveryOrdersSummary: deliveryOrdersSummaryReducer,
  deliveryOrders: deliveryOrdersReducer,
  returnReasons: returnReasonsReducer,
  changeOrderCase: changeOrderCaseReducer,
  deliverySettlements: deliverySettlementsReducer,
  deliveryOrdersSearchText: deliveryOrdersSearchTextReducer,
  marketerSummary: marketerSummaryReducer,
  marketerOrders: marketerOrdersReducer,
  marketerStores  : marketerStoresReducer,
  marketerFinance: marketerFinanceReducer,
});

// Check if in development mode
const isDevelopment = process.env.NODE_ENV === "development";

const middleware = [thunk];

const userInfoFromCookie = Cookies.get("userInfo")
  ? JSON.parse(Cookies.get("userInfo"))
  : null;

const initialState = {
  userLogin: {
    loadingLogin: false,
    errMsgLogin: null,
    loginInfo: userInfoFromCookie,
  },
  userRegister: {
    loadingRegister: false,
    errMsgRegister: null,
    register: null,
    statusUserRegister: 0,
  },
  alertMessages: {
    messages: [],
  },
  mainOrdersSummary: {
    loadingMainOrdersSummary: false,
    errMsgMainOrdersSummary: null,
    mainOrdersSummary: null,
  },
  orders: {
    loadingOrders: false,
    loadingAddOrder: false,
    loadingUpdateOrder: false,
    errMsgOrders: null,
    orderId: "",
    orders: [],
    totalRecords: 0,
    type: "all",
  },
  storeOrders: {
    loadingStoreOrders: false,
    loadingAddStoreOrder: false,
    errMsgStoreOrders: null,
    orderId: "",
    storeOrders: [],
    totalRecords: 0,
    type: "all",
  },
  storages: {
    loadingStorages: false,
    errMsgStorages: null,
    storages: [],
  },
  cities: {
    loadingCities: false,
    errMsgCities: null,
    cities: [],
  },

  places: {
    loadingPlaces: false,
    errMsgPlaces: null,
    places: [],
  },
  items: {
    loadingItems: false,
    errMsgItems: null,
    items: [],
  },
  settlements: {
    loadingSettlements: false,
    errMsgSettlements: null,
    settlements: [],
  },
  deliverySettlements: {
    loadingDeliverySettlements: false,
    errMsgDeliverySettlements: null,
    deliverySettlements: [],
  },
  inventory: { loadingInventory: false, errMsgInventory: null, inventory: [] },
  itemMove: { loadingItemMove: false, errMsgItemMove: null, itemMove: [] },
  deliverySummary: {
    loadingDeliverySummary: false,
    errMsgDeliverySummary: null,
    deliverySummary: null,
  },
  ordersSearchDate: {
    dateFrom: Date.now(),
    dateTo: Date.now(),
  },
  storeOrdersSearchDate: {
    dateFrom: Date.now(),
    dateTo: Date.now(),
  },
  deliveryOrdersSummary: {
    loadingDeliveryOrdersSummary: false,
    errMsgDeliveryOrdersSummary: null,
    deliveryOrdersSummary: null,
  },
  deliveryOrders: {
    loadingDeliveryOrders: false,
    loadingUpdateDeliveryOrder: false,
    errMsgDeliveryOrders: null,
    deliveryOrders: [],
    type: "shipping",
  },
  returnReasons: {
    loadingReturnReasons: false,
    errMsgReturnReasons: null,
    returnReasons: [],
  },
  changeOrderCase: {
    orderId: "",
    storeName: "",
    reasonId: "",
    reasonText: "",
    toCase: "",
  },
  deliveryOrdersSearchText: {
    text: "",
  },
  marketerSummary: {
    loading: false,
    summary: null,
    error: null,
  },
  marketerOrders: {
    loading: false,
    orders: [],
    error: null,
  },
  marketerFinance: {
    loading: false,
    financeData: [],
    error: null,
  },
};

const store = configureStore({
  reducer: rootReducer,
  middleware: [...middleware],
  preloadedState: initialState,
  devTools: isDevelopment ? true : false,
});

export default store;
