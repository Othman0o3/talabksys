import * as consts from "../constants/InventoryConstants";

export const inventoryReducer = (state = {}, action) => {
  switch (action.type) {
    case consts.GET_INVENTORY_REQUEST:
      return {
        ...state,
        loadingInventory: true,
        errMsgInventory: null,
        inventory: [],
      };

    case consts.GET_INVENTORY_SUCCESS:
      return {
        ...state,
        loadingInventory: false,
        inventory: action.payload,
      };

    case consts.GET_INVENTORY_FAIL:
      return {
        ...state,
        loadingInventory: false,
        errMsgInventory: action.payload,
      };

    default:
      return state;
  }
};
