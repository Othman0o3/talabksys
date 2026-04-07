import * as consts from "../constants/systemConstants";

export const alertMessagesReducer = (state = {}, action) => {
  switch (action.type) {
    case consts.ADD_ALERT_MESSAGE:
      const maxId = state.messages.reduce(
        (maxId, msg) => Math.max(maxId, msg.id),
        0
      );
      return {
        ...state,
        messages: [...state.messages, { id: maxId + 1, ...action.payload }],
      };

    case consts.REMOVE_ALERT_MESSAGE:
      return {
        ...state,
        messages: state.messages.filter((msg) => msg.id !== action.payload),
      };

    case consts.CLEAR_ALERT_MESSAGE:
      return {
        messages: [],
      };

    default:
      return state;
  }
};

export const ordersSearchDateReducer = (state = {}, action) => {
  switch (action.type) {
    case consts.SET_ORDERS_SEARCH_DATE:
      return {
        ...state,
        dateFrom: action.payload.dateFrom,
        dateTo: action.payload.dateTo,
      };

    default:
      return state;
  }
};

export const storeOrdersSearchDateReducer = (state = {}, action) => {
  switch (action.type) {
    case consts.SET_STORE_ORDERS_SEARCH_DATE:
      return {
        ...state,
        dateFrom: action.payload.dateFrom,
        dateTo: action.payload.dateTo,
      };

    default:
      return state;
  }
};
