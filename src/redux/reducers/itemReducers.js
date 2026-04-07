import * as consts from "../constants/itemConstants";

export const itemsReducer = (state = {}, action) => {
  switch (action.type) {
    case consts.GET_ITEMS_REQUEST:
      return {
        ...state,
        loadingItems: true,
        errMsgItems: null,
        items: [],
      };

    case consts.GET_ITEMS_SUCCESS:
      return {
        ...state,
        loadingItems: false,
        items: action.payload,
      };

    case consts.GET_ITEMS_FAIL:
      return {
        ...state,
        loadingItems: false,
        errMsgItems: action.payload,
      };

    default:
      return state;
  }
};

export const itemMoveReducer = (state = {}, action) => {
  switch (action.type) {
    case consts.GET_ITEM_MOVE_REQUEST:
      return {
        ...state,
        loadingItemMove: true,
        errMsgItemMove: null,
        itemMove: [],
      };

    case consts.GET_ITEM_MOVE_SUCCESS:
      return {
        ...state,
        loadingItemMove: false,
        itemMove: action.payload,
      };

    case consts.GET_ITEM_MOVE_FAIL:
      return {
        ...state,
        loadingItemMove: false,
        errMsgItemMove: action.payload,
      };

    default:
      return state;
  }
};
