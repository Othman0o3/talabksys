import * as consts from "../constants/userConstants";
import { addAlertMessage } from "./systemActions";
import axiosFrmData from "../axiosInstances/axiosFrmData";
import Cookies from "js-cookie";
import { Axios } from "axios";

export const login = (username, password) => async (dispatch) => {
  try {
    dispatch({
      type: consts.USER_LOGIN_REQUEST,
    });
    const { data } = await axiosFrmData.post("web_login_v3.php", {
      User: username,
      PassUser: password,
    });

    dispatch({
      type: consts.USER_LOGIN_SUCCESS,
      payload: data,
    });

    Cookies.set("userInfo", JSON.stringify(data), {
      // httpOnly: true, this wont let you access the token or any other else (hackers)
      secure: true, // Only send over HTTPS connections
      expires: 1, // Expire after 1 days
      sameSite: "strict" /* Restrict cross-site requests */,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : error.response.data.message
        ? error.response.data.message
        : error.message;
    error.response
      ? error.response.status === 401 &&
        dispatch(
          addAlertMessage("يرجى التحقق من  اسم المستخدم و كلمة المرور", "error")
        )
      : error instanceof Error &&
        dispatch(
          addAlertMessage(
            "خطأ في الشبكة يرجى التأكد من إتصالك بالإنترنت",
            "error"
          )
        );

    dispatch({
      type: consts.USER_LOGIN_FAIL,
      payload:
        error instanceof Error
          ? error.message
          : error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const userRegister =
  (email, storeName, scopeOfWork, phone1, phone2, phone3, address) =>
  async (dispatch) => {
    try {
      dispatch({
        type: consts.USER_REGISTER_REQUEST,
      });
      const { data, status } = await axiosFrmData.post("wep_Registration.php", {
        email: email,
        storeName: storeName,
        shWork: scopeOfWork,
        tel1: phone1,
        tel2: phone2,
        tel3: phone3,
        address: address,
      });
      dispatch({
        type: consts.USER_REGISTER_SUCCESS,
        payload: data,
        status: status,
      });
    } catch (error) {
      const message = error.response.data.message
        ? error.response.data.message
        : error.message;
      dispatch(addAlertMessage("يوجد متجر مسجل بنفس الإسم مسبقاً", "error"));

      dispatch({
        type: consts.USER_REGISTER_FAIL,
        payload: message,
      });
    }
  };

export const logout = () => async (dispatch) => {
  Cookies.remove("userInfo");
  dispatch({
    type: consts.USER_LOGOUT,
  });
};

export const clearUserRegister = () => async (dispatch) => {
  Cookies.remove("userInfo");
  dispatch({
    type: consts.CLEAR_USER_REGISTER,
  });
};
