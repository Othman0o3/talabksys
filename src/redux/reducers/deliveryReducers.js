import * as consts from "../constants/deliveryConstants";

export const deliverySummaryReducer = (state = {}, action) => {
  switch (action.type) {
    case consts.GET_DELIVERY_SUMMARY_REQUEST:
      return {
        ...state,
        loadingItemMove: true,
        errMsgItemMove: null,
        itemMove: [],
      };

    case consts.GET_DELIVERY_SUMMARY_SUCCESS:
      return {
        ...state,
        loadingItemMove: false,
        itemMove: action.payload,
      };

    case consts.GET_DELIVERY_SUMMARY_FAIL:
      return {
        ...state,
        loadingItemMove: false,
        errMsgItemMove: action.payload,
      };

    default:
      return state;
  }
};
