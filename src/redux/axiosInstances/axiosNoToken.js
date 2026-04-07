import axios from "axios";

const axiosNT = axios.create({
  baseURL: "https://fvtion.com/API/",
  timeout: 10000,
  headers: {
    "Content-type": "application/json",
  },
});

export default axiosNT;
