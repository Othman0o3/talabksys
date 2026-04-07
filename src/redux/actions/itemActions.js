import * as consts from "../constants/itemConstants";
import axiosFrmData from "../axiosInstances/axiosFrmData";
import { addAlertMessage } from "./systemActions";

export const getItems = (branchId) => async (dispatch) => {
  try {
    dispatch({
      type: consts.GET_ITEMS_REQUEST,
    });
    const { data } = await axiosFrmData.post("store/Store_aljard.php", {
      BranchID: branchId,
    });

    dispatch({
      type: consts.GET_ITEMS_SUCCESS,
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
      type: consts.GET_ITEMS_FAIL,
      payload:
        error instanceof Error
          ? error.message
          : error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getItemMove = (branchId, itemId) => async (dispatch) => {
  try {
    dispatch({
      type: consts.GET_ITEM_MOVE_REQUEST,
    });

    const { data } = await axiosFrmData.post("store/Item_movement.php", {
      BranchID: branchId,
      ItemNum: itemId,
    });

    dispatch({
      type: consts.GET_ITEM_MOVE_SUCCESS,
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
      type: consts.GET_ITEM_MOVE_FAIL,
      payload:
        error instanceof Error
          ? error.message
          : error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
