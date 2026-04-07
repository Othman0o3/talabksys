import * as consts from "../constants/InventoryConstants";
import axiosFrmData from "../axiosInstances/axiosFrmData";
import { addAlertMessage } from "./systemActions";

export const getInventory = (branchId) => async (dispatch) => {
  try {
    dispatch({
      type: consts.GET_INVENTORY_REQUEST,
    });

    const { data } = await axiosFrmData.post("store/Store_aljard.php", {
      BranchID: branchId,
    });

    dispatch({
      type: consts.GET_INVENTORY_SUCCESS,
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
      type: consts.GET_INVENTORY_FAIL,
      payload:
        error instanceof Error
          ? error.message
          : error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
