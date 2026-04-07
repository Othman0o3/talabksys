import * as consts from "../constants/userConstants";

export const userLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case consts.USER_LOGIN_REQUEST:
      return {
        ...state,
        loadingLogin: true,
        errMsgLogin: null,
        loginInfo: null,
      };

    case consts.USER_LOGIN_SUCCESS:
      return {
        ...state,
        loadingLogin: false,
        loginInfo: action.payload,
      };

    case consts.USER_LOGIN_FAIL:
      return {
        ...state,
        loadingLogin: false,
        errMsgLogin: action.payload,
      };

    case consts.USER_LOGOUT:
      return {
        ...state,
        loadingLogin: false,
        errMsgLogin: null,
        loginInfo: null,
      };

    default:
      return state;
  }
};

export const userRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case consts.USER_REGISTER_REQUEST:
      return {
        ...state,
        loadingRegister: true,
        errMsgRegister: null,
        register: null,
      };

    case consts.USER_REGISTER_SUCCESS:
      return {
        ...state,
        loadingRegister: false,
        register: action.payload,
        statusUserRegister: action.status,
      };

    case consts.USER_REGISTER_FAIL:
      return {
        ...state,
        loadingRegister: false,
        errMsgRegister: null,
      };

    case consts.CLEAR_USER_REGISTER:
      return {
        ...state,
        loadingRegister: false,
        errMsgRegister: null,
        register: null,
        statusUserRegister: 0,
      };

    default:
      return state;
  }
};
