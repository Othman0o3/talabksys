import * as consts from "../constants/settlementsConstants";
import axiosFrmData from "../axiosInstances/axiosFrmData";
import { addAlertMessage } from "./systemActions";

export const getSettlements = (branchId) => async (dispatch) => {
  try {
    dispatch({
      type: consts.GET_SETTLEMENTS_REQUEST,
    });

    const { data } = await axiosFrmData.post("store/Store_almahfaza.php", {
      BranchID: branchId,
    });

    dispatch({
      type: consts.GET_SETTLEMENTS_SUCCESS,
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
      type: consts.GET_SETTLEMENTS_FAIL,
      payload: message,
    });
  }
};

export const getDeliverySettlements = (branchId) => async (dispatch) => {
  try {
    dispatch({
      type: consts.GET_DELIVERY_SETTLEMENTS_REQUEST,
    });

    const { data } = await axiosFrmData.post("mandub/Mandub_almahfaza.php", {
      BranchID: branchId,
    });

    dispatch({
      type: consts.GET_DELIVERY_SETTLEMENTS_SUCCESS,
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
      type: consts.GET_DELIVERY_SETTLEMENTS_FAIL,
      payload: message,
    });
  }
};

export const getMarketerFinance = (branchId) => async (dispatch) => {
  try {
    dispatch({
      type: consts.GET_MARKETER_FINANCE_REQUEST,
    });

    const { data } = await axiosFrmData.post("misuq/Misuq_almahfaza.php", {
      BranchID: branchId,
    });

    dispatch({
      type: consts.GET_MARKETER_FINANCE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : error.response && error.response.data.message
        ? error.response.data.message
        : error.message;

    dispatch(addAlertMessage(message, "error"));
    dispatch({
      type: consts.GET_MARKETER_FINANCE_FAIL,
      payload: message,
    });
  }
};