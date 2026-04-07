import axios from "axios";
import Cookies from "js-cookie";

const userInfo = Cookies.get("userInfo")
  ? JSON.parse(Cookies.get("userInfo"))
  : {};

const axiosWT = axios.create({
  baseURL: "https://fvtion.com/API/",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${userInfo.token}`,
  },
});

export default axiosWT;
