import * as consts from "../constants/settlementsConstants";

export const settlementsReducer = (state = {}, action) => {
  switch (action.type) {
    case consts.GET_SETTLEMENTS_REQUEST:
      return {
        ...state,
        loadingSettlements: true,
        errMsgSettlements: null,
        settlements: [],
      };

    case consts.GET_SETTLEMENTS_SUCCESS:
      return {
        ...state,
        loadingSettlements: false,
        settlements: action.payload,
      };

    case consts.GET_SETTLEMENTS_FAIL:
      return {
        ...state,
        loadingSettlements: false,
        errMsgSettlements: action.payload,
      };

    default:
      return state;
  }
};

export const deliverySettlementsReducer = (state = {}, action) => {
  switch (action.type) {
    case consts.GET_DELIVERY_SETTLEMENTS_REQUEST:
      return {
        ...state,
        loadingDeliverySettlements: true,
        errMsgDeliverySettlements: null,
        deliverySettlements: [],
      };

    case consts.GET_DELIVERY_SETTLEMENTS_SUCCESS:
      return {
        ...state,
        loadingDeliverySettlements: false,
        deliverySettlements: action.payload,
      };

    case consts.GET_DELIVERY_SETTLEMENTS_FAIL:
      return {
        ...state,
        loadingDeliverySettlements: false,
        errMsgDeliverySettlements: action.payload,
      };

    default:
      return state;
  }
};

export const marketerFinanceReducer = (state = { financeData: [] }, action) => {
  switch (action.type) {
    case consts.GET_MARKETER_FINANCE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        financeData: [],
      };

    case consts.GET_MARKETER_FINANCE_SUCCESS:
      return {
        ...state,
        loading: false,
        financeData: action.payload,
      };

    case consts.GET_MARKETER_FINANCE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};