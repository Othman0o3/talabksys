import axios from "axios";
import Cookies from "js-cookie";

const userInfo = Cookies.get("userInfo")
  ? JSON.parse(Cookies.get("userInfo"))
  : {};

const axiosFrmData = axios.create({
  baseURL: "https://fvtion.com/API/talabk",
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${userInfo.token}`,
  },
});

/*  in case stopped this code the axios instance by default make network error
 but using this code you can handle custom network error message without the need to write
 the error message in each time you use this axios instance */

axiosFrmData.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      throw new Error("خطأ في الشبكة يرجى التأكد من إتصالك بالإنترنت");
    }
    return Promise.reject(error);
  }
);

export default axiosFrmData;
