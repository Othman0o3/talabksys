import * as consts from "../constants/cityConstants";
import axiosFrmData from "../axiosInstances/axiosFrmData";
import { addAlertMessage } from "./systemActions";

export const getCities = () => async (dispatch) => {
  try {
    dispatch({
      type: consts.GET_CITIES_REQUEST,
    });

    const { data } = await axiosFrmData.post("get/get_Cities.php");

    dispatch({
      type: consts.GET_CITIES_SUCCESS,
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
      type: consts.GET_CITIES_FAIL,
      payload:
        error instanceof Error
          ? error.message
          : error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getPlaces = () => async (dispatch) => {
  try {
    dispatch({
      type: consts.GET_PLACES_REQUEST,
    });

    const { data } = await axiosFrmData.post("get/get_branches.php");

    dispatch({
      type: consts.GET_PLACES_SUCCESS,
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
      type: consts.GET_PLACES_FAIL,
      payload:
        error instanceof Error
          ? error.message
          : error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
